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

            Assessment.belongsTo(models.University, {
                foreignKey: 'universityId'
            })
        }
    }

    Assessment.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        questions: { type: DataTypes.JSON, allowNull: false },
        universityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'Universities', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }
    }, {
        sequelize,
        modelName: 'Assessment',
        timestamps: false
    });

    return Assessment;
};
