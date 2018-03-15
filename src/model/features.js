module.exports=(sequelize, DataTypes) =>{
    let Feature=sequelize.define('Feature',{
        id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        property_id:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
		timestamps: false,
		tableName: 'tbl_feature'
    });
    
    Feature.assosiate=function(model){

    };

    return Feature;
}