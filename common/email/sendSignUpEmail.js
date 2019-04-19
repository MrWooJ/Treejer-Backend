const utility = rootRequire('helper/utility');
const cheerio = require('cheerio');

let app = rootRequire('server/server');

module.exports = async EmailSender => {

  EmailSender.sendSignUpEmail = async (clientId, invitationCode) => {
    let Client = app.models.client;
    let clientModel = await Client.fetchModel(clientId.toString());
    
    let Invitation = app.models.invitation;
    await Invitation.fetchModel(invitationCode.toString());

    const $ = cheerio.load(app.templates.index);

    let message = 'You are invited to planet to use.';

    $('#TRJ_Heading').text('Invitation to Planet');
    $('#TRJ_Title').text(clientModel.firstname + ',');
    $('#TRJ_Message').text(message);
    $('#TRJ_CTA').text('Sign Up Now!');
    $('#TRJ_CTA').attr('href', 
      'http://treejer.com/sign-up?referral=' + invitationCode);

    await EmailSender.sendMail(clientModel.email.toString(), 
      'Treejer: Invitation to Planet', $.html());

    return true;
  };

  EmailSender.sendSignUpEmail = 
    utility.wrapper(EmailSender.sendSignUpEmail);

  EmailSender.remoteMethod('sendSignUpEmail', {
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
      path: '/:clientId/sendSignUpEmail/:invitationCode',
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