const sequelize = require('../config/dbConfig'); // adjust the path if needed
const { Sequelize, DataTypes } = require('sequelize');

// Initialize an empty object to collect all models
const db = {};

// Attach Sequelize connection
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import your models here
db.SliderImage = require('./sliderImage')(sequelize, DataTypes);

// (in future you can import more models like this)
// db.User = require('./user')(sequelize, DataTypes);

module.exports = db;
