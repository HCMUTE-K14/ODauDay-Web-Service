const App = require('./src/app');
const DB = require('./src/model/index');
const Connection = require('./src/database/connection');


DB.sequelize.sync()
	.then(() => {
		App.listen(App.get('port'), () => {
			console.log(`Application run at port ${App.get('port')}`);
		});
	});


// DB.User.create({
// 	email: 'daohuuloc9419@gmail.com',
// 	display_name: 'infamouSs',
// 	password: '123456'
// })
// .then(data => console.log(data))
// .catch(error => console.log(error));