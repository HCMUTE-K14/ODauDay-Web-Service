const User = require('../model/index').User;
const VerifyUtils = require('../util/verify-request');
const TextUtils = require('../util/text-utils');
const Config = require('../config');
const Template = require('../util/template');

const Handler = require('./handling-helper');

const LINK_EXPIRED = 'link_expired';
const ACTIVED_SUCCESSFUL = 'actived_successful';
const ACTIVED_FAILURE = 'actived_failure';

const ActiveAccountController = {};

ActiveAccountController.active = active;

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

function reSendActivation() {

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