const validator = rootRequire('helper/validator');
const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Receipt => {

  const vars = app.vars;

  Receipt.createLogic = async ctx => {
    if (ctx.args.data.items.length === 0) {
      throw createError(400, 'Error! Item list is empty which cannot be.');
    }

    ctx.args.data.status = vars.config.receiptStatus.pending;
    ctx.args.data.createDate = utility.getUnixTimeStamp();
    ctx.args.data.lastUpdate = utility.getUnixTimeStamp();

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

    return;
  };

  Receipt.createLogic = utility.wrapper(Receipt.createLogic);

  Receipt.beforeRemote('create', async ctx => {
    validator(ctx.args, {
      white: ['clientId', 'type', 'price', 'items'],
      required: ['clientId', 'type', 'price', 'items']
    });

    await Receipt.createLogic(ctx);
  });

};