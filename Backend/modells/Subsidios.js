const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Funcionario = require('./Funcionarios');


const Sede = require("./Sede");
const Filhal = require("./filhal");

const Subsidio = sequelize.define('Subsidio', {

// Nome do subsídio (ex: Transporte, Férias)
nome: {
type: DataTypes.STRING,
allowNull: false,
},

// Valor fixo do subsídio
valor: {
type: DataTypes.DECIMAL(10, 2),
allowNull: false,
defaultValue: 0.00,
},

// Se o subsídio está ativo
ativo: {
type: DataTypes.BOOLEAN,
allowNull: false,
defaultValue: true,
},

}, {
timestamps: true,
});

// Relacionamento opcional: um funcionário pode ter vários subsídios aplicados em meses diferentes
Funcionario.hasMany(Subsidio);
Subsidio.belongsTo(Funcionario);




Sede.hasMany(Subsidio);
Subsidio.belongsTo(Sede);



Filhal.hasMany(Subsidio);
Subsidio.belongsTo(Filhal);


module.exports = Subsidio;
 