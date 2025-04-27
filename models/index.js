const sequelize = require('../config/dbConfig'); // adjust the path if needed
const { Sequelize, DataTypes } = require('sequelize');

// Initialize an empty object to collect all models
const db = {};

// Attach Sequelize connection
db.sequelize = sequelize;

// Import your models here
db.SliderImage = require('./sliderImage')(sequelize, DataTypes);

// (in future you can import more models like this)
// db.User = require('./user')(sequelize, DataTypes);

const Event = require('./Event');
const EventImage = require('./EventImage');

// Associations
Event.hasMany(EventImage, { foreignKey: 'eventId', as: 'images' });
EventImage.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

module.exports = {
    Event,
    EventImage,
    db
};
