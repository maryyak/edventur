'use strict';
/** @type {import('sequelize-cli').Migration} */


module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Создаем таблицу Assessment
    await queryInterface.createTable('Assessments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      questions: {
        type: Sequelize.JSON,
        allowNull: false
      }
    });

    // Создаем таблицу University
    await queryInterface.createTable('Universities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });

    // Создаем таблицу Program
    await queryInterface.createTable('Programs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      level: {
        type: Sequelize.STRING,
        allowNull: false
      },
      form: {
        type: Sequelize.STRING,
        allowNull: false
      },
      seats: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: false
      },
      additionally: {
        type: Sequelize.STRING,
        allowNull: true
      },
      similarity: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      min_similarity: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      studyplan: {
        type: Sequelize.JSON,
        allowNull: false
      },
      reviews: {
        type: Sequelize.JSON,
        allowNull: true
      },
      assessment: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Assessments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });

    // Создаем таблицу UniversityProgram (многими ко многим)
    await queryInterface.createTable('UniversityPrograms', {
      universityId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Universities',
          key: 'id'
        },
        allowNull: false
      },
      programId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Programs',
          key: 'id'
        },
        allowNull: false
      }
    });

    // Создаем таблицу SimilarProgram (многими ко многим для похожих программ)
    await queryInterface.createTable('SimilarPrograms', {
      programId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Programs',
          key: 'id'
        },
        allowNull: false
      },
      similarId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Programs',
          key: 'id'
        },
        allowNull: false
      }
    });

    // Создаем таблицу User
    await queryInterface.createTable('UsersInfo', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fio: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      university: {
        type: Sequelize.STRING,
        allowNull: false
      },
      course: {
        type: Sequelize.STRING,
        allowNull: true
      },
      direction: {
        type: Sequelize.STRING,
        allowNull: true
      },
      score: {
        type: Sequelize.STRING,
        allowNull: true
      },
      role: {
        type: Sequelize.ENUM('student', 'admin', 'representative'),
        allowNull: false
      }
    });

    // Создаем таблицу UserAssessment (многими ко многим для пользователей и оценок)
    await queryInterface.createTable('UserAssessments', {
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'UsersInfo',
          key: 'id'
        },
        allowNull: false
      },
      assessmentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Assessments',
          key: 'id'
        },
        allowNull: false
      },
      result: {
        type: Sequelize.FLOAT,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Удаляем все таблицы в обратном порядке
    await queryInterface.dropTable('UserAssessments');
    await queryInterface.dropTable('UsersInfo');
    await queryInterface.dropTable('SimilarPrograms');
    await queryInterface.dropTable('UniversityPrograms');
    await queryInterface.dropTable('Programs');
    await queryInterface.dropTable('Universities');
    await queryInterface.dropTable('Assessments');
  }
};
