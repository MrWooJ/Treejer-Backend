const createError = require('http-errors');
const utility = require('./utility');

module.exports = (data, options) => {
  options = Object.assign({
    required: [],
    white: []
  }, options);
  
  if (!utility.whiteChecker(data, options.white)) {
    throw createError(400, { white: options.white });
  }

  if (!utility.requiredChecker(data, options.required)) {
    throw createError(400, { required: options.required });
  }

  return;
};
