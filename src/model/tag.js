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
    
    Tag.assosiate=function(model){

    };

    return Tag;
}