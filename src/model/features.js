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
    
    Feature.associate=function(models){
        Feature.belongsTo(models.Property, {foreignKey: 'property_id', as:'features',onDelete:'cascade'});
    };

    return Feature;
}