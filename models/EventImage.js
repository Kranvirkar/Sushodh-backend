module.exports = (sequelize, DataTypes) => {
    return sequelize.define('EventImage', {
        image_url: {
            type: DataTypes.STRING
        },
        event_id: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'event_images',
        timestamps: false
    });
};
