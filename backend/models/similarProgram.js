'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class SimilarProgram extends Model {}

    SimilarProgram.init({
        programId: {
            type: DataTypes.INTEGER,
            references: { model: 'Program', key: 'id' },
            allowNull: false
        },
        similarId: {
            type: DataTypes.INTEGER,
            references: { model: 'Program', key: 'id' },
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'SimilarProgram',
        timestamps: false
    });

    return SimilarProgram;
};
