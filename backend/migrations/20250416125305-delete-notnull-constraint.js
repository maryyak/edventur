'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Programs', 'studyplan', {
      type: Sequelize.JSONB, // или Sequelize.TEXT, если у тебя другой тип
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Programs', 'studyplan', {
      type: Sequelize.JSONB,
      allowNull: false,
    });
  }
};
