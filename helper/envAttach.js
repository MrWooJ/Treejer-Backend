const clientStatus = require('../config/client.status.js');

module.exports = server => {
  server.vars = {
    config: {
      clientStatus
    },
    const: {
    }
  };
};
