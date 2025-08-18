const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Membro = require("./Membros")
const Cargos = require("./Cargo")

const Cargo = sequelize.define('Cargo', {
nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
});


module.exports = Cargo;
