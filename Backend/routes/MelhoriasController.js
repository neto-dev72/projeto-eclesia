const express = require("express")
const router = express.Router();
const bcrypt = require("bcrypt")

const Usuarios = require("../modells/Usuarios")

const Membros = require("../modells/Membros");


const Cargo = require("../modells/Cargo");

const Contribuicao = require("../modells/Contribuicoes");



const TipoContribuicao = require("../modells/TipoContribuicao");



const Despesa = require("../modells/Despesas");


const CargoMembro = require("../modells/CargoMembro");


const Cultos= require("../modells/Cultos")
const Presencas = require("../modells/Presencas")
const TipoCulto = require("../modells/TipoCulto");



const Departamentos = require("../modells/Departamentos");


const DepartamentoMembros = require("../modells/DptMembros");




const notificacoes = require("../modells/Notificacoes");




const DadosAcademicos = require("../modells/DadosAcademicos");
const DadosCristaos = require("../modells/DadosCristaos");
const Diversos = require("../modells/Diversos");



const Sede  = require("../modells/Sede")
const Filhal = require("../modells/filhal")

const {fn, col } = require('sequelize');


const dayjs = require("dayjs")



const multer = require('multer');
const path = require('path');



const auth = require("../middlewere/auth");







module.exports = router;
