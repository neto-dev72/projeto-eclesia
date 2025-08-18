const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Despesa = sequelize.define('Despesa', {
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING, // Ex: Transporte, Alimentação, Som, etc.
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('Fixa', 'Variável'),
    allowNull: false
  },
  observacao: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'despesas',
  timestamps: true
});

module.exports = Despesa;
