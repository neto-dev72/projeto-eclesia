const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Membros = require('./Membros');

const Diversos = sequelize.define('Diversos', {
  trabalha: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  conta_outrem: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  conta_propria: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'diversos',
  timestamps: true
});

// Relação 1:1 com Membros
Membros.hasMany(Diversos);
Diversos.belongsTo(Membros);

module.exports = Diversos;
