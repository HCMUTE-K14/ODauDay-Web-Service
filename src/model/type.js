module.exports=(sequelize, DataTypes) =>{
    let Type=sequelize.define('Type',{
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
		tableName: 'tbl_type'
    });
    
    Type.assosiate=function(model){

    };

    return Type;
}