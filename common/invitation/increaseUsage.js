const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Invitation => {

  const vars = app.vars;
  
  Invitation.changeCapacity = async invitationCode => {
    let invitationModel = 
      await Invitation.fetchModel(invitationCode.toString());

    if (invitationModel.status !== vars.config.invitationStatus.available) {
      throw createError(400, 
        'Error! Capacity can be changed only for available invitations.');
    }

    let lastStatus = invitationModel.status;
    if (Number(invitationModel.numberOfUsage) + 1 === 
        Number(invitationModel.usageCapacity)) {
      lastStatus = vars.config.invitationStatus.finished;
    }

    let updatedInvitationModel = await invitationModel.updateAttributes({
      status: lastStatus,
      numberOfUsage: Number(invitationModel.numberOfUsage) + 1,
      lastUpdate: utility.getUnixTimeStamp()
    });

    return updatedInvitationModel;
  };

  Invitation.changeCapacity = 
    utility.wrapper(Invitation.changeCapacity);

  Invitation.remoteMethod('increaseUsage', {
    description: 'Increase usages of the Invitation Code by One',
    accepts: [{
      arg: 'invitationCode',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:invitationCode/increaseUsage',
      verb: 'PUT',
      status: 200,
      errorStatus: 400
    },
    returns: {
      type: 'object',
      root: true
    }
  });

};