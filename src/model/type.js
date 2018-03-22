module.exports=(sequelize, DataTypes) =>{
    let Type=sequelize.define('Type',{
        id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
		timestamps: false,
		tableName: 'tbl_type'
    });
    
    Type.associate=function(models){
        Type.belongsToMany(models.Property, {
            through: models.PropertyType,
            as: 'propertys',
            foreignKey: 'type_id'
		});
    };

    return Type;
}