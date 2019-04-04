const clientStatus = require('../config/client.status.js');
const invitationStatus = require('../config/invitation.status.js');
const receiptStatus = require('../config/receipt.status.js');
const treeStatus = require('../config/tree.status.js');
const treeType = require('../config/tree.type.js');

module.exports = server => {
  server.vars = {
    config: {
      clientStatus,
      invitationStatus,
      receiptStatus,
      treeStatus,
      treeType
    },
    const: {
    }
  };
};
