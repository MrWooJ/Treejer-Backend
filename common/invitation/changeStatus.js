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

    let updatedInvitationModel = await invitationModel.updateAttributes({
      status: newStatus,
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