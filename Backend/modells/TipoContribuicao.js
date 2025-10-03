const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');



const Sede = require("./Sede");
const Filhal = require("./filhal");


const TipoContribuicao = sequelize.define('TipoContribuicao', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
    
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
 
});





Sede.hasMany(TipoContribuicao);
TipoContribuicao.belongsTo(Sede);



Filhal.hasMany(TipoContribuicao);
TipoContribuicao.belongsTo(Filhal);


module.exports = TipoContribuicao;
