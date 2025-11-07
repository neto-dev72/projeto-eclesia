const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');



const Sede = require("./Sede");
const Filhal = require("./filhal");

const Culto = sequelize.define('Culto', {

  
  // Data e hora do culto
  dataHora: {
    type: DataTypes.DATE,
    allowNull: false
  },
  // Local do culto (ex.: templo central, filial, etc.)
  local: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Quem está responsável pelo culto (opcional)
  responsavel: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Campo para observações ou tema
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
  type: DataTypes.ENUM('programado', 'realizado', 'cancelado'),
  allowNull: false,
  defaultValue: 'programado'
}
,
  // Se o culto ainda está ativo ou já cancelado
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'cultos',
  timestamps: true // cria createdAt e updatedAt
});




Sede.hasMany(Culto);
Culto.belongsTo(Sede);



Filhal.hasMany(Culto);
Culto.belongsTo(Filhal);

module.exports = Culto;
