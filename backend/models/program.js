'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Program extends Model {
        static associate(models) {
            Program.belongsTo(models.Assessment, {
                foreignKey: 'assessment'
            });

            Program.belongsToMany(models.User, {
                through: models.UserProgram,
                foreignKey: 'programId'
            });

            // Ассоциация многие ко многим с программами для похожих (самосвязь)
            Program.belongsToMany(models.Program, {
                as: 'SimilarPrograms',   // Уникальный alias для первой ассоциации
                through: models.SimilarProgram,
                foreignKey: 'programId',
                otherKey: 'similarId'
            });

            // Ассоциация многие ко многим с программами для других похожих (самосвязь)
            Program.belongsToMany(models.Program, {
                as: 'RelatedPrograms',  // Уникальный alias для второй ассоциации
                through: models.SimilarProgram,
                foreignKey: 'similarId',
                otherKey: 'programId'
            });

            Program.belongsToMany(models.University, {
                through: models.UniversityProgram,
                foreignKey: 'programId'
            });

            Program.hasMany(models.Application, {
                foreignKey: 'programId',
            });
        }
    }

    Program.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        level: { type: DataTypes.STRING, allowNull: false },
        form: { type: DataTypes.STRING, allowNull: false },
        seats: { type: DataTypes.INTEGER, allowNull: false},
        duration: { type: DataTypes.STRING, allowNull: false },
        additionally: { type: DataTypes.STRING, allowNull: true },
        similarity: { type: DataTypes.FLOAT, allowNull: true },
        min_similarity: { type: DataTypes.FLOAT, allowNull: false },
        studyplan: { type: DataTypes.JSON, allowNull: false },
        reviews: { type: DataTypes.JSON, allowNull: true },
        assessment: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'Assessments', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }
    }, {
        sequelize,
        modelName: 'Program',
        timestamps: false
    });

    return Program;
};
