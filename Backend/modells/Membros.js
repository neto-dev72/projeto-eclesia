const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Membros = sequelize.define('Membro', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: true // caminho da imagem ou URL
  },
  genero: {
    type: DataTypes.ENUM('Masculino', 'Feminino', 'Outro'),
    allowNull: false
  },
  data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  estado_civil: {
    type: DataTypes.ENUM('Solteiro', 'Casado', 'Divorciado', 'Viúvo'),
    allowNull: true
  },
  bi: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isEmail: true }
  },
  endereco_rua: {
    type: DataTypes.STRING,
    allowNull: true
  },
  endereco_bairro: {
    type: DataTypes.STRING,
    allowNull: true
  },
  endereco_cidade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  endereco_provincia: {
    type: DataTypes.STRING,
    allowNull: true
  },
  grau_academico: {
    type: DataTypes.STRING,
    allowNull: true // Ex: Licenciatura, Ensino Médio
  },
  profissao: {
    type: DataTypes.STRING,
    allowNull: true
  },
  batizado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  data_batismo: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'membros',
  timestamps: true
});




module.exports = Membros;
