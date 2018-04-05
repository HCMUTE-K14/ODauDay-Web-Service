module.exports=(sequelize,DataTypes)=>{
    let Favorite=sequelize.define('Favorite',{
        user_id: {
			type: DataTypes.STRING,
			primaryKey: true
        },
        property_id: {
			type: DataTypes.STRING,
			primaryKey: true
        },
    } ,{
		timestamps: true,
		createdAt: 'date_created',
		updatedAt: 'date_modified',
		tableName: 'tbl_favorite'
    });
    Favorite.associate=function(models){
        
    }
    return Favorite;
}