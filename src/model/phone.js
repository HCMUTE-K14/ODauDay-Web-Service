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
        phone_number: {
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
    
    Phone.associate=function(models){
        Phone.belongsTo(models.Property, {foreignKey: 'property_id', as: 'phones',onDelete:'cascade'});
    };

    return Phone;
}