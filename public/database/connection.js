const Sequelize = require('sequelize');

const sequelize = new Sequelize('asterisk', 'root', null, { dialect: 'mysql' });

module.exports = sequelize;
