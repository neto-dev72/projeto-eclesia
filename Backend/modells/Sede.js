const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sede = sequelize.define('Sede', {
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

module.exports = Sede;
