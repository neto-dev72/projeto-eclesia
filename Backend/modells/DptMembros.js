const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Membros = require('./Membros');
const Departamentos = require('./Departamentos');

const DepartamentoMembros = sequelize.define('DepartamentoMembros', {
 
  data_entrada: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

Membros.hasMany(DepartamentoMembros)
DepartamentoMembros.belongsTo(Membros)

Departamentos.hasMany(DepartamentoMembros);
DepartamentoMembros.belongsTo(Departamentos);

module.exports = DepartamentoMembros;
