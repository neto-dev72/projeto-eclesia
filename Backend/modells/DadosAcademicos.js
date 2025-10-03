const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Membros = require('./Membros');

const DadosAcademicos = sequelize.define('DadosAcademicos', {
  habilitacoes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  especialidades: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estudo_teologico: {
    type: DataTypes.STRING,
    allowNull: true
  },
  local_formacao: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

Membros.hasMany(DadosAcademicos)
DadosAcademicos.belongsTo(Membros);

module.exports = DadosAcademicos;
