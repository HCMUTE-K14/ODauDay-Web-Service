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
	var max = 0.1;
	return Math.random() * (max - min) + min;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTypeId(){
	var type = ['BUY', 'RENT'];
	var number = Math.floor(Math.random() * type.length);
	return type[number];
}
// let json =require('./raw/tt.json');
// insertProperty();

async function insertProperty() {
	try {
		let listProperty = [];
		let currentDate = new Date();
		for (let i = 0; i < json.length; i++) {
			listProperty.push({
				id: '' + i,
				address: json[i].address,
				code: 'code#' + i,
				latitude: json[i].location.lat,
				longitude: json[i].location.long,
				status: 'active',
				postcode: 8000,
				price: getRandomInt(500, 80000000),
				num_of_bedroom: getRandomInt(1,10),
				num_of_bathroom: getRandomInt(1,10),
				num_of_parking: getRandomInt(0,10),
				land_size: getRandomInt(10, 10000),
				date_end: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 * 30),
				type_id: getRandomTypeId()
			});
		}
		await DB.Property.bulkCreate(listProperty);
	} catch (error) {
		console.log(error);
	}
}