const Mailer = require('nodemailer');

const Config = require('../config');
const Template = require('./template');
const TextUtils = require('./text-utils');

const Logger = require('../logger');

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
EmailHelper.sendMailActivateAccount = sendMailActivateAccount;

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

function sendMailActivateAccount(user) {
  let linkActivate = TextUtils.generateLinkActivateAccount(user);
  let template = Template.activeAccountMailTemplate(linkActivate);
  let mailOption = createMailOptions({
    to: user.email,
    subject: 'Activate account at ODauDay',
    html: template
  });
  send(mailOption)
    .then(info => {
      Logger.info('Sent to ' + user.email);
    })
    .catch(err => {
      Logger.info('Can not send to ' + user.email);
    })
}