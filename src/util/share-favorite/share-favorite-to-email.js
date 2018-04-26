const Mailer = require('nodemailer');
const Config = require('../../config');
const Template = require('../template');
const TextUtils = require('../text-utils');

const Logger = require('../../logger');

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
EmailHelper.sendMailShareProprety=sendMailShareProprety;
module.exports=EmailHelper;

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

function createMailOptions({to ,replyTo, subject, html }) {
    return {
        from: Config.email.username,
        to: to,
        replyTo: replyTo,
        subject: subject,
        html: html
    }
}
// data {email: friend, email: reply, name, properties}
function sendMailShareProprety(data){
    let template = Template.createFavoriteShareToEmail(data);
    let mailOption = createMailOptions({
      to: data.email_friend,
      replyTo: data.email_from,
      subject: 'Share property shortlist  at ODauDay',
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