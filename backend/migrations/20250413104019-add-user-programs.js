// В файле миграции (например, create_user_programs.js)
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserPrograms', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'UsersInfo',
          key: 'id',
        },
      },
      programId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Programs',
          key: 'id',
        },
      },
      similarityPercentage: {
        type: Sequelize.FLOAT,  // Процент схожести
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserPrograms');
  },
};
