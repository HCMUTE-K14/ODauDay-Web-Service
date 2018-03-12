module.exports=(sequelize, DataTypes) =>{
    let Property=sequelize.define('Property',{
        id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        code:{
            type: DataTypes.STRING,
            allowNull: false
        },
        latitude:{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        longitude:{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        postcode:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
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
        phone:{
            type: DataTypes.STRING,
			allowNull: true,
			validate: {
				is: /^[+0-9]*$/i,
			}
        },
        price:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        description:{
            type: DataTypes.STRING
        },
        num_of_bedrom:{
            type: DataTypes.INTEGER
        },
        num_of_bathrom:{
            type: DataTypes.INTEGER
        },
        num_of_packing:{
            type: DataTypes.INTEGER
        },
        land_size:{
            type: DataTypes.DOUBLE,
            allowNull: false
        }
    },{
		timestamps: false,
		tableName: 'tbl_property'
    });
    
    Property.assosiate=function(model){

    };

    return Property;
}