const utility = rootRequire('helper/utility');
const cheerio = require('cheerio');

let app = rootRequire('server/server');

module.exports = async EmailSender => {

  const vars = app.vars;

  EmailSender.sendFinalizedGiftReceiptEmail = 
    async (clientId, receiptId, voucherModel) => {
    let Client = app.models.client;
    let clientModel = 
      await Client.fetchModel(clientId.toString());
    
    let Receipt = app.models.receipt;
    await Receipt.fetchModel(receiptId.toString());

    function messageLoader(voucherCode, voucherData, orderNumber) {
      return `Your recent order payment is confirmed and the following voucher is generated for you. You can send it as a gift to your friend now!\nVoucher:\n${voucherCode} for 1 friend - including trees:\n${voucherData}Order Number: ${orderNumber}`; //eslint-disable-line
    }

    function voucherLoader(treeQuantity, treeName, unitPrice, treeLocation) {
      return `${treeQuantity} ${treeName} for ${unitPrice} unit price in ${treeLocation}\n`; //eslint-disable-line
    }

    let voucherString = '';
    for (let i = 0; i < voucherModel.items.length; i++) {
      let treeModel = voucherModel.items[i];
      let treeType = vars.config.treeType[treeModel.identifier];
      voucherString += voucherLoader(treeModel.quantity, 
        treeType.type, treeType.price, treeType.region);
    }

    let message = messageLoader(voucherModel.id, voucherString, receiptId);

    const $ = cheerio.load(app.templates.index);

    $('#TRJ_Headline').text('Your New Treejer Voucher Has Arrived!');
    $('#TRJ_Title').text('Dear ' + clientModel.firstname + ',');
    $('#TRJ_Message').text(message);
    $('#TRJ_CTA').text('Enter Planet');
    $('#TRJ_CTA').attr('href', 'http://treejer.com/planet');

    await EmailSender.sendEmail(clientModel.email.toString(), 
      'Treejer: New Payment Confirmed - Voucher is Ready', $.html());

    return true;
  };

  EmailSender.sendFinalizedGiftReceiptEmail = 
    utility.wrapper(EmailSender.sendFinalizedGiftReceiptEmail);

  EmailSender.remoteMethod('sendFinalizedGiftReceiptEmail', {
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
      path: '/:clientId/sendFinalizedEmail/giftReceipt/:receiptId',
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