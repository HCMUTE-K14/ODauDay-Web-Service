const User = require('../../model/index').User;

const VerifyUtils = require('../../util/verify-request');
const TextUtils = require('../../util/text-utils');
const Template = require('../../util/template');
const EmailHelper = require('../../util/email-helper');

const Logger = require('../../logger');
const Config = require('../../config');

const Handler = require('../handling-helper');

const LINK_EXPIRED = 'link_expired';
const ACTIVED_SUCCESSFUL = 'actived_successful';
const ACTIVED_FAILURE = 'actived_failure';
const CONFIRM_PASSWORD_SUCCESSFUL = 'confirm_pass_successful';
const CONFIRM_PASSWORD_FAILURE = 'confirm_pass_failure';
const CONFIRM_PASSWORD = 'confirm_password';

const ActiveAccountController = {};

ActiveAccountController.active = active;
ActiveAccountController.resendActivation = reSendActivation;
ActiveAccountController.confirmPasswordChange = confirmPasswordChange;
ActiveAccountController.receiveNewPassword = receiveNewPassword;

module.exports = ActiveAccountController;

function active(req, res) {
	let token = req.query.token;
	VerifyUtils.verifyWithSecretToken(token)
		.then(data => {

			if (data.data['method'] !== 'active_account') {
				render(req, res, '', ACTIVED_FAILURE);
				return;
			}

			let user = data.data['user'];

			let timeToExpired = data.data['time_to_expried'].timestamp;

			if (!isExpiredToken(timeToExpired)) {
				render(req, res, user.email, LINK_EXPIRED);
				return;
			}
			let query = { id: user.id };
			let hashPingNumber = user.ping_number;
			User.findOne({ where: query })
				.then(userExists => {
					let rawPingNumber = Config.secret_token + userExists.ping_number;
					let cadidatePingNumber = TextUtils.hashMD5(rawPingNumber);

					if (hashPingNumber != cadidatePingNumber) {
						render(req, res, user.email, ACTIVED_FAILURE);
						return;
					}
					if (userExists.status == 'active') {
						render(req, res, user.email, ACTIVED_SUCCESSFUL);
						return;
					}
					User.update({ status: 'active' }, { where: query })
						.then(success => {
							render(req, res, user.emaail, ACTIVED_SUCCESSFUL);
						})
						.catch(error => {
							render(req, res, user.email, ACTIVED_FAILURE);
						})
				})
				.catch(error => {
					render(req, res, user.email, ACTIVED_FAILURE);
				})
		})
		.catch(error => {
			render(req, res, '', ACTIVED_FAILURE);
		})
}

function reSendActivation(req, res) {
	let email = req.query.email;
	let query = { email: email };
	User.findOne({ where: query })
		.then(userExists => {
			let status = userExists.status;
			if (status === 'active') {
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
			Logger.info(error.message || error);
		});
}

function confirmPasswordChange(req, res) {
	let token = req.query.token;
	VerifyUtils.verifyWithSecretToken(token)
		.then(data => {

			if (data.data['method'] !== 'forgot_password') {
				render(res, '', CONFIRM_PASSWORD_FAILURE);
				return;
			}
			let user = data.data['user'];

			let timeToExpired = data.data['time_to_expried'].timestamp;

			if (!isExpiredToken(timeToExpired)) {
				render(req, res, user.email, LINK_EXPIRED);
				return;
			}
			render(req, res, '', CONFIRM_PASSWORD);
		})
		.catch(err => {
			render(req, res, '', CONFIRM_PASSWORD_FAILURE);
		})
}

function receiveNewPassword(req, res) {
	let token = req.query.token;
	VerifyUtils.verifyWithSecretToken(token)
		.then(data => {

			if (data.data['method'] !== 'forgot_password') {
				render(req, res, '', CONFIRM_PASSWORD_FAILURE);
				return;
			}

			let user = data.data['user'];

			let timeToExpired = data.data['time_to_expried'].timestamp;

			if (!isExpiredToken(timeToExpired)) {
				render(req, res, user.email, LINK_EXPIRED);
				return;
			}
			let query = { id: user.id };
			let hashPingNumber = user.ping_number;

			let newPassword = req.body.password;
			User.findOne({ where: query })
				.then(userExists => {
					let rawPingNumber = Config.secret_token + userExists.ping_number;
					let cadidatePingNumber = TextUtils.hashMD5(rawPingNumber);

					if (hashPingNumber != cadidatePingNumber) {
						render(req, res, user.email, CONFIRM_PASSWORD_FAILURE);
						return;
					}
					userExists.update({ password: newPassword }, { where: query })
						.then(success => {
							render(req, res, user.emaail, CONFIRM_PASSWORD_SUCCESSFUL);
						})
						.catch(error => {
							render(req, res, user.email, CONFIRM_PASSWORD_SUCCESSFUL);
						})
				})
				.catch(error => {
					render(req, res, user.email, CONFIRM_PASSWORD_FAILURE);
				})
		})
		.catch(err => {
			render(req, res, '', CONFIRM_PASSWORD_FAILURE);
		})
}

function isExpiredToken(timeToExpired) {
	let currentTime = new Date().getTime();
	return currentTime <= timeToExpired;
}

function render(req, res, email, type) {
	let template;
	switch (type) {
		case LINK_EXPIRED:
			urlResend = TextUtils.generateLinkResendActivateAccount(email);
			template = Template.linkExpiredTemplate(urlResend);
			break;
		case ACTIVED_SUCCESSFUL:
			template = Template.activeAccountSuccessTemplate();
			break;
		case ACTIVED_FAILURE:
			urlResend = TextUtils.generateLinkResendActivateAccount(email);
			template = Template.activeAccountFailTemplate(urlResend);
			break;
		case CONFIRM_PASSWORD_SUCCESSFUL:
			template = Template.confirmPasswordSuccessTemplate();
			break;
		case CONFIRM_PASSWORD_FAILURE:
			template = Template.cofirmPasswordFailTemplate();
			break;
		case CONFIRM_PASSWORD:
			let urlResend = Config.base_url + '/users/receive-new-password?token=' + req.query.token;
			template = Template.confirmPasswordTemplate(urlResend);
			break;
		default:
			break;
	}
	res.send(template);
}