const App = require('./src/app');
const DB = require('./src/model/index');
const Connection = require('./src/database/connection');

const Logger = require('./src/logger');

App.listen(App.get('port'), () => {
	Logger.info(`Application run at port ${App.get('port')}`);
	DB.sequelize.sync()
		.then(() => {
			Logger.info('Connected to database at ' + new Date());
		})
		.catch(error => {
			Logger.info(error);
			Logger.info('Can not connect to database');
		});
});

// DB.User.create({
// 	email: 'daohuuloc9419@gmail.com',
// 	password: '123456',
// 	display_name: 'infamouSs'
// })
// .then(data => {
// 	data.addProperty({
// 		name: 'nameProperty',
// 		code: '123',
// 		latitude: 0,
// 		longitude: 0,
// 		postcode: 1000,
// 		status: 'ok',
// 		price: 700,
// 		land_size: 10
// 	});
// })
// .catch(error => {
// 	console.log(error);
// })

