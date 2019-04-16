let app = require('../../server/server');

module.exports = async Client => {

  let statusList = [];
  for (let key in app.vars.config.clientStatus) {
    statusList.push(app.vars.config.clientStatus[key]);
	}

	Client.validatesInclusionOf('status', { in: statusList });

  require('../client/createLogic')(Client);
  require('../client/changeStatus')(Client);

};
