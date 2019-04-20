const getTronWeb3 = require('../getTronWeb3');

module.exports = async function() {
  const tronWeb3 = getTronWeb3();
  let address = process.env.TRJ_ContractAddress;
  address = tronWeb3.address.fromHex(address);

  return tronWeb3.contract().at(address);
};
