const clientStatus = require('../config/client.status.js');
const invitationStatus = require('../config/invitation.status.js');
const receiptMethod = require('../config/receipt.method.js');
const receiptStatus = require('../config/receipt.status.js');
const receiptType = require('../config/receipt.type.js');
const treeStatus = require('../config/tree.status.js');
const treeType = require('../config/tree.type.js');
const voucherStatus = require('../config/voucher.status.js');
const voucherType = require('../config/voucher.type.js');

const treejerCompany = 'Treejer';
const maximumUsageCapacity = 100;

module.exports = server => {
  server.vars = {
    config: {
      clientStatus,
      invitationStatus,
      receiptMethod,
      receiptStatus,
      receiptType,
      treeStatus,
      treeType,
      voucherStatus,
      voucherType
    },
    const: {
      treejerCompany,
      maximumUsageCapacity
    }
  };
};
