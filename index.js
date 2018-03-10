const App = require('./src/app');
const DB = require('./src/model/index');
const Connection = require('./src/database/connection');


DB.sequelize.sync()
	.then(() => {
		App.listen(App.get('port'), () => {
			console.log(`Application run at port ${App.get('port')}`);
		});
	});

