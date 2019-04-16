const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Voucher => {

  const vars = app.vars;
  
  Voucher.changeCapacity = async (voucherCode, newCapacity) => {
    let voucherModel = 
      await Voucher.fetchModel(voucherCode.toString());

    // if (voucherModel.status !== vars.config.voucherStatus.available) {
    //   throw createError(400, 
    //     'Error! Capacity can be changed only for available voucher codes.');
    // }

    if (Number(newCapacity) <= Number(voucherModel.numberOfUsage)) {
      throw createError(400, 
        'Error! Capacity cannot be lower than current number usages.');
    }

    let updatedVoucherModel = await voucherModel.updateAttributes({
      usageCapacity: Number(newCapacity),
      status: vars.config.invitationStatus.available,
      lastUpdate: utility.getUnixTimeStamp()
    });

    return updatedVoucherModel;
  };

  Voucher.changeCapacity = 
    utility.wrapper(Voucher.changeCapacity);

  Voucher.remoteMethod('changeCapacity', {
    description: 'Change Capacity of the Voucher Code',
    accepts: [{
      arg: 'invitationCode',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'newStatus',
      type: 'number',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:voucherCode/changeCapacity/:newCapacity',
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