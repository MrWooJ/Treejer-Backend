module.exports = async EmailSender => {

  require('../email/sendEmail')(EmailSender);
  require('../email/sendFinalizedBusinessReceiptEmail')(EmailSender);
  require('../email/sendFinalizedClientReceiptEmail')(EmailSender);
  require('../email/sendFinalizedGiftReceiptEmail')(EmailSender);

};
