module.exports = (sequelize, DataTypes) => {
	let Property = sequelize.define('Property', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false
		},
		latitude: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		longitude: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		postcode: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false
		},
		price: {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING
		},
		num_of_bedrom: {
			type: DataTypes.INTEGER
		},
		num_of_bathrom: {
			type: DataTypes.INTEGER
		},
		num_of_packing: {
			type: DataTypes.INTEGER
		},
		land_size: {
			type: DataTypes.DOUBLE,
			allowNull: false
		}
	}, {
		timestamps: true,
		createdAt: 'date_created',
		updatedAt: 'date_modified',
		tableName: 'tbl_property'
    });  
    Property.associate=function(models){
    	Property.belongsToMany(models.Tag, {
            through: models.PropertyTag,
            as: 'tags',
    	    foreignKey: 'property_id'
		});
		Property.belongsToMany(models.Category, {
            through: models.PropertyCategory,
            as: 'categorys',
            foreignKey: 'property_id'
		});
		Property.belongsToMany(models.Type, {
            through: models.PropertyType,
            as: 'types',
            foreignKey: 'property_id'
		});
		Property.hasMany(models.Feature,{foreignKey: 'property_id', sourceKey: 'id'});
		Property.hasMany(models.Email,{foreignKey: 'property_id', sourceKey: 'id'});
		Property.hasMany(models.Phone,{foreignKey: 'property_id', sourceKey: 'id'});
		Property.hasMany(models.Image,{foreignKey: 'property_id', sourceKey: 'id'});
    };
    return Property;
}