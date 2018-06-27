const Express = require('express');
const ResponseModel = require('../util/response-model');
const Router = Express.Router();
const UserRoutes = require('./user.route');
const AuthRoutes = require('./auth.route');
const TagRoutes = require("./tag.route");
const CategoryRoutes = require("./category.route");
const AdminRoutes = require('./admin.route');
const FavoriteRoutes = require('./favorite.route');
const SaveSearchRoutes = require("./save-search.route");
const NoteRoutes = require('./note.route');
const SearchRoutes = require('./search.route');
const AutoCompleteRoutes = require('./auto-complete-place.route');
const GeoInfoRoutes = require('./geo-info.route');
const PropertyRoutes = require('./property.route');
const ImageRoutes = require('./image.route');
const StaticMapRoutes = require('./static-map.route');
const DirectionRoutes = require('./direction.route');

const HistoryRoutes=require("./history.route");
const NotifiRoutes=require("./notifi.route");
const PremiumRoutes = require('./premium.route');
const SimilarPropertyRoutes = require('./similar-property.route');

const DB = require('../model/index');

Router.get('/health-check', (req, res) => {
	res.json({message: 'ok'});
});

Router.use('/users', UserRoutes);
Router.use('/auth', AuthRoutes);

Router.use('/tag', TagRoutes);
Router.use("/category", CategoryRoutes);
Router.use('/admin', AdminRoutes);
Router.use('/favorite', FavoriteRoutes);
Router.use('/search', SearchRoutes);
Router.use('/save-search', SaveSearchRoutes);
Router.use('/auto-complete-place', AutoCompleteRoutes);
Router.use('/geo-info', GeoInfoRoutes);
Router.use('/property', PropertyRoutes);
Router.use('/image', ImageRoutes);
Router.use('/notifi',NotifiRoutes);
Router.use('/static-map', StaticMapRoutes);
Router.use('/direction', DirectionRoutes);
Router.use('/note', NoteRoutes);
// Router.use('/admin', AdminRoutes);

Router.use("/history", HistoryRoutes);
Router.use('/premium', PremiumRoutes);
Router.use('/similar-property', SimilarPropertyRoutes);
module.exports = Router;