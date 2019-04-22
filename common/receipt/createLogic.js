const validator = rootRequire('helper/validator');
const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Receipt => {

  const vars = app.vars;

  Receipt.createLogic = async ctx => {
    let Client = app.models.client;
    let clientModel = 
      await Client.fetchModel(ctx.args.data.clientId.toString());

    if (clientModel.status === vars.config.clientStatus.waitList) {
      throw createError(404, 
        'Error! Sorry, you need an invitation to submit an invoice.');
    }  

    if (ctx.args.data.items.length === 0) {
      throw createError(400, 'Error! Item list is empty which cannot be.');
    }

    if (!vars.config.receiptType[ctx.args.data.type]) {
      throw createError(404, 
        'Error! The receipt type is not defined and is invalid.');
    }

    if (!vars.config.receiptMethod[ctx.args.data.method]) {
      throw createError(404, 
        'Error! The provided method is not defined and is invalid.');
    }

    ctx.args.data.type = vars.config.receiptType[ctx.args.data.type];
    ctx.args.data.method = vars.config.receiptMethod[ctx.args.data.method];
    ctx.args.data.status = vars.config.receiptStatus.pending;

    let price = 0;
    for (let i = 0; i < ctx.args.data.items.length; i++) {
      let itemModel = ctx.args.data.items[i];
      if (!vars.config.treeType[itemModel.identifier]) {
        throw createError(404, 'Error! Tree type does not recognized.');
      }
      price += Number(vars.config.treeType[itemModel.identifier].price) * 
        Number(itemModel.quantity);
    }

    if (price !== Number(ctx.args.data.price)) {
      throw createError(400, 'Error! Receipt price is not correct.');
    }

    if (ctx.args.data.method === vars.config.receiptMethod.ethereum) {
      ctx.args.data.ethModel = 
        await Receipt.exchange(Number(ctx.args.data.price));
    }

    ctx.args.data.createDate = utility.getUnixTimeStamp();
    ctx.args.data.lastUpdate = utility.getUnixTimeStamp();

    return;
  };

  Receipt.createLogic = utility.wrapper(Receipt.createLogic);

  Receipt.beforeRemote('create', async ctx => {
    validator(ctx.args.data, {
      white: ['clientId', 'type', 'price', 'items', 'method'],
      required: ['clientId', 'type', 'price', 'items', 'method']
    });

    await Receipt.createLogic(ctx);
  });

  Receipt.afterRemote('create', async (ctx, modelInstance) => {
    let Client = app.models.client;
    await Client.fetchModel(modelInstance.clientId.toString());

    let EmailSender = app.models.emailSender;
    await EmailSender.sendReceiptEmail(
      modelInstance.clientId.toString(), modelInstance.id.toString());
  });

};