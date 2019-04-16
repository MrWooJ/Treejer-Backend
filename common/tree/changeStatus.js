const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Tree => {

  const vars = app.vars;
  
  Tree.changeStatus = async (treeId, newStatus) => {
    let treeModel = await Tree.fetchModel(treeId.toString());

    if (!vars.config.treeStatus[newStatus]) {
      throw createError(404, 
        'Error! The provided status code is not defined.');
    }

    // TODO: BLOCKCHAIN: Change Status of a Tree inside the Blockchain

    let updatedTreeModel = await treeModel.updateAttributes({
      status: vars.config.treeStatus[newStatus],
      lastUpdate: utility.getUnixTimeStamp()
    });

    return updatedTreeModel;
  };

  Tree.changeStatus = utility.wrapper(Tree.changeStatus);

  Tree.remoteMethod('changeStatus', {
    description: 'Change Status of the Tree',
    accepts: [{
      arg: 'treeId',
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
      path: '/:treeId/changeStatus/:newStatus',
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