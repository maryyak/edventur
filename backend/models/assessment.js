'use strict';
const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
    class Assessment extends Model {
        static associate(models) {
            Assessment.belongsToMany(models.User, {
                through: models.UserAssessment,
                foreignKey: 'assessmentId'
            });

            Assessment.hasMany(models.Program, {
                foreignKey: 'assessment'
            });
        }
    }

    Assessment.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        questions: { type: DataTypes.JSON, allowNull: false }
    }, {
        sequelize,
        modelName: 'Assessment',
        timestamps: false
    });

    return Assessment;
};
