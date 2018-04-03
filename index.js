const App = require('./src/app');
const DB = require('./src/model/index');
const Logger = require('./src/logger');

App.listen(App.get('port'), () => {
	Logger.info(`Application run at port ${App.get('port')}`);
	DB.sequelize.sync()
		.then(() => {
			Logger.info('Connected to database at ' + new Date());
		})
		.catch(error => {
			console.log(error);
			Logger.info('Can not connect to database');
		});
});
// insertUser();
//  insertProperty();
async function insertUser() {
	try {
		let listUser = [];

		for (let i = 0; i < 10; i++) {
			listUser.push({
				id: '' + i,
				email: "#" + i + '@gmail.com',
				password: '123456',
				display_name: 'DISPLAYNAME #' + i
			});
		}
		await DB.User.create(listUser[0]);
		await DB.User.bulkCreate(listUser.splice(1));
	} catch (error) {
		console.log(error);
	}
}

async function insertProperty() {
	try {
		let listProperty = [];

		for (let i = 0; i < 10; i++) {
			listProperty.push({
				id: '' + i,
				name: 'name#' + i,
				code: 'code#' + i
			});
		}
		await DB.Property.bulkCreate(listProperty);
	} catch (error) {
		console.log(error);
	}
}

