const crypto = require('crypto');
const utility = rootRequire('helper/utility');
let createError = require('http-errors');

const mintTree = require('../../server/blockchain/Tree/mintTree');
const setTreeType = require('../../server/blockchain/Tree/setTreeType');

let app = rootRequire('server/server');

module.exports = async Tree => {

  const vars = app.vars;

  Tree.createLogic = async (clientId, treeItems, procedure) => {
    let Client = app.models.client;
    await Client.fetchModel(clientId.toString());

    let date = utility.getUnixTimeStamp();
    let preData = {
      clientId,
      createDate: date,
      lastUpdate: date,
      procedure,
      status: vars.config.treeStatus.planted,
      planter: vars.const.treejerCompany,
      conserver: vars.const.treejerCompany,
      ranger: vars.const.treejerCompany
    };

    let dataArray = [];
    for (let i = 0; i < treeItems.length; i++) {
      let itemModel = treeItems[i];
      if (!vars.config.treeType[itemModel.identifier]) {
        throw createError(404, 'Error! Tree type does not recognized.');
      }
      for (let j = 0; j < Number(itemModel.quantity); j++) {
        let data = JSON.parse(JSON.stringify(preData));
        data.id = utility.getUnixTimeStamp() * (j + 1) * (j + i + 1);
        data.treeHashId = data.id;
        data.type = vars.config.treeType[itemModel.identifier];
        dataArray.push(data);
      }
    }

    let treeList = await Tree.create(dataArray);

    for (let i = 0; i < treeList.length; i++) {
      let treeModel = treeList[i];
      let hash = crypto.createHash('sha256');
      hash.update(treeModel.clientId.toString());
      let address = hash.digest('hex').substring(0, 40);
      await mintTree(Number(treeModel.id), address, 
        treeModel.createDate.toString(), treeModel.lastUpdate.toString(), 
        treeModel.procedure, treeModel.status, 
        treeModel.planter, treeModel.conserver, treeModel.ranger);
      await setTreeType(Number(treeModel.id), treeModel.type.type, 
        treeModel.type.scientificName, Number(treeModel.type.price), 
        treeModel.type.geolocation, treeModel.type.region, 
        treeModel.type.drive, Number(treeModel.type.age), 
        Number(treeModel.type.O2RatePerDay));
    }

    return treeList;
  };

  Tree.createLogic = utility.wrapper(Tree.createLogic);

  Tree.remoteMethod('createLogic', {
    description: 'Create Logic for Generating Trees',
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
      arg: 'procedure',
      type: 'string',
      required: true,
      http: {
        source: 'query'
      }
    }],
    http: {
      path: '/createLogic/:clientId',
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