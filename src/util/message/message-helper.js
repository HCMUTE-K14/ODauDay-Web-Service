const EN = require('./en');
const VI = require('./vi');

const MessageHelper = {};

MessageHelper.EN = EN;
MessageHelper.VI = VI;
MessageHelper.getMessage = getMessage;


module.exports = MessageHelper;


function getMessage(language, errorText) {
	let lang = language || 'vi';

	if (lang == 'vi') {
		return VI[errorText];
	} else if (lang == 'en') {
		return EN[errorText];
	} else {
		return VI['unknown_message'];
	}
}