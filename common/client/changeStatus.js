const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Client => {

  const vars = app.vars;
  
  Client.changeStatus = async (clientId, invitationCode) => {
    let clientModel = await Client.fetchModel(clientId.toString());

    if (clientModel.status !== vars.config.clientStatus.waitList) {
      throw createError(400, 'Error! Client is alreay invited to the treejer.');
    }

    let Invitation = app.models.invitation;
    await Invitation.increaseUsage(invitationCode.toString());

    let clientUpdatedModel = await clientModel.updateAttribute(
      'status', vars.config.clientStatus.available);

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