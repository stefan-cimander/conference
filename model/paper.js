"use strict";

module.exports = function(sequelize, DataTypes) {
    var Paper = sequelize.define('paper',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        keywords: {
            type: DataTypes.STRING,
            allowNull: false
        },
        abstract: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        tag : {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "tag",
                key: 'name'
            }
        }
    });

    return Paper;
};