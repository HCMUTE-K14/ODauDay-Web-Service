const Mailer = require('nodemailer');
const Config = require('../config');

const Transporter = Mailer.createTransport({
  service: Config.email.client,
  auth: {
    user: Config.email.username,
    pass: Config.email.password
  }
});

function createMailOptions({ from, to, subject, html }) {
  return {
    from: from,
    to: to,
    subject: subject,
    html: html
  }
}

function getActiveAccountTemple(linkActivate) {
  return `<html>
  <body>
    <div>
      <h2 style="color: #2e6c80; text-align: left;">Thanks for registering, please click this link below to activate your account.</h2>
    </div>
    <p>Link: ${linkActivate} </p>
    <div>
      Sent by ODauDay
    </div>
  </body>
  </html>`
}