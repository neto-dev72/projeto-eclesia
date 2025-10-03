const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Culto = require('./Cultos');

const Presenca = sequelize.define('Presenca', {
  total: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  criancas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  adultos: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  homens: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  mulheres: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'presencas',
  timestamps: true
});

Culto.hasOne(Presenca);
Presenca.belongsTo(Culto);

module.exports = Presenca;
