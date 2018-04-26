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
ActiveAccountController.reSendActivation = reSendActivation;

module.exports = ActiveAccountController;

async function active(req, res) {

	try {
		let token = req.query.token;
		let isAccess = await VerifyUtils.verifyWithSecretToken(token);

		if (isAccess.data['method'] !== 'active_account') {
			render(req, res, '', ACTIVED_FAILURE);
			return;
		}

		let user = isAccess.data['user'];

		let timeToExpired = isAccess.data['time_to_expried'].timestamp;

		if (!isExpiredToken(timeToExpired)) {
			render(req, res, user.email, LINK_EXPIRED);
			return;
		}

		let query = { id: user.id };
		let hashPingNumber = user.ping_number;

		let userExists = await User.findOne({ where: query });

		let rawPingNumber = Config.secret_token + userExists.ping_number;
		let cadidatePingNumber = TextUtils.hashMD5(rawPingNumber);

		if (hashPingNumber !== cadidatePingNumber) {
			render(req, res, user.email, ACTIVED_FAILURE);
			return;
		}
		if (userExists.status === 'active') {
			render(req, res, user.email, ACTIVED_SUCCESSFUL);
			return;
		}
		User.update({ status: 'active' }, { where: query })
			.then(success => {
				render(req, res, user.emaail, ACTIVED_SUCCESSFUL);
			})
			.catch(error => {
				render(req, res, user.emaail, ACTIVED_FAILURE);
			})
	} catch (error) {
		render(req, res, user.emaail, ACTIVED_FAILURE);
	}
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
		default:
			break;
	}
	res.send(template);
}