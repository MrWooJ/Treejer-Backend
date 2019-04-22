const utility = rootRequire('helper/utility');
const cheerio = require('cheerio');

let app = rootRequire('server/server');

module.exports = async EmailSender => {

  EmailSender.sendSignInEmail = async (emailAddress, invitationCode) => {    
    let Invitation = app.models.invitation;
    await Invitation.fetchModel(invitationCode.toString());
    
    const $ = cheerio.load(app.templates.index);

    let message = 'You have been invited to Treejer. Please sign in and add trees to your forest.'; //eslint-disable-line

    $('#TRJ_Headline').text('You are Invited to Treejer Now!');
    $('#TRJ_Title').text('Dear Guest,');
    $('#TRJ_Message').text(message);
    $('#TRJ_CTA').text('Sign In Now!');
    $('#TRJ_CTA').attr('href', 
      'http://treejer.com/sign-in?referral=' + invitationCode);

    await EmailSender.sendEmail(emailAddress.toString(), 
      'Treejer: Invitation to Planet', $.html());

    return true;
  };

  EmailSender.sendSignInEmail = 
    utility.wrapper(EmailSender.sendSignInEmail);

  EmailSender.remoteMethod('sendSignInEmail', {
    description: 'Send Sample Email',
    accepts: [{
      arg: 'emailAddress',
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
      path: '/:emailAddress/sendSignInEmail/:invitationCode',
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