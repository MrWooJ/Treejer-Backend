const clientStatus = require('../config/client.status.js');
const invitationStatus = require('../config/invitation.status.js');

module.exports = server => {
  server.vars = {
    config: {
      clientStatus,
      invitationStatus
    },
    const: {
    }
  };
};
