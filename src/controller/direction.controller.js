const Request = require('request-promise');
const Config = require('../config');
const MessageHelper = require('../util/message/message-helper');

const ResponseModel = require('../util/response-model');

const DirectionController = {};
DirectionController.get = get;

module.exports = DirectionController;

function get(req, res) {
	let from = req.query.from;
	let to = req.query.to;
	let mode = req.query.mode || 'driving';

	let geoOptions = {
		method: 'GET',
		uri: `https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&mode=${mode}&key=AIzaSyBCKSXZ2CAA_IcHd2TgwHpIdQG-MphfES8`
	};
	Request(geoOptions)
		.then(data => {
			let json = JSON.parse(data);
			console.log(geoOptions);
			if (json.status === 'OK') {
				let duration = json.routes[0].legs[0].duration.value;
				let distance = json.routes[0].legs[0].distance.value;
				if (duration && distance) {
					res.status(200).json(new ResponseModel({
						code: 200,
						status_text: 'OK',
						success: true,
						data: { duration: duration, distance: distance },
						errors: null
					}))
				} else {
					res.status(503).json(new ResponseModel({
						code: 503,
						status_text: 'SERVICE UNAVAILABLE',
						success: false,
						data: null,
						errors: [getMessage(req, 'no_direction')]
					}));
				}
			} else {
				res.status(503).json(new ResponseModel({
					code: 503,
					status_text: 'SERVICE UNAVAILABLE',
					success: false,
					data: null,
					errors: [getMessage(req, 'no_direction')]
				}));
			}
		})
		.catch(error => {
			res.status(503).json(new ResponseModel({
				code: 503,
				status_text: 'SERVICE UNAVAILABLE',
				success: false,
				data: null,
				errors: [getMessage(req, 'no_direction')]
			}));
		})
}

function getMessage(req, errorText) {
	let lang = req.query.lang || 'vi';
	return MessageHelper.getMessage(lang, errorText);
}