'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UserProgram extends Model {
        static associate(models) {
            // Связь с моделью User
            UserProgram.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'CASCADE', // Удаляем запись при удалении пользователя
            });

            // Связь с моделью Assessment
            UserProgram.belongsTo(models.Program, {
                foreignKey: 'programId',
                onDelete: 'CASCADE',
            });
        }
    }

    UserProgram.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'User', key: 'id' }
        },
        programId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Program', key: 'id' }
        },
        similarityPercentage: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        clicks: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['userId', 'programId'],
                name: 'user_program_unique'
            }
        ],
        sequelize,
        modelName: 'UserProgram',
        timestamps: false
    });

    return UserProgram;
};
