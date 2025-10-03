const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sede = require("./Sede");
const Filhal = require("./filhal");

const Usuario = sequelize.define('Usuario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  funcao: {
    type: DataTypes.ENUM('super_admin', 'admin', 'moderador', 'usuario'),
    allowNull: false,
    defaultValue: 'usuario'
  }
});

// Relacionamentos
Sede.hasMany(Usuario);
Usuario.belongsTo(Sede);

Filhal.hasMany(Usuario);
Usuario.belongsTo(Filhal);

module.exports = Usuario;
