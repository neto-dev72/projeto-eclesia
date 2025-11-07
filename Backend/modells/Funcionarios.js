const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Membro = require('./Membros');


const Sede = require("./Sede");
const Filhal = require("./filhal");



const Cargos = require('./Cargo');

const Funcionario = sequelize.define('Funcionario', {
// Salário base fixo
salario_base: {
type: DataTypes.DECIMAL(10, 2),
allowNull: false,
defaultValue: 0.00,
},

// Se está ativo ou não
ativo: {
type: DataTypes.BOOLEAN,
allowNull: false,
defaultValue: true,
},

}, {
timestamps: true,
});

// Relacionamento
Membro.hasOne(Funcionario);
Funcionario.belongsTo(Membro);



// Relacionamento
Cargos.hasOne(Funcionario);
Funcionario.belongsTo(Cargos);


Sede.hasMany(Funcionario);
Funcionario.belongsTo(Sede);



Filhal.hasMany(Funcionario);
Funcionario.belongsTo(Filhal);


module.exports = Funcionario;
 