const getTreeContract = require('./getTreeContract');

module.exports = async owner => {
  const Tree = await getTreeContract();
  const result = Tree.tokensOf(owner).call();
  return result;
};
