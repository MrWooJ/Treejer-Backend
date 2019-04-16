const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Invitation => {

  const vars = app.vars;
  
  Invitation.changeStatus = async (invitationCode, newStatus) => {
    let invitationModel = 
      await Invitation.fetchModel(invitationCode.toString());

    if (!vars.config.invitationStatus[newStatus]) {
      throw createError(404, 
        'Error! The provided status code is not defined.');
    }

    if (vars.config.invitationStatus[newStatus] === 
        vars.config.invitationStatus.available &&
        Number(invitationModel.usageCapacity) <= 
        Number(invitationModel.numberOfUsage)) {
      throw createError(400, 
        'Error! Cannot change status duo to passing the usage capacity.');
    }

    let updatedInvitationModel = await invitationModel.updateAttributes({
      status: vars.config.invitationStatus[newStatus],
      lastUpdate: utility.getUnixTimeStamp()
    });

    return updatedInvitationModel;
  };

  Invitation.changeStatus = 
    utility.wrapper(Invitation.changeStatus);

  Invitation.remoteMethod('changeStatus', {
    description: 'Change Status of the Invitation Code',
    accepts: [{
      arg: 'invitationCode',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'newStatus',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:invitationCode/changeStatus/:newStatus',
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