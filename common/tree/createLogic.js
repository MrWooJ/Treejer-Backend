const utility = rootRequire('helper/utility');
let createError = require('http-errors');

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
        data.treeHashId = 'N/A';
        data.type = vars.config.treeType[itemModel.identifier];
        dataArray.push(data);
        // TODO: BLOCKCHAIN: Mint a Tree inside the Blockchain  
      }
    }

    let treeList = await Tree.create(dataArray);
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