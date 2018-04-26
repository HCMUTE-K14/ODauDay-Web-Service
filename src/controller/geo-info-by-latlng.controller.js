const Request = require('request-promise');
const Config = require('../config');

const ResponseModel = require('../util/response-model');

const GeoInfoController = {};
GeoInfoController.search = search;
GeoInfoController.search1 = search1;

module.exports = GeoInfoController;

async function search(req, res) {
	try {
		//let isAccess = await VerifyUtils.verifyProtectRequest(req);

		let latLng = req.query.lat_lng;
		let options = getOptionsGetGeoLocation(latLng);
		Request(options)
			.then(geoInfoResponse => {
				let response = JSON.parse(geoInfoResponse);
				let address = response.results[0].formatted_address;
				console.log(address);
				res.json(new ResponseModel({
					code: 200,
					status_text: 'OK',
					success: true,
					data: address,
					errors: null
				}));
			})
			.error(error => {
				res.json(new ResponseModel({
					code: 200,
					status_text: 'OK',
					success: true,
					data: '',
					errors: null
				}));
			})
	} catch (error) {
		res.json(new ResponseModel({
			code: 200,
			status_text: 'OK',
			success: true,
			data: '',
			errors: null
		}));
	}
}

function generateRandomNumber() {
	var min = 0.005;
	var max = 0.1;
	return Math.random() * (max - min) + min;
};
async function search1(req, res) {
	try {
		let lat = 10.485461992387418;
		let long = 106.269320166111;

		for (let i = 0; i < 100; i++) {
			let _lat = lat + generateRandomNumber();
			let _long = long + generateRandomNumber();
			let lngLng = _lat + ',' + _long;
			let options = getOptionsGetGeoLocation(lngLng);
			Request(options)
				.then(geoInfoResponse => {
					let response = JSON.parse(geoInfoResponse);
					let address = response.results[0].formatted_address;
					let __ = { 
						address: address,
						location: {lat: _lat, long: _long}
					};
					console.log(__);
				})
				.error(error => {
					console.log(error);
				})
		}
		// let latLng = req.query.lat_lng;
		// let options = getOptionsGetGeoLocation(latLng);
		// Request(options)
		// 	.then(geoInfoResponse => {
		// 		let response = JSON.parse(geoInfoResponse);
		// 		let address = response.results[0].formatted_address;
		// 		console.log(address);
		// 	})
		// 	.error(error => {

		// 	})
	} catch (err) {
	console.log(err);
	}
}


function getOptionsGetGeoLocation(latlng) {
	let geoOptions = {
		method: 'GET',
		uri: 'https://maps.googleapis.com/maps/api/geocode/json',
		qs: {
			address: latlng,
			key: Config.google.geocode_api
		}
	};

	return geoOptions;
}