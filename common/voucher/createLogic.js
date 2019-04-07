const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = async Voucher => {

  const vars = app.vars;

  Voucher.createLogic = 
    async (clientId, treeItems, voucheType, usageCapacity) => {
    let Client = app.models.client;
    await Client.fetchModel(clientId.toString());

    let date = utility.getUnixTimeStamp();
    let data = {
      clientId,
      createDate: date,
      lastUpdate: date,
      status: vars.config.voucherStatus.available,
      type: voucheType,
      numberOfUsage: 0,
      usageCapacity: Number(usageCapacity),
      treeItems,
      receivers: []
    };

    let voucherModel = await Voucher.create(data);
    return voucherModel;
  };

  Voucher.createLogic = utility.wrapper(Voucher.createLogic);

  Voucher.remoteMethod('createLogic', {
    description: 'Create a Logic for Generating a Voucher',
    accepts: [{
      arg: 'clientId',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'treeItems',
      type: 'array',
      required: true,
      http: {
        source: 'body'
      }
    }, {
      arg: 'voucheType',
      type: 'string',
      required: true,
      http: {
        source: 'query'
      }
    }, {
      arg: 'usageCapacity',
      type: 'number',
      required: true,
      http: {
        source: 'query'
      }
    }],
    http: {
      path: '/createLogic',
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