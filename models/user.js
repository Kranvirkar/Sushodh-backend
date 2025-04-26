/*
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Role = require('./role');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

module.exports = User;
*/
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/dbConfig');
const Role = require('./role');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: { msg: 'Please provide a valid email' }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    passwordChangedAt: {
        type: DataTypes.DATE
    },
    passwordResetToken: {
        type: DataTypes.STRING
    },
    passwordResetExpires: {
        type: DataTypes.DATE
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

// Hash password before saving
User.beforeCreate(async (user) => {
    if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
    }
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
        user.passwordChangedAt = new Date(Date.now() - 1000);
    }
});

// Associations
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

// Instance Methods
User.prototype.correctPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

User.prototype.createPasswordResetToken = function() {
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = User;
