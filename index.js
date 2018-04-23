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
//insertProperty();
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

function generateRandomNumber() {
	var min = 0.005;
	var max = 0.05;
	return Math.random() * (max - min) + min;
};

async function insertProperty() {
	try {
		let listProperty = [];
		let currentDate = new Date();
		for (let i = 0; i < 200; i++) {
			listProperty.push({
				id: '' + i,
				address: 'name#' + i,
				code: 'code#' + i,
				latitude: 10.785461992387418 + generateRandomNumber(),
				longitude: 106.669320166111 +
					generateRandomNumber(),
				status: 'active',
				postcode: 8000,
				price: 5000,
				num_of_bedroom: 1,
				num_of_bathroom: 1,
				num_of_parking: 1,
				land_size: 5000,
				date_end: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
				type_id: 'BUY'
			});
		}
		await DB.Property.bulkCreate(listProperty);
	} catch (error) {
		console.log(error);
	}
}