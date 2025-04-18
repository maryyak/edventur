
'use strict';

/**
 * Миграция для снятия ограничения NOT NULL с колонки в Sequelize
 * Замените `YOUR_TABLE_NAME` и `COLUMN_NAME`, а также `Sequelize.INTEGER` на нужный вам тип
 */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('UserPrograms', 'similarityPercentage', {
      type: Sequelize.FLOAT,   // или другой тип, например Sequelize.STRING
      allowNull: true            // снимаем NOT NULL
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('UserPrograms', 'similarityPercentage', {
      type: Sequelize.FLOAT,   // тот же тип
      allowNull: false           // возвращаем NOT NULL
    });
  }
};
