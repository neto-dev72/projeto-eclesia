const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Membro = require('./Membros');
const Usuario = require('./Usuarios');



const Sede = require("./Sede");
const Filhal = require("./filhal");


const Atendimento = sequelize.define('Atendimento', {

  // Data e hora do atendimento
  data_hora: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  // Status do atendimento
  status: {
    type: DataTypes.ENUM('Agendado', 'Concluido', 'Cancelado'),
    allowNull: false,
    defaultValue: 'Agendado',
  },

  // Observações adicionais
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

});

// Relacionamentos
Membro.hasMany(Atendimento, { foreignKey: 'MembroId' });
Atendimento.belongsTo(Membro, { foreignKey: 'MembroId' });

Usuario.hasMany(Atendimento, { foreignKey: 'UsuarioId' });
Atendimento.belongsTo(Usuario, { foreignKey: 'UsuarioId' });



Sede.hasMany(Atendimento);
Atendimento.belongsTo(Sede);



Filhal.hasMany(Atendimento);
Atendimento.belongsTo(Filhal);

module.exports = Atendimento;
