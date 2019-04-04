const clientStatus = require('../config/client.status.js');
const invitationStatus = require('../config/invitation.status.js');
const treeStatus = require('../config/tree.status.js');
const treeType = require('../config/tree.type.js');

module.exports = server => {
  server.vars = {
    config: {
      clientStatus,
      invitationStatus,
      treeStatus,
      treeType
    },
    const: {
    }
  };
};
