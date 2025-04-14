'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Assessments', 'universityId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Universities', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'

    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Assessments', 'universityId')
  }
};
