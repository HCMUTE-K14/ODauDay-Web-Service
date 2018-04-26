module.exports = (sequelize, DataTypes) => {
    let Image = sequelize.define('Image', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        property_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        createdAt: 'date_created',
        tableName: 'tbl_image'
    });
    Image.associate = function(models) {
        Image.belongsTo(models.Property, {
            foreignKey: 'property_id',
            as: 'images',
            onDelete: 'cascade'
        });
    };
    return Image;
}