const Express = require('express');
const ResponseModel = require('../util/response-model');
const Router = Express.Router();
const UserRoutes = require('./user.route');
const AuthRoutes = require('./auth.route');
const TagRoutes=require("./tag.route");
const CategoryRoutes=require("./category.route");
const PropertyRoutes=require("./property.route");
const AdminRoutes = require('./admin.route');
const FavoriteRoutes=require('./favorite.route');
const SaveSearchRoutes=require("./save-search.route");
const UploadImageRoutes=require("./uploadimages.route");
const SearchRoutes = require('./search.route');
const AutoCompleteRoutes = require('./auto-complete-place.route');
const GeoInfoRoutes = require('./geo-info.route');
const HistoryRoutes=require("./history.route");

const DB = require('../model/index');

Router.get('/health-check', (req, res) => {
	console.log(req.body);

	DB.Property.findById('1', {
			include: [{
				model: DB.Category,
				as: 'categories',
				attributes: ['id'],
				through: { attributes: [] }
			}]
		})
		.then(data => {
			let __ = data.get({ plain: true });
			let categories = [{id: '1'}, {id: '2'}];
			let sizePropertyCategory = categories.length;
			let sizeData = __.categories.length;
			if(sizeData <= 0){
				return false;
			}
			for (let i = 0; i < sizePropertyCategory; i++) {
				let a = categories[i].id;
				for (let j = 0; j < sizeData; j++) {
					let b = __.categories[j].id;

					if (a == b) {
						res.json({message: 'OK'});
						return true;
					}
				}
			}
			return false;
		})

	// DB.Property.findById('1', {
	// 		include: [{
	// 			model: DB.Tag,
	// 			as: 'tags',
	// 			attributes: ['id'],
	// 			through: { attributes: [] }
	// 		}]
	// 	})
	// 	.then(data => {
	// 		let __ = data.get({ plain: true });
	// 		let propertyTags = [{
	// 			id: "1"
	// 		}, {
	// 			id: "2"
	// 		}];
	// 		let sizePropertyTags = propertyTags.length;
	// 		let sizeData = __.tags.length;

	// 		console.log(propertyTags);
	// 		console.log(__.tags)
	// 		for (let i = 0; i < sizePropertyTags; i++) {
	// 			let a = propertyTags[i].id;
	// 			for (let j = 0; j < sizeData; j++) {
	// 				let b = __.tags[j].id;

	// 				if (a == b) {
	// 					res.json({message: 'OK'});
	// 					return;
	// 				}
	// 			}
	// 		}

	// 	})
	// // DB.User.findById('0', {
	// // 		include: [{
	// // 			model: DB.Property,
	// // 			as: 'favorites'
	// // 		}]
	// // 	})
	// // 	.then(user => {
	// // 		delete user.favorites[0];

	// // 		DB.User.update({ user }, { where: { id: '0' } })
	// // 			.then(success => {
	// // 				res.json(success);
	// // 			})
	// // 	})
	// DB.User.create({
	// 	email: 'daohuuloc941911@gmail.com',
	// 	password: '123456',
	// 	display_name: 'fdsafsad',
	// 	favorites: [
	// 		{ name: 'name11', code: '1234', id: '0' },
	// 		{ name: 'name11', code: '1234' }
	// 	]
	// }, {
	// 	include: [
	// 		{ model: DB.Property, as: 'favorites' }
	// 	]
	// }).then(user => {
	// 	res.json(user);
	// })
});

Router.use('/users', UserRoutes);
Router.use('/auth', AuthRoutes);

Router.use('/tag',TagRoutes);
Router.use("/category",CategoryRoutes);
Router.use("/property",PropertyRoutes);
Router.use('/admin', AdminRoutes);
Router.use('/favorite',FavoriteRoutes);
Router.use('/search',SearchRoutes);
Router.use('/image',UploadImageRoutes);
Router.use('/save-search', SaveSearchRoutes);
Router.use('/auto-complete-place', AutoCompleteRoutes);
Router.use('/geo-info', GeoInfoRoutes);
Router.use("/history",HistoryRoutes);
module.exports = Router;