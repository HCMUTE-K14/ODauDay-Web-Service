const EN = require('./en');
const VI = require('./vi');

const MessageHelper = {};

MessageHelper.EN = EN;
MessageHelper.VI = VI;
MessageHelper.getMessage = getMessage;


module.exports = MessageHelper;


function getMessage(language, errorText) {
	let lang = language || 'vi';
	if (lang === 'vi') {
		return VI[errorText];
	} else if (lang === 'en') {
		return EN[errorText];
	} else {
		return VI['message_not_found'];
	}
}

function getMessageByCode(language, code) {
	let lang = language || 'vi';

	if (lang === 'vi') {
		return doGetMessage(VI, code);
	} else if (lang === 'en') {
		return doGetMessage(EN, code);
	} else {
		return VI['message_not_found'];
	}
}

function doGetMessage(list, code) {
	try {
		Object.keys(list).forEach(key => {
			if (list[key].code === code) {
				return list[key];
			}
		});
	} catch (err) {
		return list['unknown_message'];
	}
}