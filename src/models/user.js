const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');

const User = sequelize.define(
    'user',
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true, // createdAt, updatedAt 자동 생성
        paranoid: true, // deletedAt (soft delete)
        modelName: 'User',
        tableName: 'users',
    },
);

User.sync();

module.exports = User;
