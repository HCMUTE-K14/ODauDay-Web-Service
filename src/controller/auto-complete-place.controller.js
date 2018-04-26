const Request = require('request-promise');
const Config = require('../config');

const ResponseModel = require('../util/response-model');

const AutoCompleteController = {};
AutoCompleteController.search = search;

module.exports = AutoCompleteController;

async function search(req, res) {
	try {
		//let isAccess = await VerifyUtils.verifyProtectRequest(req);

		let keyword = req.query.key;

		let options = getOptionsGetAutocomple(keyword);
		Request(options)
			.then(googlePlaceResponse => {
				let response = JSON.parse(googlePlaceResponse);
				getPlace(response)
					.then(result => {
						res.json(new ResponseModel({
							code: 200,
							status_text: 'OK',
							success: true,
							data: result,
							errors: null
						}));
					})
			})
			.catch(error => {
				res.json(new ResponseModel({
					code: 200,
					status_text: 'OK',
					success: true,
					data: [],
					errors: null
				}));
			})
	} catch (error) {
		res.json(new ResponseModel({
			code: 200,
			status_text: 'OK',
			success: true,
			data: [],
			errors: null
		}));
	}
}

function getPlace(response) {
	return new Promise((resolve, reject) => {
		let result = [];
		let size = response.predictions.length;
		for (let i = 0; i < size; i++) {
			let placeItem = {};
			let place = response.predictions[i];

			placeItem.name = place.description;
			placeItem.id = place.place_id;
			getLocation(placeItem.id)
				.then(location => {
					placeItem.location = location;
					result.push(placeItem);
					setTimeout(() => {
						if (i == size - 1) {
							resolve(result);
						}
					}, 250);
				})
		}
	})
}

function getLocation(placeId) {
	return new Promise((resolve, reject) => {
		let geoOptions = getOptionsGetGeoLocation(placeId);
		Request(geoOptions)
			.then(googleGeoResponse => {
				let geoResponse = JSON.parse(googleGeoResponse);
				let location = geoResponse.results[0].geometry.location;
				let geoLocation = {
					latitude: location.lat,
					longitude: location.lng
				};
				resolve(geoLocation);
			})
	});
}

function getOptionsGetAutocomple(keyword) {
	let obj = {
		method: 'GET',
		uri: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
		qs: {
			input: keyword,
			language: 'vi',
			key: Config.google.place_autocomplete_api
		}
	};

	return obj;
}

function getOptionsGetGeoLocation(placeId) {
	let geoOptions = {
		method: 'GET',
		uri: 'https://maps.googleapis.com/maps/api/geocode/json',
		qs: {
			place_id: placeId,
			key: Config.google.geocode_api
		}
	};

	return geoOptions;
}