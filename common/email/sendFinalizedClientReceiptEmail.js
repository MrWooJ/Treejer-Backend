const utility = rootRequire('helper/utility');
const cheerio = require('cheerio');

let app = rootRequire('server/server');

module.exports = async EmailSender => {

  EmailSender.sendFinalizedClientReceiptEmail = async (clientId, receiptId) => {
    let Client = app.models.client;
    let clientModel = 
      await Client.fetchModel(clientId.toString());
    
    let Receipt = app.models.receipt;
    let receiptModel = await Receipt.fetchModel(receiptId.toString());

    function messageLoader(treeCount, price, orderNumber) {
      return `Your recent order payment is confirmed and <b>${treeCount}</b> valued at <b>${price}</b> will be added to your forest.\n\nOrder number: <b>${orderNumber}</b>`; // eslint-disable-line
    }

    let treeCount = 0;
    for (let i = 0; i < receiptModel.items.length; i++) {
      treeCount += Number(receiptModel.items[i].quantity);
    }
    let message = messageLoader(treeCount, receiptModel.price, receiptId);

    const $ = cheerio.load(app.templates.index);

    $('#TRJ_Heading').text('New Payment Confirmed - Treejer');
    $('#TRJ_Title').text('Dear ' + clientModel.firstname + ',');
    $('#TRJ_Message').text(message);
    $('#TRJ_CTA').text('Visit Forest');
    $('#TRJ_CTA').attr('href', 'http://treejer.com/planet');

    await EmailSender.sendEmail(clientModel.email.toString(), 
      'Treejer: New Payment Confirmed', $.html());

    return true;
  };

  EmailSender.sendFinalizedClientReceiptEmail = 
    utility.wrapper(EmailSender.sendFinalizedClientReceiptEmail);

  EmailSender.remoteMethod('sendFinalizedClientReceiptEmail', {
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
      path: '/:clientId/sendFinalizedEmail/clientReceipt/:receiptId',
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