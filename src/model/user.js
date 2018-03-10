const Bcrypt = require('bcryptjs');
const TextUtils = require('../util/text-utils');

module.exports = (sequelize, DataTypes) => {
	let User = sequelize.define('User', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
				msg: 'Email already exists'
			},
			validate: {
				len: {
					args: [6, 128],
					msg: 'Email address must be between 6 and 128 characters in length'
				},
				isEmail: {
					msg: 'Email address must be valid'
				}
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: 'Password can not be empty'
				},
				min: 6
			}
		},
		display_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: 'Display name can not be empty'
				},
				len: {
					arg: [1, 30],
					msg: 'Display name has maxinum 30 characters'
				}
			}
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				is: /^[+0-9]*$/i,
			}
		},
		avatar: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				isUrl: true
			}
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'user',
			validate: {
				isIn: [
					['user', 'admin']
				]
			}
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'pending',
			validate: {
				isIn: [
					['active', 'pending', 'disabled']
				]
			}
		},
		ping_number: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: [4, 8]
			}
		},
		facebook_id: {
			type: DataTypes.STRING
		}
	}, {
		timestamps: true,
		createdAt: 'date_created',
		updatedAt: 'date_modified',
		tableName: 'tbl_user'
	});

	User.associate = function(models) {

	};

	User.prototype.comparePassword = function(cadidatePassword) {
		return Bcrypt.compare(cadidatePassword, this.password);
	}

	User.prototype.hideSecretInformation = function() {
		let user = this.dataValues;

		delete user.password;
		delete user.ping_number;

		return user;
	}

	User.beforeCreate(encryptPasswordIfChanged);
	User.beforeUpdate(encryptPasswordIfChanged);

	return User;
};

function encryptPasswordIfChanged(user, options) {
	return new Promise((resolve, reject) => {
		if (user.changed('password')) {
			TextUtils.hash(user.password)
				.then(hashPassword => {
					user.password = hashPassword;
					resolve();
				})
				.catch(err => {
					reject(err);
				})
		}
	});
}