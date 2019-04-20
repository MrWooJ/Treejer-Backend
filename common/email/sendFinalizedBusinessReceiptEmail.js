const utility = rootRequire('helper/utility');
const cheerio = require('cheerio');

let app = rootRequire('server/server');

module.exports = async EmailSender => {

  EmailSender.sendFinalizedBusinessReceiptEmail =
    async (clientId, receiptId) => {

    let Client = app.models.client;
    let clientModel = 
      await Client.fetchModel(clientId.toString());
    
    let Receipt = app.models.receipt;
    await Receipt.fetchModel(receiptId.toString());

    const $ = cheerio.load(app.templates.index);

    let message = 'Your receipt is finalized as bellow, \
      bluh bluh bluh, enter the planet now.';

    $('#TRJ_Heading').text('Receipt Approval');
    $('#TRJ_Title').text(clientModel.firstname + ',');
    $('#TRJ_Message').text(message);
    $('#TRJ_CTA').text('Enter Planet');
    $('#TRJ_CTA').attr('href', 'http://treejer.com/planet');

    await EmailSender.sendEmail(clientModel.email.toString(), 
      'Treejer: Receipt Approval', $.html());

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