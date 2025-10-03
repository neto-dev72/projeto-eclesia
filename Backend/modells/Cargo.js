const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Membro = require("./Membros")


const Sede = require("./Sede");
const Filhal = require("./filhal");



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







Sede.hasMany(Cargo);
Cargo.belongsTo(Sede);



Filhal.hasMany(Cargo);
Cargo.belongsTo(Filhal);


module.exports = Cargo;
