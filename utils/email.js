const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // debug: true,
    // logger: true,

    // host: 'smtp.ethereal.email',
    // port: 587,
    // auth: {
    //   user: 'magali.schuppe@ethereal.email',
    //   pass: 'ur2TnvRFgETS1e8TZV',
    // },
  });
  const mailOptions = {
    from: 'Izzat <johnnie.ledner@ethereal.email>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  console.log(transporter);
  console.log(mailOptions);
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
