const getTronWeb3 = require('./getTronWeb3');

module.exports = async (amount, duration, address, receiverAddress) => {
  const tronWeb3 = await getTronWeb3();
  return tronWeb3.transactionBuilder.freezeBalance(
    tronWeb3.toSun(amount), duration, 'ENERGY', address, receiverAddress);
};
