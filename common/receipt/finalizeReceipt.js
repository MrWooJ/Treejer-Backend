const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Receipt => {

  const vars = app.vars;
  
  Receipt.finalizeReceipt = async receiptId => {
    let receiptModel = await Receipt.fetchModel(receiptId.toString());
    if (receiptModel.status !== vars.config.receiptStatus.pending) {
      throw createError(403, 'Error! Only pending receipts can be finalized.');
    }

    let Tree = app.models.tree;
    let Voucher = app.models.voucher;
    if (receiptModel.type === vars.config.receiptType.personalForest) {
      await Tree.createLogic(receiptModel.clientId.toString(), 
        receiptModel.items);
      // TODO: email successful operation to user
    }
    else if (receiptModel.type === vars.config.receiptType.giftToFriend) {
      await Voucher.createLogic(receiptModel.clientId.toString(), 
        receiptModel.items, vars.config.voucheType.giftToFriend, 1);
      // TODO: email voucher details to clientId email
    }
    else if (receiptModel.type === vars.config.receiptType.business) {
      for (let i = 0; i < receiptModel.items.length; i++) {
        let treeModel = receiptModel.items[i];
        await Voucher.createLogic(receiptModel.clientId.toString(), 
          [treeModel], vars.config.voucheType.business, treeModel.quantity);
        // TODO: email voucher details to clientId email
      }
    }

    let updatedReceiptModel = await receiptModel.updateAttributes({
      lastUpdate: utility.getUnixTimeStamp(),
      status: vars.config.receiptStatus.successful
    });

    return updatedReceiptModel;
  };

  Receipt.finalizeReceipt = 
    utility.wrapper(Receipt.finalizeReceipt);

  Receipt.remoteMethod('finalizeReceipt', {
    description: 'Finalize a Receipt based on the Provided Receipt Identifier',
    accepts: [{
      arg: 'receiptId',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:receiptId/finalizeReceipt',
      verb: 'POST',
      status: 200,
      errorStatus: 400
    },
    returns: {
      type: 'object',
      root: true
    }
  });

};