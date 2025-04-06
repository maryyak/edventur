'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UserAssessment extends Model {
        static associate(models) {
            // Связь с моделью User
            UserAssessment.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'CASCADE', // Удаляем запись при удалении пользователя
            });

            // Связь с моделью Assessment
            UserAssessment.belongsTo(models.Assessment, {
                foreignKey: 'assessmentId',
                onDelete: 'CASCADE', // Удаляем запись при удалении ассессмента
            });
        }
    }

    UserAssessment.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'User', key: 'id' }
        },
        assessmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Assessment', key: 'id' }
        },
        result: {
            type: DataTypes.FLOAT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'UserAssessment',
        timestamps: false
    });

    return UserAssessment;
};
