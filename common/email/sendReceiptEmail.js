const utility = rootRequire('helper/utility');
const cheerio = require('cheerio');

let app = rootRequire('server/server');

module.exports = async EmailSender => {

  EmailSender.sendReceiptEmail = async (clientId, receiptId) => {
    let Client = app.models.client;
    let clientModel = 
      await Client.fetchModel(clientId.toString());
    
    let Receipt = app.models.receipt;
    let receiptModel = await Receipt.fetchModel(receiptId.toString());

    function messageLoader(orderNumber, treeCount, totalPrice, 
      fiatPaymentInfo, ethereumPaymentInfo) {
      return `Your recently submitted order <b>${orderNumber}</b> is pending. Please proceed the payment in 24 hour. <b>${treeCount}</b> trees valued at <b>${totalPrice}</b> will be added to your forest after confirmation.<br>Pay with Visa/Master Card:<br><b>${fiatPaymentInfo}</b><br>Pay with Ethereum:<br><b>${ethereumPaymentInfo}</b><br><br>IMPORTANT<br>After 24 hours this invoice will be expired and you need to make a new one.` //eslint-disable-line
    }

    let fiatPayment = `Account Number: 0000045558334545
    NIB: 0023 0000 45558334545 94
    IBAN: PT50 0023 0000 4555 8334 5459 4
    SWIFT: ACTVPTPL`;
    let etherPayment = '0x0e6E90dD9Cb928f34c1E6E5d0E2724890D273D88';

    let treeNumber = 0;
    for (let i = 0; i < receiptModel.items.length; i++) {
      let treeItem = receiptModel.items[i];
      treeNumber += Number(treeItem.quantity);
    }

    const $ = cheerio.load(app.templates.index);

    let message = messageLoader(receiptId, treeNumber, 
      receiptModel.price, fiatPayment, etherPayment);

    let sample = $('p', '<b>ALIREZA</b>');
    $('#TRJ_Headline').text('New Pending Invoice from Treejer ');
    $('#TRJ_Title').text('Dear, ' + clientModel.firstname + ',');
    $('#TRJ_Message').text(fiatPayment);
    $('#TRJ_CTA').text('Enter Planet');
    $('#TRJ_CTA').attr('href', 'http://treejer.com/planet');

    await EmailSender.sendEmail(clientModel.email.toString(), 
      'Treejer: New Pending Invoice', $.html());

    return true;
  };

  EmailSender.sendReceiptEmail = 
    utility.wrapper(EmailSender.sendReceiptEmail);

  EmailSender.remoteMethod('sendReceiptEmail', {
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
      path: '/:clientId/sendReceiptEmail/:receiptId',
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