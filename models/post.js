const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const User = require('./user');

const Post = sequelize.define(
    'post',
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps: true, // createdAt, updatedAt 자동 생성
        paranoid: true, // deletedAt (soft delete)
        modelName: 'Post',
        tableName: 'posts',
    },
);

Post.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Post, { foreignKey: 'userId' });

Post.sync();

module.exports = Post;
