module.exports = (sequelize, DataTypes) => {
    const SliderImage = sequelize.define('SliderImage', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      image: {
        type: DataTypes.BLOB('long'), // Important: 'long' for bigger images
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'slider_images' // <-- match your table name exactly
    });
  
    return SliderImage;
  };
  