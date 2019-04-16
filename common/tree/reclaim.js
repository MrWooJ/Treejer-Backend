const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Tree => {

  Tree.reclaim = async (clientId, voucherCode) => {
    let Client = app.models.client;
    await Client.fetchModel(clientId.toString());

    let Voucher = app.models.voucher;
    let voucherModel = await Voucher.fetchModel(voucherCode.toString());

    if (voucherModel.clientId.toString() === clientId.toString()) {
      throw createError(400, 'Error! You cannot reclaim your own vouchers.');
    }

    let receiversList = JSON.parse(JSON.stringify(voucherModel.receivers));
    if (receiversList.indexOf(clientId.toString()) >= 0) {
      throw createError(400, 'Error! You have already claimed the tree.');
    }

    receiversList.push(clientId.toString());
    await voucherModel.updateAttribute('receivers', receiversList);

    let treeList = await Tree.createLogic(clientId.toString(), 
      voucherModel.items, voucherModel.type);
     
    await Voucher.increaseUsage(voucherCode.toString());

    return treeList;
  };

  Tree.reclaim = utility.wrapper(Tree.reclaim);

  Tree.remoteMethod('reclaim', {
    description: 'Reclaim Trees by a Voucher Code',
    accepts: [{
      arg: 'clientId',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'voucherCode',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:clientId/reclaim/:voucherCode',
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