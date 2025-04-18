'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('UserAssessments', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('UserAssessments', 'id')
  }
};
