const Mailer = require('nodemailer');
const Config = require('../../config');

const Transporter = Mailer.createTransport({
  service: Config.email.client,
  auth: {
    user: Config.email.username,
    pass: Config.email.password
  }
});

const EmailHelper = {};

EmailHelper.getTransporter = getTransporter;
EmailHelper.send = send;
EmailHelper.createMailOptions = createMailOptions;
EmailHelper.createMailOptionsForActiveAccount = createMailOptionsForActiveAccount;

module.exports = EmailHelper;


function getTransporter() {
  return Transporter;
}

function send(mailOptions) {
  return new Promise((resolve, reject) => {
    Transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      }
      resolve(info);
    })
  });
}

function createMailOptions({ to, subject, html }) {
  return {
    from: Config.email.username,
    to: to,
    subject: subject,
    html: html
  }
}

function createMailOptionsForActiveAccount(to, template) {
  return createMailOptions({
    to: to,
    subject: 'Active Account ODauDay',
    html: template
  });
}