const getTreeContract = require('./getTreeContract');

module.exports = async treeId => {
  const Tree = await getTreeContract();
  const treeDoc = await Tree.getTreeDoc(+treeId).call();
  const treeType = await Tree.getType(+treeId).call();
  return { ...treeDoc, treeType };
};
