'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuarios', 'MembroId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Membros', // o nome da tabela de membros
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Usuarios', 'MembroId');
  }
};



