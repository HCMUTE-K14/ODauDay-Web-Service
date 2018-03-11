const User = require('../model/index').User;

const VerifyUtils = require('../util/verify-request');
const TextUtils = require('../util/text-utils');
const Template = require('../util/template');
const EmailHelper = require('../util/email-helper');

const Logger = require('../logger');
const Config = require('../config');

const Handler = require('./handling-helper');

const LINK_EXPIRED = 'link_expired';
const ACTIVED_SUCCESSFUL = 'actived_successful';
const ACTIVED_FAILURE = 'actived_failure';

const ActiveAccountController = {};

ActiveAccountController.active = active;
ActiveAccountController.resendActivation = reSendActivation;

module.exports = ActiveAccountController;

function active(req, res) {
	let token = req.query.token;
	VerifyUtils.verifyWithSecretToken(token)
		.then(data => {
			let user = data.data['user'];

			let timeToExpired = data.data['time_to_expried'].timestamp;

			if (!isExpiredToken(timeToExpired)) {
				render(res, user.email, LINK_EXPIRED);
				return;
			}
			let query = { id: user.id };
			let hashPingNumber = user.ping_number;
			User.findOne({ where: query })
				.then(userExists => {
					let rawPingNumber = Config.secret_token + userExists.ping_number;
					let cadidatePingNumber = TextUtils.hashMD5(rawPingNumber);

					if (hashPingNumber != cadidatePingNumber) {
						render(res, user.email, ACTIVED_FAILURE);
						return;
					}
					if (userExists.status == 'active') {
						render(res, user.email, ACTIVED_SUCCESSFUL);
						return;
					}
					User.update({ status: 'active' }, { where: query })
						.then(success => {
							render(res, user.emaail, ACTIVED_SUCCESSFUL);
						})
						.catch(error => {
							render(res, user.email, ACTIVED_FAILURE);
						})
				})
				.catch(error => {
					render(res, user.email, ACTIVED_FAILURE);
				})
		})
		.catch(error => {
			render(res, '', ACTIVED_FAILURE);
		})
}

function reSendActivation(req, res) {
	let email = req.query.email;
	let query = { email: email };
	User.findOne({ where: query })
		.then(userExists => {
			let status = userExists.status;
			if (status == 'active') {
				let template = Template.activedAccountMailTemplate();
				let mailOption = EmailHelper.createMailOptions({
					to: email,
					subject: 'Activate account at ODauDay',
					html: template
				});
				EmailHelper.send(mailOption)
					.then(info => {
						Logger.info('Sent to ' + email);
					})
					.catch(err => {
						Logger.info('Can not send to ' + email);
					})
				return;
			}
			EmailHelper.sendMailActivateAccount(userExists);
		})
		.catch(error => {
			console.log(error);
		});
}

function isExpiredToken(timeToExpired) {
	let currentTime = new Date().getTime();

	return currentTime <= timeToExpired;
}

function render(res, email, type) {
	let urlResend = TextUtils.generateLinkResendActivateAccount(email);
	let template;
	switch (type) {
		case LINK_EXPIRED:
			template = Template.linkExpiredTemplate(urlResend);
			break;
		case ACTIVED_SUCCESSFUL:
			template = Template.activeAccountSuccessTemplate();
			break;
		case ACTIVED_FAILURE:
			template = Template.activeAccountFailTemplate(urlResend);
			break;
		default:
			break;
	}
	res.send(template);
}