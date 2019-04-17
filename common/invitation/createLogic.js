const validator = rootRequire('helper/validator');
const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Invitation => {

  const vars = app.vars;
  
  Invitation.createLogic = async ctx => {
    if (Number(ctx.args.data.usageCapacity) <= 0) {
      throw createError(400, 
        'Error! Usage capacity cannot be lower or equal to zero.');
    }

    ctx.args.data.numberOfUsage = 0;
    ctx.args.data.status = vars.config.invitationStatus.available;

    let date = utility.getUnixTimeStamp();
    ctx.args.data.createDate = date;
    ctx.args.data.lastUpdate = date;
    return;
  };

  Invitation.createLogic = utility.wrapper(Invitation.createLogic);

  Invitation.beforeRemote('create', async ctx => {
    validator(ctx.args.data, {
      white: ['usageCapacity'],
      required: ['usageCapacity']
    });

    await Invitation.createLogic(ctx);
  });

};