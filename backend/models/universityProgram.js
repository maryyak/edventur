'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UniversityProgram extends Model {
        static associate(models) {
            UniversityProgram.belongsTo(models.Program, {
                foreignKey: 'programId', // связываем по programId
                as: 'Program',  // Уникальный alias для ассоциации
                onDelete: 'CASCADE'
            });
        }
    }

    UniversityProgram.init({
        universityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'University', key: 'id' }
        },
        programId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Program', key: 'id' }
        }


    }, {
        sequelize,
        modelName: 'UniversityProgram',
        timestamps: false
    });

    return UniversityProgram;
};
