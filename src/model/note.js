module.exports = (sequelize, DataTypes) => {
    let Note = sequelize.define('Note', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        property_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: true,
        createdAt: 'date_created',
        updatedAt: 'date_modified',
        tableName: 'tbl_note'
    });
    Note.associate = function(models) {

    }
    return Note;
}