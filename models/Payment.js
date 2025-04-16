const mongoose = require('mongoose');
const sequelize = require('../config/dbConfig');
const {DataTypes} = require("sequelize"); // your Sequelize instance

const Payment = sequelize.define('Payment', {
    merchantTransactionId: { type: DataTypes.STRING, allowNull: false },
    mobileNumber: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    merchantId: { type: DataTypes.STRING, allowNull: false },
    paymentLink: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'PENDING' },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: 'payments',
    timestamps: true, // adds createdAt and updatedAt
});

module.exports = Payment;