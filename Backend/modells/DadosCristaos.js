const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Membros = require('./Membros');

const DadosCristaos = sequelize.define('DadosCristaos', {
  consagrado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  data_consagracao: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  categoria_ministerial: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Relação 1:1 com Membros
Membros.hasMany(DadosCristaos);
DadosCristaos.belongsTo(Membros);

module.exports = DadosCristaos;
