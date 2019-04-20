const getTreeContract = require('./getTreeContract');

module.exports = async (treeId, clientId, createdDate, 
  lastUpdate, procedure, status, planter, conserver, ranger) => {
  const Tree = await getTreeContract();
  const result = await Tree.mintTree(+treeId, clientId, createdDate, 
    lastUpdate, procedure, status, planter, conserver, ranger).send();
  return result;
};
