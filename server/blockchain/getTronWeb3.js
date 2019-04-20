const Tronweb = require('tronweb');

module.exports = function() {
  const tronWeb3 = new Tronweb(
    {
      fullNode: process.env.TRJ_FullNodeURL,
      solidityNode: process.env.TRJ_FullNodeURL,
      eventServer: process.env.TRJ_FullNodeURL
    }
  );

  tronWeb3.setPrivateKey(process.env.TRJ_PrivateKey);
  tronWeb3.setAddress(process.env.TRJ_WalletAddress);

  return tronWeb3;
};
