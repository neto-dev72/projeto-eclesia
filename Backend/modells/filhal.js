const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sede = require('./Sede');

const Filhal = sequelize.define('Filhal', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('bloqueado', 'pendente', 'ativo'),
    allowNull: false,
    defaultValue: 'pendente'
  }
});

// Relacionamento: Filhal pertence a uma Sede
Sede.hasMany(Filhal);
Filhal.belongsTo(Sede);

module.exports = Filhal;
