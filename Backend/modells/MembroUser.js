const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');



const Membros = require("./Membros");

const Sede = require("./Sede");
const Filhal = require("./filhal");



const MembroUser = sequelize.define('MembroUser', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: true // caminho da imagem ou URL
  },
  funcao: {
    type: DataTypes.ENUM('membro'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('aprovado', 'pendente'),
    allowNull: false,
    defaultValue: 'pendente'
  }
});




Membros.hasMany(MembroUser);
MembroUser.belongsTo(Membros);


Sede.hasMany(MembroUser);
MembroUser.belongsTo(Sede);


Filhal.hasMany(MembroUser);
MembroUser.belongsTo(Filhal);



module.exports = MembroUser;
