'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('horarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dia_cursado: {
        type: Sequelize.DATE
      },
      hora_desde: {
        type: Sequelize.DATE
      },
      hora_hasta: {
        type: Sequelize.DATE
      },
      clase_activa: {
        type: Sequelize.BOOLEAN
      },
      id_materia: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('horarios');
  }
};