'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('cultos', 'status', {
      type: Sequelize.ENUM('programado', 'realizado', 'cancelado'),
      allowNull: false,
      defaultValue: 'programado'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('cultos', 'status');
  }
};
