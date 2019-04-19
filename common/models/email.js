module.exports = async EmailSender => {

  require('../email/sendEmail')(EmailSender);
  require('../email/sendFinalizedBusinessReceiptEmail')(EmailSender);

};
