const validator = rootRequire('helper/validator');
const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = async Invitation => {

  const vars = app.vars;
  
  Invitation.createLogic = async ctx => {
    ctx.args.data.numberOfUsage = 0;
    ctx.args.data.status = vars.config.invitationStatus.available;
    ctx.args.data.lastUpdate = utility.getUnixTimeStamp();
    return;
  };

  Invitation.createLogic = utility.wrapper(Invitation.createLogic);

  Invitation.beforeRemote('create', async ctx => {
    validator(ctx.args, {
      white: ['usageCapacity'],
      required: ['usageCapacity']
    });

    await Invitation.createLogic(ctx);
  });

};