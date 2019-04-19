module.exports = EmailSender => {

  EmailSender.sendEmail = (emailAddress, subject, htmlBody) => 
    new Promise((resolve, reject) => {
      EmailSender.send({
        to: emailAddress,
        from: 'no-reply@treejer.com',
        subject,
        html: htmlBody
      }, function(err, result) {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    }
  );

};