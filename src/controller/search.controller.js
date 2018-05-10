const Database = require('../model/index');
const Image = require('../model/index').Image;
const Handler = require('./handling-helper');
const VerifyUtils = require('../util/verify-request');
const MessageHelper = require('../util/message/message-helper');
const ResponseModel = require('../util/response-model');

const SearchController = {};
SearchController.search = search;

module.exports = SearchController;

async function search(req, res) {
	try {
		//let isAccess = await VerifyUtils.verifyProtectRequest(req);
		//let userIdFromHeader = isAccess.user.id;

		let pageControl = {
			page: 1,
			limit: 200
		};
		let lang = req.query.lang;

		let core = req.body.core;
		let criteria = req.body.criteria;

		let bound = core.bound;
		let center = core.center;
		let end = core.end;
		let radius = core.radius;
		let zoom = req.body.zoom;

		let minLat = bound[0].latitude;
		let maxLat = bound[1].latitude;

		let minLong = bound[0].longitude;
		let maxLong = bound[1].longitude;

		// console.log(`
		// 	center_lat: ${center.latitude}
		// 	center_long: ${center.longitude}
		// 	radius: ${radius}
		// `);

		// console.log(` 
		// 	--------------------
		// 	Bound:
		// 	minLat: ${minLat}
		// 	maxLat: ${maxLat}

		// 	minLong: ${minLong}
		// 	maxLong: ${maxLong}`);
		Database.sequelize
			.query('CALL search_property($type, $user_id, $center_lat, $center_long, $radius, $min_lat, $max_lat, $min_long, $max_long)', {
				bind: {
					type: criteria.type,
					user_id: null,
					center_lat: center.latitude,
					center_long: center.longitude,
					radius: radius,
					min_lat: bound[0].latitude,
					max_lat: bound[1].latitude,
					min_long: bound[0].longitude,
					max_long: bound[1].longitude
				}
			})
			.then(properties => {
				if (properties.length <= 0) {
					responseEmpty(res);
					return;
				}
				formatPropertiesFromDatabase(properties)
					.then(data => {
						let filterResult = [];
						let size = data.length;
						if (size > 200) {
							size = 200;
						}
						for (let i = 0; i < size; i++) {
							let property = data[i];

							checkCriteria(property, criteria)
								.then(result => {
									if (result == true) {
										filterResult.push(property);
									}
									if (i == size - 1) {
										let searchResult = {
											count: properties.length,
											pages: Math.ceil(properties.length / 200),
											properties: filterResult
										};
										//console.log(searchResult);
										res.status(200).json(new ResponseModel({
											code: 200,
											status_text: 'OK',
											success: true,
											data: searchResult,
											errors: null
										}));
									}
								})
						}
					})
			});
	} catch (error) {
		if (error.constructor.name === 'ConnectionRefusedError') {
			Handler.cannotConnectDatabase(req, res);
		} else if (error.constructor.name === 'ValidationError' ||
			error.constructor.name === 'UniqueConstraintError') {
			Handler.validateError(req, res, error);
		} else if (error.constructor.name === 'ErrorModel') {
			Handler.invalidAccessToken(req, res);
		} else {
			//handlingCannotUpdateUser(req, res);
		}
	}
}

function formatPropertiesFromDatabase(properties) {
	return new Promise((resolve, reject) => {
		let result = [];
		let size = properties.length;
		if (size == 0) {
			resolve(result);
		}
		for (let i = 0; i < size; i++) {
			formatProperty(properties[i])
				.then(data => {
					result.push(data);
					if (i == size - 1) {
						resolve(result);
					}
				})
		}
	});
}

function responseEmpty(res) {
	let result = {
		count: 0,
		pages: 0,
		properties: []
	};
	res.status(200).json(new ResponseModel({
		code: 200,
		status_text: 'OK',
		success: true,
		data: result,
		errors: null
	}));
}

function formatProperty(property) {
	return new Promise((resolve, reject) => {
		let item = property;
		let newItem = item;
		newItem.location = {
			latitude: item.latitude,
			longitude: item.longitude
		};

		delete newItem.latitude;
		delete newItem.longitude;

		newItem.type_id = formatTypeId(item);
		newItem.isViewed = item.isViewed > 0;
		newItem.isFavorited = item.isFavorited > 0;

		Image.findOne({ where: { property_id: item.id } })
			.then(images => {
				newItem.images = [images];
				resolve(newItem);
			}).catch(err => {
				resolve(newItem);
			})
	});
}

function formatTypeId(property) {
	if (property.type_id === 'BUY') {
		return 1;
	} else
	if (property.type_id === 'RENT') {
		return 2;
	} else {
		return 0;
	}
}

async function checkCriteria(property, criteria) {
	let isValidBedroom = checkBedroomCriteria(property.num_of_bedroom, criteria.bedrooms);
	let isValidBathroom = checkBathroomCriteria(property.num_of_bathroom, criteria.bathrooms);
	let isValidParking = checkParkingCriteria(property.num_of_parking, criteria.parking);
	let isValidPrice = checkPriceCriteria(property.price, criteria.price);
	let isValidLandSize = checkLandsizeCriteria(property.land_size, criteria.size);
	let isValidTag = await checkTagCriteria(property.id, criteria.tags);
	let isValidCategory;

	let propertyCategory = criteria.property_type;
	if (propertyCategory) {
		let propertyCategorySize = propertyCategory.length;

		let categories = [];
		for (let i = 0; i < propertyCategorySize; i++) {
			let category = { id: propertyCategory[i] };
			categories.push(category);
		}
		isValidCategory = await checkCategoryCriteria(property.id, categories);
	} else {
		isValidCategory = undefined;
	}

	let numOfValid = 0;

	if (isValidBedroom !== undefined) {
		numOfValid++;
	}
	if (isValidBathroom !== undefined) {
		numOfValid++;
	}
	if (isValidParking !== undefined) {
		numOfValid++;
	}
	if (isValidPrice !== undefined) {
		numOfValid++;
	}
	if (isValidTag !== undefined) {
		numOfValid++;
	}
	if (isValidCategory !== undefined) {
		numOfValid++;
	}
	if (isValidLandSize !== undefined) {
		numOfValid++;
	}

	let valueValidBedRoom = getValueFromBoolean(isValidBedroom);
	let valueValidBathRoom = getValueFromBoolean(isValidBathroom);
	let valueValidParking = getValueFromBoolean(isValidParking);
	let valueValidPrice = getValueFromBoolean(isValidPrice);
	let valueValidLandSize = getValueFromBoolean(isValidLandSize);
	let valueValidTag = getValueFromBoolean(isValidTag);
	let valueValidCategory = getValueFromBoolean(isValidCategory);

	let flag = valueValidBedRoom + valueValidBathRoom + valueValidParking + valueValidPrice + valueValidLandSize + valueValidTag + valueValidCategory == numOfValid;


	return flag;
}

function getValueFromBoolean(_boolean) {
	let value;
	if (_boolean !== undefined) {
		value = _boolean == true ? 1 : 0;
	} else {
		value = 0;
	}

	return value;
}

function checkMaxMinCriteria(valueProperty, maxMinValue) {
	if (maxMinValue) {
		if (maxMinValue.max && maxMinValue.min && maxMinValue.max == maxMinValue.min) {
			return valueProperty == maxMinValue.max;
		} else if (maxMinValue.max && !maxMinValue.min) {
			return valueProperty <= maxMinValue.max;
		} else if (!maxMinValue.max && maxMinValue.min) {
			return valueProperty >= maxMinValue.min;
		} else if (maxMinValue.max && maxMinValue.min) {
			return valueProperty >= maxMinValue.min && valueProperty <= maxMinValue.max;
		}
	} else {
		return undefined;
	}
}

function checkInArray(array1, array2) {
	let size1 = array1.length;
	let size2 = array2.length;
	if (size2 <= 0) {
		return false;
	}
	for (let i = 0; i < size1; i++) {
		let a = array1[i].id;
		for (let j = 0; j < size2; j++) {
			let b = array2[j].id;
			if (a == b) {
				return true;
			}
		}
	}
	return false;
}

function checkCategoryCriteria(id, categories) {
	return new Promise((resolve, reject) => {
		if (!categories) {
			resolve(undefined);
		}
		if (categories.length == 0) {
			resolve(undefined);
		}

		Database.Property.findById(id, {
				attributes: ['id'],
				include: [{
					model: Database.Category,
					as: 'categories',
					attributes: ['id'],
					through: { attributes: [] }
				}]
			})
			.then(data => {
				let __ = data.get({ plain: true });
				resolve(checkInArray(categories, __.categories));
			})
			.catch(err => {
				resolve(false);
			})
	});
}



function checkTagCriteria(id, propertyTags) {
	return new Promise((resolve, reject) => {
		if (!propertyTags) {
			return resolve(undefined);
		}
		if (propertyTags.length == 0) {
			return resolve(undefined);
		}
		Database.Property.findById(id, {
				attributes: ['id'],
				include: [{
					model: Database.Tag,
					as: 'tags',
					attributes: ['id'],
					through: { attributes: [] }
				}]
			})
			.then(data => {
				let __ = data.get({ plain: true });
				resolve(checkInArray(propertyTags, __.tags));
			})
			.catch(err => {
				resolve(false);
			})
	});

}

function checkBedroomCriteria(propertyBedRoom, bedrooms) {
	return checkMaxMinCriteria(propertyBedRoom, bedrooms);
}

function checkBathroomCriteria(propertyBathroom, bathrooms) {
	return checkMaxMinCriteria(propertyBathroom, bathrooms);
}

function checkParkingCriteria(propertyParking, parkings) {
	return checkMaxMinCriteria(propertyParking, parkings);
}

function checkLandsizeCriteria(propertyLandsize, landSize) {
	return checkMaxMinCriteria(propertyLandsize, landSize);
}

function checkPriceCriteria(propertyPrice, price) {
	return checkMaxMinCriteria(propertyPrice, price);
}