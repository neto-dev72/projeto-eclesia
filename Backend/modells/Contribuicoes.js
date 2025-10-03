const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Membro = require('./Membros');
const TipoContribuicao = require('./TipoContribuicao');
const Cultos = require("./Cultos")



const Sede = require("./Sede");
const Filhal = require("./filhal");


const Contribuicao = sequelize.define('Contribuicao', {
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'contribuicoes',
  timestamps: true
});

Membro.hasMany(Contribuicao)
Contribuicao.belongsTo(Membro)

TipoContribuicao.hasMany(Contribuicao);
Contribuicao.belongsTo(TipoContribuicao);

Cultos.hasMany(Contribuicao);
Contribuicao.belongsTo(Cultos);





Sede.hasMany(Contribuicao);
Contribuicao.belongsTo(Sede);



Filhal.hasMany(Contribuicao);
Contribuicao.belongsTo(Filhal);


module.exports = Contribuicao;
