const validator = rootRequire('helper/validator');
const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = async Client => {

  const vars = app.vars;
  
  Client.beforeRemote('create', async ctx => {
    validator(ctx.args.data, {
      white: ['username', 'password'],
      required: ['username', 'password']
    });
    
    ctx.args.data.status = vars.config.clientStatus.waitList;
    ctx.args.data.date = utility.getUnixTimeStamp();
  });

};
