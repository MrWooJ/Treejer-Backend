module.exports = async Client => {

  require('../client/createLogic')(Client);
  require('../client/changeStatus')(Client);

};
