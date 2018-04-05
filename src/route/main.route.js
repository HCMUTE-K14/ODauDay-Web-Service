const Express = require('express');

const Router = Express.Router();
const UserRoutes = require('./user.route');
const AuthRoutes = require('./auth.route');
const TagRoutes=require("./tag.route");
const CategoryRoutes=require("./category.route");
const PropertyRoutes=require("./property.route");
const AdminRoutes = require('./admin.route');
const FavoriteRoutes=require('./favorite.route');
Router.get('/health-check', (req, res) => {
	res.send('OK');
});

Router.use('/users', UserRoutes);
Router.use('/auth', AuthRoutes);
Router.use('/tag',TagRoutes);
Router.use("/category",CategoryRoutes);
Router.use("/property",PropertyRoutes);
Router.use('/admin', AdminRoutes);
Router.use('/favorite',FavoriteRoutes);

// Router.use('/admin', AdminRoutes);

module.exports = Router;