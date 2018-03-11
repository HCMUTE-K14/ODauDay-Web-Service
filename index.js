const App = require('./src/app');
const DB = require('./src/model/index');
const Logger = require('./src/logger');

App.listen(App.get('port'), () => {
	Logger.info(`Application run at port ${App.get('port')}`);
	DB.sequelize.sync()
		.then(() => {
			Logger.info('Connected to database');
		})
		.catch(error => {
			Logger.info('Can not connect to database');
		});
});
console.log(process.env.PWD);