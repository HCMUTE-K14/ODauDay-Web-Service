const Request = require('request-promise');
const Config = require('../config');

const ResponseModel = require('../util/response-model');

const StaticMapController = {};
StaticMapController.get = get;

module.exports = StaticMapController;

function get(req, res) {
	let location = req.query.location;
	let size = req.query.size;
	let zoom = req.query.zoom;
	let geoOptions = {
		method: 'GET',
		encoding: null,
		uri: `https://maps.googleapis.com/maps/api/staticmap?center=${location}&size=${size}&key=AIzaSyBCKSXZ2CAA_IcHd2TgwHpIdQG-MphfES8&format=jpg&zoom=${zoom}&markers=icon:https://i.imgur.com/UVZAmTP.png|${location}`
	};
	console.log(geoOptions);
	Request(geoOptions)
		.then(data => {
			res.writeHead(200, { 'Content-type': 'image/jpg' });
			res.end(data);
		})
		.catch(error => {
			console.log(error);
			res.writeHead(400, { 'Content-type': 'text/html' })
			res.end('error');
		})
}