const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Voucher => {

  const vars = app.vars;
  
  Voucher.increaseUsage = async voucherCode => {
    let voucherModel = 
      await Voucher.fetchModel(voucherCode.toString());

    if (voucherModel.status !== vars.config.voucherStatus.available) {
      throw createError(400, 
        'Error! Capacity can be changed only for available vouchers.');
    }

    let lastStatus = voucherModel.status;
    if (Number(voucherModel.numberOfUsage) + 1 === 
        Number(voucherModel.usageCapacity)) {
      lastStatus = vars.config.voucherStatus.finished;
    }

    let updatedVoucherModel = await voucherModel.updateAttributes({
      status: lastStatus,
      numberOfUsage: Number(voucherModel.numberOfUsage) + 1,
      lastUpdate: utility.getUnixTimeStamp()
    });

    return updatedVoucherModel;
  };

  Voucher.increaseUsage = utility.wrapper(Voucher.increaseUsage);

  Voucher.remoteMethod('increaseUsage', {
    description: 'Increase usages of the Voucher Code by One',
    accepts: [{
      arg: 'voucherCode',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:voucherCode/increaseUsage',
      verb: 'PUT',
      status: 200,
      errorStatus: 400
    },
    returns: {
      type: 'object',
      root: true
    }
  });

};