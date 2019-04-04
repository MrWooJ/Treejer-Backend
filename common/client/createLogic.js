const validator = rootRequire('helper/validator');
const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = async Client => {

  const vars = app.vars;
  
  Client.createLogic = async ctx => {
    ctx.args.data.status = vars.config.clientStatus.waitList;
    ctx.args.data.lastUpdate = utility.getUnixTimeStamp();
    return;
  };

  Client.createLogic = utility.wrapper(Client.createLogic);

  Client.beforeRemote('create', async ctx => {
    validator(ctx.args.data, {
      white: ['username', 'password'],
      required: ['username', 'password']
    });

    return await Client.createLogic(ctx);
  });

};