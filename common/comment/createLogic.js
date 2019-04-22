const validator = rootRequire('helper/validator');
const utility = rootRequire('helper/utility');
let createError = require('http-errors');

module.exports = async Comment => {

  Comment.createLogic = async ctx => {
    if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(ctx.args.data.email.toString())) { //eslint-disable-line
      throw createError(400, 'Error! Please enter a valid email address.');
    }
    return;
  };

  Comment.createLogic = utility.wrapper(Comment.createLogic);

  Comment.beforeRemote('create', async ctx => {
    validator(ctx.args.data, {
      white: ['email', 'username', 'firstname', 'lastname', 'message'],
      required: ['email', 'firstname', 'lastname', 'message']
    });

    return await Comment.createLogic(ctx);
  });

};