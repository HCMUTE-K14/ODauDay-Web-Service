module.exports=(sequelize, DataTypes) =>{
    let Category=sequelize.define('Category',{
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
		tableName: 'tbl_category'
    });
    
    Category.associate=function(models){
        Category.belongsToMany(models.Property, {
            through: models.PropertyCategory,
            as: 'properties',
            foreignKey: 'category_id'
		});
    };

    return Category;
}