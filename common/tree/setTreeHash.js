const utility = rootRequire('helper/utility');

module.exports = async Tree => {
  
  Tree.setTreeHash = async (treeId, treeHashId) => {
    let treeModel = await Tree.fetchModel(treeId.toString());

    let updatedTreeModel = await treeModel.updateAttributes({
      treeHashId,
      lastUpdate: utility.getUnixTimeStamp()
    });

    return updatedTreeModel;
  };

  Tree.setTreeHash = utility.wrapper(Tree.setTreeHash);

  Tree.remoteMethod('setTreeHash', {
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
      path: '/:treeId/setTreeHash/:treeHashId',
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