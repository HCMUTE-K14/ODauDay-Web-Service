module.exports=(sequelize, DataTypes) =>{
    let PropertyTag=sequelize.define('PropertyTag',{
        property_id: {
			type: DataTypes.STRING,
			primaryKey: true
        },
        tag_id:{
            type: DataTypes.STRING,
            primaryKey: true
        }
    },{
		timestamps: false,
		tableName: 'tbl_property_tag'
    });
    return PropertyTag;
}