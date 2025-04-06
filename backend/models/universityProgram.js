'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UniversityProgram extends Model {}

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
