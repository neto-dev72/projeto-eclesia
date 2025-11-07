const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Funcionario = require('./Funcionarios');


const Sede = require("./Sede");
const Filhal = require("./filhal");


const Desconto = sequelize.define('Desconto', {
  // Nome ou tipo do desconto (ex: INSS, Faltas, Atrasos, Empréstimo, etc.)
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Valor do desconto
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },

  // Descrição ou observação adicional (opcional)
  descricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Indica se o desconto está ativo ou não
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

}, {
  timestamps: true,
});

// Relacionamento: um funcionário pode ter vários descontos



Funcionario.hasMany(Desconto);
Desconto.belongsTo(Funcionario);



Sede.hasMany(Desconto);
Desconto.belongsTo(Sede);



Filhal.hasMany(Desconto);
Desconto.belongsTo(Filhal);



module.exports = Desconto;
