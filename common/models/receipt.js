let app = require('../../server/server');

module.exports = async Receipt => {

  let typeList = [];
  for (let key in app.vars.config.receiptType) {
    typeList.push(app.vars.config.receiptType[key]);
	}

	Receipt.validatesInclusionOf('type', { in: typeList });

  let statusList = [];
  for (let key in app.vars.config.receiptStatus) {
    statusList.push(app.vars.config.receiptStatus[key]);
	}

	Receipt.validatesInclusionOf('status', { in: statusList });

  require('../receipt/createLogic')(Receipt);
  require('../receipt/updateLogic')(Receipt);

};
