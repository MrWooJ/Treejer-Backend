let app = require('../../server/server');

module.exports = async Tree => {

  let typeList = [];
  for (let key in app.vars.config.treeType) {
    typeList.push(app.vars.config.treeType[key]);
	}

	Tree.validatesInclusionOf('type', { in: typeList });

  let statusList = [];
  for (let key in app.vars.config.treeStatus) {
    statusList.push(app.vars.config.treeStatus[key]);
	}

	Tree.validatesInclusionOf('status', { in: statusList });

  let procedureList = [];
  for (let key in app.vars.config.receiptType) {
    procedureList.push(app.vars.config.receiptType[key]);
	}

	Tree.validatesInclusionOf('procedure', { in: procedureList });

  require('../tree/changeStatus')(Tree);
  require('../tree/createLogic')(Tree);
  require('../tree/reclaim')(Tree);
  require('../tree/setTreeHash')(Tree);
  require('../tree/treeModels')(Tree);

};
