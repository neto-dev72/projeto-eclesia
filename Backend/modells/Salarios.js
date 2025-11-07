const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Funcionario = require('./Funcionarios');


const Sede = require("./Sede");
const Filhal = require("./filhal");

const Salario = sequelize.define('Salario', {

// Mês e ano do pagamento
mes_ano: {
type: DataTypes.STRING, // Ex: '2025-11'
allowNull: false,
},

// Salário base do funcionário
salario_base: {
type: DataTypes.DECIMAL(10, 2),
allowNull: false,
defaultValue: 0.00,
},

// Total de subsídios do mês
total_subsidios: {
type: DataTypes.DECIMAL(10, 2),
allowNull: false,
defaultValue: 0.00,
},

// Salário líquido: salário_base + total_subsidios
salario_liquido: {
type: DataTypes.DECIMAL(10, 2),
allowNull: false,
defaultValue: 0.00,
},

}, {
timestamps: true,
});

// Relacionamento
Funcionario.hasMany(Salario);
Salario.belongsTo(Funcionario);


Sede.hasMany(Salario);
Salario.belongsTo(Sede);



Filhal.hasMany(Salario);
Salario.belongsTo(Filhal);


module.exports = Salario;
