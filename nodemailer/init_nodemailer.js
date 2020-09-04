const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lcs2019015@gmail.com',
      pass: 'Narendra@03'
    }
  });
  
  function sendmail(mail, password) {
  
    const mailOptions = {
      from: 'lcs2019015@gmail.com',
      to: mail,
      subject: 'Verify your email address',
      html: password
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });
  }

  module.exports = sendmail