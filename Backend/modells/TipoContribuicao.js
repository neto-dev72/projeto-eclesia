const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoContribuicao = sequelize.define('TipoContribuicao', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
 
});

module.exports = TipoContribuicao;
