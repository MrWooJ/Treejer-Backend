const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = async Invitation => {

  const vars = app.vars;
  
  Invitation.sendInvitation = async () => {
    let date = utility.getUnixTimeStamp();
    let invitationModel = await Invitation.create({
      usageCapacity: 1,
      numberOfUsage: 0,
      status: vars.config.invitationStatus.available,
      createDate: date,
      lastUpdate: date
    });
    
    // TODO: send email

    return invitationModel;
  };

  Invitation.sendInvitation = 
    utility.wrapper(Invitation.sendInvitation);

  Invitation.remoteMethod('sendInvitation', {
    description: 'Send an invitation to this email address',
    accepts: [{
      arg: 'emailAddress',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/sendInvitation/:emailAddress',
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