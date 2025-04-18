// migrations/2025xxxxxx-add-unique-constraint-user-program.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('UserPrograms', {
      fields: ['userId', 'programId'],
      type: 'unique',
      name: 'user_program_unique'
    });

    await queryInterface.removeConstraint('UserPrograms', 'user_program_unique_constraint');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('UserPrograms', 'user_program_unique');

    await queryInterface.addConstraint('UserPrograms', {
      fields: ['userId', 'programId'],
      type: 'unique',
      name: 'user_program_unique_constraint'
    });
  }
};
