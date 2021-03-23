const { DataTypes } = require('sequelize');
const db = require('../database/connection');

const User = db.define('User', {
    // Model attributes are defined here
    username: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'users',
    timestamps: false
  });

module.exports = User;