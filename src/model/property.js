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
		timestamps: true,
		createdAt: 'date_created',
		updatedAt: 'date_modified',
		tableName: 'tbl_property'
    });  
    Property.assosiate=function(models){
        Property.belongsToMany(models.Tag, {
            through: models.PropertyTag,
            as: 'tags',
            foreignKey: 'property_id'
        });
    };

    return Property;
}