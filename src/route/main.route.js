const Express = require('express');

const Router = Express.Router();
const UserRoutes = require('./user.route');
const AuthRoutes = require('./auth.route');
const AdminRoutes = require('./admin.route');

Router.get('/health-check', (req, res) => {
	res.send('OK');
});

Router.use('/users', UserRoutes);
Router.use('/auth', AuthRoutes);
// Router.use('/admin', AdminRoutes);

module.exports = Router;