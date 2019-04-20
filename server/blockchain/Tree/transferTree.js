const getTreeContract = require('./getTreeContract');

module.exports = async (from, to, treeId) => {
  const Tree = await getTreeContract();
  const result = await Tree.transfer(from, to, treeId).send({
    feeLimit: 10000
  });
  return result;
};
