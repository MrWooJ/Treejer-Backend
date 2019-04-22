const validator = rootRequire('helper/validator');
const utility = rootRequire('helper/utility');
let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Client => {

  const vars = app.vars;
  
  Client.createLogic = async ctx => {
    let englishRegex = /^[A-Za-z0-9]*$/;

    if (!englishRegex.test(ctx.args.data.username)) {
      throw createError(400, 
        'Error! Please change your keyboard language to English. \
        No special character is accepted.');
    }
    if (!englishRegex.test(ctx.args.data.firstname)) {
      throw createError(400, 
        'Error! Please change your keyboard language to English. \
        No special character is accepted.');
    }
    if (!englishRegex.test(ctx.args.data.lastname)) {
      throw createError(400, 
        'Error! Please change your keyboard language to English. \
        No special character is accepted.');
    }

    ctx.args.data.firstname = ctx.args.data.firstname.charAt(0).toUpperCase() + 
      ctx.args.data.firstname.slice(1);

    ctx.args.data.lastname = ctx.args.data.lastname.charAt(0).toUpperCase() + 
      ctx.args.data.lastname.slice(1);

    ctx.args.data.emailVerified = true;
    ctx.args.data.status = vars.config.clientStatus.waitList;
    ctx.args.data.createDate = utility.getUnixTimeStamp();
    ctx.args.data.lastUpdate = utility.getUnixTimeStamp();
    return;
  };

  Client.createLogic = utility.wrapper(Client.createLogic);

  Client.beforeRemote('create', async ctx => {
    validator(ctx.args.data, {
      white: ['username', 'email', 'firstname', 'lastname', 'password'],
      required: ['username', 'email', 'firstname', 'lastname', 'password']
    });

    return await Client.createLogic(ctx);
  });

};