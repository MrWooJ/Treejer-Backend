const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Invitation => {

  const vars = app.vars;
  
  Invitation.changeCapacity = async (invitationCode, newCapacity) => {
    let invitationModel = 
      await Invitation.fetchModel(invitationCode.toString());

    if (invitationModel.status !== vars.config.invitationStatus.available) {
      throw createError(400, 
        'Error! Capacity can be changed only for available invitations.');
    }

    if (Number(newCapacity) <= Number(invitationModel.numberOfUsage)) {
      throw createError(400, 
        'Error! Capacity cannot be lower than current number usages.');
    }

    let updatedInvitationModel = await invitationModel.updateAttributes({
      usageCapacity: Number(newCapacity),
      status: vars.config.invitationStatus.available,
      lastUpdate: utility.getUnixTimeStamp()
    });

    return updatedInvitationModel;
  };

  Invitation.changeCapacity = 
    utility.wrapper(Invitation.changeCapacity);

  Invitation.remoteMethod('changeCapacity', {
    description: 'Change Capacity of the Invitation Code',
    accepts: [{
      arg: 'invitationCode',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'newCapacity',
      type: 'number',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:invitationCode/changeCapacity/:newCapacity',
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