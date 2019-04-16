const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Voucher => {

  const vars = app.vars;
  
  Voucher.changeStatus = async (voucherCode, newStatus) => {
    let voicherModel = 
      await Voucher.fetchModel(voucherCode.toString());

    if (!vars.config.voucherStatus[newStatus]) {
      throw createError(404, 
        'Error! The provided status code is not defined.');
    }

    if (vars.config.invitationStatus[newStatus] === 
      vars.config.invitationStatus.available &&
      Number(voicherModel.usageCapacity) <= 
      Number(voicherModel.numberOfUsage)) {
    throw createError(400, 
      'Error! Cannot change status duo to passing the usage capacity.');
    }

    let updatedVoucherModel = await voicherModel.updateAttributes({
      status: vars.config.voucherStatus[newStatus],
      lastUpdate: utility.getUnixTimeStamp()
    });

    return updatedVoucherModel;
  };

  Voucher.changeStatus = 
    utility.wrapper(Voucher.changeStatus);

  Voucher.remoteMethod('changeStatus', {
    description: 'Change Status of the Voucher Code',
    accepts: [{
      arg: 'voucherCode',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'newStatus',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:voucherCode/changeStatus/:newStatus',
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