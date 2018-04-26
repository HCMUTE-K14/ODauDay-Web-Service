module.exports = (sequelize, DataTypes) => {
    let PropertyCategory = sequelize.define('PropertyCategory', {
        property_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        category_id: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    }, {
        timestamps: false,
        tableName: 'tbl_property_category'
    });
    return PropertyCategory;
}