const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Membro = require('./Membros');
const Sede = require('./Sede');
const Filhal = require('./filhal');

const AgendaPastoral = sequelize.define('AgendaPastoral', {
  // Data e hora do compromisso
  data_hora: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  // Tipo de compromisso (reunião, visita, culto, etc.)
  tipo_cumprimento: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  // Nome da pessoa envolvida (visitado, contato, etc.)
  nome_pessoa: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  // Responsável pelo compromisso
  responsavel: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  // Situação atual do compromisso
  status: {
    type: DataTypes.ENUM('Pendente', 'Concluido', 'Cancelado'),
    allowNull: false,
    defaultValue: 'Pendente',
  },

  // Observações adicionais
  observacao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// 🔗 Relacionamentos
Membro.hasMany(AgendaPastoral, { foreignKey: 'MembroId' });
AgendaPastoral.belongsTo(Membro, { foreignKey: 'MembroId' });

Sede.hasMany(AgendaPastoral);
AgendaPastoral.belongsTo(Sede);

Filhal.hasMany(AgendaPastoral);
AgendaPastoral.belongsTo(Filhal);

module.exports = AgendaPastoral;
