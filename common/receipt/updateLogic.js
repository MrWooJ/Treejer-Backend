const validator = rootRequire('helper/validator');
const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Receipt => {

  const vars = app.vars;

  Receipt.updateLogic = async ctx => {
    let receiptModel = await Receipt.fetchModel(ctx.args.data.id.toString());
    if (receiptModel.status !== vars.config.receiptStatus.pending) {
      throw createError(403, 'Error! Only pending receipts can be edited.');
    }
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

  Receipt.updateLogic = utility.wrapper(Receipt.updateLogic);

  Receipt.beforeRemote('updateById', async ctx => {
    validator(ctx.args, {
      white: ['type', 'price', 'items'],
      required: ['type', 'price', 'items']
    });

    await Receipt.updateLogic(ctx);
  });

};