const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = async Tree => {
  
  const vars = app.vars;

  Tree.treeModels = async () => {
    let treeList = vars.config.treeType;
    return treeList;
  };

  Tree.treeModels = utility.wrapper(Tree.treeModels);

  Tree.remoteMethod('treeModels', {
    description: 'Change Status of the Tree',
    accepts: [],
    http: {
      path: '/treeModels',
      verb: 'GET',
      status: 200,
      errorStatus: 400
    },
    returns: {
      type: 'object',
      root: true
    }
  });

};