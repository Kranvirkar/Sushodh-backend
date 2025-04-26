const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const EventImage = sequelize.define('EventImage', {
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image: {
        type: DataTypes.BLOB('long'),
        allowNull: false
    }
});

module.exports = EventImage;
