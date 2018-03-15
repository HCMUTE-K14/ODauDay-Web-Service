module.exports=(sequelize, DataTypes) =>{
    let Phone=sequelize.define('Phone',{
        id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				is: /^[+0-9]*$/i,
			}
		},
        property_id:{
            type: DataTypes.STRING,
            allowNull: false
        }

    },{
		timestamps: false,
		tableName: 'tbl_phone'
    });
    
    Phone.assosiate=function(model){

    };

    return Phone;
}