module.exports=(sequelize, DataTypes) =>{
    let Email=sequelize.define('Email',{
        id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
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
        property_id:{
            type: DataTypes.STRING,
            allowNull: false
        }

    },{
		timestamps: false,
		tableName: 'tbl_email'
    });
    
    Email.assosiate=function(model){

    };

    return Email;
}