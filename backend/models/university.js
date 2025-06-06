'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class University extends Model {
        static associate(models) {
            University.belongsToMany(models.Program, {
                through: models.UniversityProgram,
                foreignKey: 'universityId'
            });

            University.hasMany(models.User, {
                foreignKey: 'universityId'
            });

            University.hasMany(models.Application, {
                foreignKey: 'universityId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            University.hasMany(models.Assessment, {
                foreignKey: 'universityId',
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            })

        }
    }

    University.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        logo: { type: DataTypes.STRING, allowNull: true }
    }, {
        sequelize,
        modelName: 'University',
        timestamps: false
    });

    return University;
};
