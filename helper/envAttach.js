const clientStatus = require('../config/client.status.js');
const invitationStatus = require('../config/invitation.status.js');
const treeTypes = require('../config/tree.type.js');

module.exports = server => {
  server.vars = {
    config: {
      clientStatus,
      invitationStatus,
      treeTypes
    },
    const: {
    }
  };
};
