'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Application extends Model {
        static associate(models) {
            // Заявка принадлежит пользователю
            Application.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            // Заявка принадлежит университету
            Application.belongsTo(models.University, {
                foreignKey: 'universityId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            // Заявка принадлежит программе
            Application.belongsTo(models.Program, {
                foreignKey: 'programId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    Application.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        universityId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        programId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('на рассмотрении', 'принято', 'отказано'),
            allowNull: false,
            defaultValue: 'на рассмотрении'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Application',
        tableName: 'Applications',
        timestamps: true,
        updatedAt: false
    });

    return Application;
};
