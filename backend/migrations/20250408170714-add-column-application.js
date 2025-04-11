'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Добавляем programId
    await queryInterface.addColumn('Applications', 'programId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Programs',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Добавляем createdAt
    await queryInterface.addColumn('Applications', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Applications', 'programId');
    await queryInterface.removeColumn('Applications', 'createdAt');
  }
};
