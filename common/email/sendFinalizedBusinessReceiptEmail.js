const utility = rootRequire('helper/utility');
const cheerio = require('cheerio');

let app = rootRequire('server/server');

module.exports = async EmailSender => {

  const vars = app.vars;
  
  EmailSender.sendFinalizedBusinessReceiptEmail =
    async (clientId, receiptId, vouchersArray) => {

    let Client = app.models.client;
    let clientModel = 
      await Client.fetchModel(clientId.toString());
    
    let Receipt = app.models.receipt;
    await Receipt.fetchModel(receiptId.toString());

    function messageLoader(orderNumber, voucherData) {
      return `Your recent order payment is confirmed and the following vouchers are generated for you. You can distribute them now!\nVouchers:\n${voucherData}Order Number: <b>${orderNumber}</b>`; //eslint-disable-line
    }

    function voucherLoader(row, voucherCode, capacityNumber, 
      unitPrice, treeName, treeLocation) {
      return `${row}. <b>${voucherCode}</b> for <b>${capacityNumber}</b> people - <b>${unitPrice}</b> <b>${treeName}</b> in <b>${treeLocation}</b>\n`; //eslint-disable-line
    }

    let voucherString = '';
    for (let i = 0; i < vouchersArray.length; i++) {
      let voucherModel = vouchersArray[i];
      let treeType = vars.config.treeType[voucherModel.items[0].identifier];
      voucherString += voucherLoader(i, voucherModel.id, 
        voucherModel.usageCapacity, treeType.price, treeType.type, 
        treeType.region);
    }

    let message = messageLoader(receiptId, voucherString);

    const $ = cheerio.load(app.templates.index);

    $('#TRJ_Heading').text('Your New Treejer Vouchers Have Arrived!');
    $('#TRJ_Title').text('Dear ' + clientModel.firstname + ',');
    $('#TRJ_Message').text(message);
    $('#TRJ_CTA').text('Enter Planet');
    $('#TRJ_CTA').attr('href', 'http://treejer.com/planet');

    await EmailSender.sendEmail(clientModel.email.toString(), 
      'Treejer: New Payment Confirmed - Vouchers Are Ready', $.html());

    return true;
  };

  EmailSender.sendFinalizedBusinessReceiptEmail = 
    utility.wrapper(EmailSender.sendFinalizedBusinessReceiptEmail);

  EmailSender.remoteMethod('sendFinalizedBusinessReceiptEmail', {
    description: 'Send Sample Email',
    accepts: [{
      arg: 'clientId',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'invitationCode',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:clientId/sendFinalizedEmail/businessReceipt/:receiptId',
      verb: 'POST',
      status: 200,
      errorStatus: 400
    },
    returns: {
      type: 'object',
      root: true
    }
  });

};