module.exports=(sequelize, DataTypes) =>{
    let PropertyTag=sequelize.define('PropertyType',{
        property_id: {
			type: DataTypes.STRING,
			primaryKey: true
        },
        type_id:{
            type: DataTypes.STRING,
            primaryKey: true
        }
    },{
		timestamps: false,
		tableName: 'tbl_property_type'
    });
    
    return PropertyTag;
}