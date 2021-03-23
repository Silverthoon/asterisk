const { DataTypes } = require('sequelize');
const db = require('../database/connection');

const CallList = db.define('callList', {
    // Model attributes are defined here
    accountcode: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    src: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dst: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dcontext: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    channel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dstchannel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastapp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastdata: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    answer: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    billsec: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    disposition: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amaflags: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userfield: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uniqueid: {
        type: DataTypes.INTEGER,
    }
}, {
    tableName: 'cdr',
    timestamps: false
});

module.exports = CallList;