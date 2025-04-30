const sequelize = require('../config/dbConfig');
const { Sequelize, DataTypes } = require('sequelize');

const db = {};

db.sequelize = sequelize;

// Import models
db.SliderImage = require('./sliderImage')(sequelize, DataTypes); // function-based import
db.Gallery = require('./Gallery')(sequelize, DataTypes); // function-based import
db.Event = require('./Event'); // directly imported
db.EventImage = require('./EventImage'); // directly imported

// Define associations
db.Event.hasMany(db.EventImage, { foreignKey: 'eventId', as: 'images' });
db.EventImage.belongsTo(db.Event, { foreignKey: 'eventId', as: 'event' });

module.exports = db;
