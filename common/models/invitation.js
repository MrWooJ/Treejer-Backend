let app = require('../../server/server');

module.exports = async Invitation => {

  let statusList = [];
  for (let key in app.vars.config.invitationStatus) {
    statusList.push(app.vars.config.invitationStatus[key]);
	}

	Invitation.validatesInclusionOf('status', { in: statusList });

  require('../invitation/createLogic')(Invitation);
  require('../invitation/changeStatus')(Invitation);

};
