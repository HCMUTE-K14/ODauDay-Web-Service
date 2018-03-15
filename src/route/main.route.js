const Express = require('express');

const Router = Express.Router();
const UserRoutes = require('./user.route');
const AuthRoutes = require('./auth.route');
const FeatureRoutes=require("./feature.route");
const TagRoutes=require("./tag.route");
const CategoryRoutes=require("./category.route");
const TypeRoutes=require("./type.route");
const PropertyRoutes=require("./property.route");
const EmailRoutes=require("./email.route");
const PhoneRoutes=require("./phone.route");

Router.get('/health-check', (req, res) => {
	res.send('OK');
});

Router.use('/users', UserRoutes);
Router.use('/auth', AuthRoutes);
Router.use('/feature',FeatureRoutes);
Router.use('/tag',TagRoutes);
Router.use("/category",CategoryRoutes);
Router.use("/type",TypeRoutes);
Router.use("/property",PropertyRoutes);
Router.use("/property/email",EmailRoutes)
Router.use("/property/phone",PhoneRoutes)

module.exports = Router;