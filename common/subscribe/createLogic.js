const validator = rootRequire('helper/validator');
const utility = rootRequire('helper/utility');
let createError = require('http-errors');

module.exports = async Subscribe => {

  Subscribe.createLogic = async ctx => {
    if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(ctx.args.data.email.toString())) { //eslint-disable-line
      throw createError(400, 'Error! Email validation failed.');
    }
    return;
  };

  Subscribe.createLogic = utility.wrapper(Subscribe.createLogic);

  Subscribe.beforeRemote('create', async ctx => {
    validator(ctx.args.data, {
      white: ['email'],
      required: ['email']
    });

    return await Subscribe.createLogic(ctx);
  });

};