module.exports = async Invitation => {

  require('../invitation/createLogic')(Invitation);
  require('../invitation/changeStatus')(Invitation);

};
