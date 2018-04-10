module.exports=(sequelize, DataTypes) =>{
    let Search=sequelize.define('Search',{
        id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
        },
        user_id:{
            type: DataTypes.STRING,
            allowNull: false
        },
        name:{
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
        }
    },{
		timestamps: true,
		createdAt: 'date_created',
		updatedAt: 'date_modified',
		tableName: 'tbl_search'
    });
    Search.associate=function(models){
        Search.belongsTo(models.User, {foreignKey: 'user_id', as:'users'});
    };

    return Search;
}