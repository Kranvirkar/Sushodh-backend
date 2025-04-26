// models/Image.js
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define("Image", {
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mimetype: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    return Image;
};
