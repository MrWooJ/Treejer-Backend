const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Client => {

  const vars = app.vars;
  
  Client.changeStatus = async (clientId, invitationCode) => {
    let clientModel = await Client.fetchModel(clientId.toString());

    let Invitation = app.models.invitation;
    let invitationModel = 
      await Invitation.fetchModel(invitationCode.toString());

    if (invitationModel.status === vars.config.invitation.status.used) {
      throw createError(400, 
        'Error! The provided invitation code is used before.');
    }

    await Invitation.changeStatus(
      invitationCode.toString(), vars.config.invitation.status.used);

    let clientUpdatedModel = await clientModel.updateAttribute(
      status, vars.config.clientStatus.available);

    return clientUpdatedModel;
  };

  Client.changeStatus = 
    utility.wrapper(Client.changeStatus);

  Client.remoteMethod('changeStatus', {
    description: 'Change Status of the Client Based on Invitation Code',
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
      path: '/:clientId/changeStatus/:invitationCode',
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