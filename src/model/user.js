const Bcrypt = require('bcryptjs');
const TextUtils = require('../util/text-utils');

const MessageHelper = require('../util/message/message-helper');

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

				msg: JSON.stringify(MessageHelper.VI['email_already_exist'])
			},
			validate: {
				len: {
					args: [6, 128],
					msg: JSON.stringify(MessageHelper.VI['email_len'])
				},
				isEmail: {
					msg: JSON.stringify(MessageHelper.VI['email_is_invalid'])
				},
				notNull: {
					msg: JSON.stringify(MessageHelper.VI['email_is_required'])
				}
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {

					msg: JSON.stringify(MessageHelper.VI['password_can_not_be_empty'])
				},
				len: {
					args: [6, 128],
					msg: JSON.stringify(MessageHelper.VI['password_len'])
				},
				notNull: {
					msg: JSON.stringify(MessageHelper.VI['password_is_required'])
				}
			}
		},
		display_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: JSON.stringify(MessageHelper.VI['display_name_can_not_be_empty'])
				},
				len: {
					args: [1, 30],
					msg: JSON.stringify(MessageHelper.VI['display_name_maxinum_len'])
				},
				notNull: {
					msg: JSON.stringify(MessageHelper.VI['display_name_is_required'])
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
			allowNull: true
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'user',
			validate: {
				isIn: {
					args: [
						['user', 'admin']
					],
					msg: JSON.stringify(MessageHelper.VI['role_is_invalid'])
				}
			}
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'pending',
			validate: {
				isIn: {
					args: [
						['active', 'pending', 'disabled']
					],
					msg: JSON.stringify(MessageHelper.VI['status_is_invalid'])
				}
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
		},
		amount: {
			type: DataTypes.DOUBLE
		}
	}, {
		timestamps: true,
		createdAt: 'date_created',
		updatedAt: 'date_modified',
		tableName: 'tbl_user'
	});

	User.associate = function(models) {
		User.belongsToMany(models.Property, {
			through: models.Favorite,
			as: 'favorites',
			foreignKey: 'user_id',
			onDelete: 'cascade'
		});
		User.belongsToMany(models.Property, {
			through: models.Note,
			as: 'notes',
			foreignKey: 'user_id',
			onDelete: 'cascade'
		});
		User.hasMany(models.Property, { foreignKey: 'user_id_created', as: 'properties', onDelete: 'cascade' });
		User.hasMany(models.Search, { foreignKey: 'user_id', as: 'searches' });

		User.hasMany(models.Transaction, {
			foreignKey: 'user_id',
			as: 'transactions'
		});

		User.belongsToMany(models.Property, {
			through: models.History,
			as: 'view_history',
			foreignKey: 'user_id'
		});

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
	User.beforeBulkCreate(encryptPasswordIfChanged);

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