const Express = require('express');

const Router = Express.Router();
const UserRoutes = require('./user.route');
const AuthRoutes = require('./auth.route');
const FeatureRoutes=require("./feature.route");

Router.get('/health-check', (req, res) => {
	res.send('OK');
});

Router.use('/users', UserRoutes);
Router.use('/auth', AuthRoutes);
Router.use('/feature',FeatureRoutes);

module.exports = Router;