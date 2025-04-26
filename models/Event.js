const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Event = sequelize.define('Events', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    venue: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    images: {
        type: DataTypes.JSON  // for multiple images
    },
    nominationLink: {
        type: DataTypes.STRING
    }
});

module.exports = Event;
