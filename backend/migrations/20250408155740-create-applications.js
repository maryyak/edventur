'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Applications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'UsersInfo',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      universityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Universities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('на рассмотрении', 'принято', 'отказано'),
        allowNull: false,
        defaultValue: 'на рассмотрении'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Удаляем саму таблицу
    await queryInterface.dropTable('Applications');
    // Удаляем тип ENUM (только если он был создан)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Applications_status";');
  }
};
