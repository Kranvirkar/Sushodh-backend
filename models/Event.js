const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Event = sequelize.define('Event', {   // Table name usually singular in model
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
    nominationLink: {
        type: DataTypes.STRING
    }
});

module.exports = Event;
