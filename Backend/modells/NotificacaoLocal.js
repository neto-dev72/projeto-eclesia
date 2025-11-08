const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notificacao = require("./Notificacoes");
const Sede = require("./Sede");
const Filhal = require("./filhal");

const NotificacaoLocal = sequelize.define("NotificacaoLocal", {

});


Sede.hasMany(NotificacaoLocal);
NotificacaoLocal.belongsTo(Sede);


Filhal.hasMany(NotificacaoLocal);
NotificacaoLocal.belongsTo(Filhal);



Notificacao.hasMany(NotificacaoLocal);
NotificacaoLocal.belongsTo(Notificacao);


module.exports = NotificacaoLocal;
