const getTreeContract = require('./getTreeContract');

module.exports = async () => {
  const Tree = await getTreeContract();

  return new Promise((resolve, reject) => {
    Tree.Transfer().watch((error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve({
          ...result.result,
          block: result.block,
          transaction: result.transaction,
          timestamp: result.timestamp
        });
      }
    });
  });
};
