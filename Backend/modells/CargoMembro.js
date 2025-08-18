const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Membro = require("./Membros");
const Cargo = require("./Cargo")

const CargoMembro = sequelize.define('CargoMembros', {

});


Membro.hasMany(CargoMembro);
CargoMembro.belongsTo(Membro);

Cargo.hasMany(CargoMembro)
CargoMembro.belongsTo(Cargo);


module.exports = CargoMembro;
