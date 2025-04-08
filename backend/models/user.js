'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsToMany(models.Assessment, {
                through: models.UserAssessment,
                foreignKey: 'userId'
            });

            User.belongsTo(models.University, {
                foreignKey: 'universityId',
            });

            User.hasMany(models.Application, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
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
        role: { type: DataTypes.ENUM('student', 'admin', 'representative'), allowNull: false},
        universityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'Universities', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'UsersInfo',
        timestamps: false
    });

    return User;
};
