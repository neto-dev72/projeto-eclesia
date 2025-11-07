// models/Notificacao.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Membro = require("./Membros");

const Atendimento = require("./Atendimento");
const AgendaPastoral = require("./AgendaPastoral");

const Cultos = require("./Cultos");


const Sede = require("./Sede");
const Filhal = require("./filhal");


const Notificacao = sequelize.define("Notificacao", {
 tipo: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: "aniversario",
},

  mensagem: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data_enviada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  lida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  Descricao: {
  type: DataTypes.TEXT,
  allowNull: true,
  
},
}, {
  tableName: "notificacoes",
  timestamps: true,
});

Membro.hasMany(Notificacao, { foreignKey: "MembroId" });
Notificacao.belongsTo(Membro, { foreignKey: "MembroId" });





Atendimento.hasMany(Notificacao);
Notificacao.belongsTo(Atendimento);




AgendaPastoral.hasMany(Notificacao);
Notificacao.belongsTo(AgendaPastoral);



Cultos.hasMany(Notificacao);
Notificacao.belongsTo(Cultos);



module.exports = Notificacao;
