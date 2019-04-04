let app = require('../../server/server');

module.exports = async Voucher => {

  let typeList = [];
  for (let key in app.vars.config.voucherType) {
    typeList.push(app.vars.config.voucherType[key]);
	}

	Voucher.validatesInclusionOf('type', { in: typeList });

  let statusList = [];
  for (let key in app.vars.config.voucherStatus) {
    statusList.push(app.vars.config.voucherStatus[key]);
	}

	Voucher.validatesInclusionOf('status', { in: statusList });

};
