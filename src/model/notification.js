module.exports = (sequelize, DataTypes) => {
    let Notification = sequelize.define('Notification', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        registration_token: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    }, {
        timestamps: false,
        tableName: 'tbl_notification'
    });
    return Notification;
}