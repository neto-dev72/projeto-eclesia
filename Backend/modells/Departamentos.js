const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Membros = require('./Membros'); // Para referência do líder


const Sede = require("./Sede");
const Filhal = require("./filhal");


const Departamentos = sequelize.define('Departamento', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  data_criacao: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  local: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numero_membros: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'departamentos',
  timestamps: true
});




Sede.hasMany(Departamentos);
Departamentos.belongsTo(Sede);


Filhal.hasMany(Departamentos);
Departamentos.belongsTo(Filhal);


module.exports = Departamentos;
