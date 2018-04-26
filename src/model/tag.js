module.exports=(sequelize, DataTypes) =>{
    let Tag=sequelize.define('Tag',{
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
		tableName: 'tbl_tag'
    });
    
    Tag.associate=function(models){
         Tag.belongsToMany(models.Property, {
             through: models.PropertyTag,
             as: 'propertys',
             foreignKey: 'tag_id'
         });
    };

    return Tag;
}