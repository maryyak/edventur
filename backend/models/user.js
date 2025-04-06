'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsToMany(models.Assessment, {
                through: models.UserAssessment,
                foreignKey: 'userId'
            });
        }
    }

    User.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        fio: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        university: { type: DataTypes.STRING, allowNull: false },
        course: { type: DataTypes.STRING, allowNull: true },
        direction: { type: DataTypes.STRING, allowNull: true },
        score: { type: DataTypes.STRING, allowNull: true },
        role: { type: DataTypes.ENUM('student', 'admin', 'representative'), allowNull: false}
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'UsersInfo',
        timestamps: false
    });

    return User;
};
