const Express = require('express');

const ResponseModel = require('../util/response-model');

const Router = Express.Router();
const UserRoutes = require('./user.route');
const AuthRoutes = require('./auth.route');
const AdminRoutes = require('./admin.route');
const FavoriteRoutes = require('./favorite.route');

const DB = require('../model/index');

Router.post('/health-check', (req, res) => {
	console.log(req.body);
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
Router.use('/favorite', FavoriteRoutes);
// Router.use('/admin', AdminRoutes);

module.exports = Router;