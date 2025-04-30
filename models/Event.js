const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Event = sequelize.define('Event', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE, // better to use DATE if it's an actual date
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    venue: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nominationLink: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'events', // Optional: explicitly set table name if needed
    timestamps: true     // Adds createdAt and updatedAt columns automatically
});

module.exports = Event;
