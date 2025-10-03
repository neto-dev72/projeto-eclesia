// models/TipoCulto.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Culto = require("./Cultos")



const Sede = require("./Sede");
const Filhal = require("./filhal");

const TipoCulto = sequelize.define('TipoCulto', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
   
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});


// Relacionamento
TipoCulto.hasMany(Culto);
Culto.belongsTo(TipoCulto);





Sede.hasMany(TipoCulto);
TipoCulto.belongsTo(Sede);



Filhal.hasMany(TipoCulto);
TipoCulto.belongsTo(Filhal);

module.exports = TipoCulto;
