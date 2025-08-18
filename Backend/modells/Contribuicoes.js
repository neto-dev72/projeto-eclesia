const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Membro = require('./Membros');
const TipoContribuicao = require('./TipoContribuicao');

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



module.exports = Contribuicao;
