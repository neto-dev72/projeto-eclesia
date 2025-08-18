require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const session = require('express-session');

app.use(session({
  secret: 'seuSegredoAqui',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Rota simples de teste
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});


const UsuarioController = require("./routes/UsuarioControllers")

app.use("/", UsuarioController);




const RelatoriosController = require("./routes/RelatoriosController")

app.use("/", RelatoriosController);




const GraficoController = require("./routes/GraficoController")

app.use("/", GraficoController);




const DespesaController = require("./routes/DespesaController")

app.use("/", DespesaController);

// Aqui continua o resto do seu código normalmente...

const bcrypt = require("bcrypt")

const usuarios = require("./modells/Usuarios");
const TipoContribuicao = require("./modells/TipoContribuicao");

const Contribuicao = require("./modells/Contribuicoes");
const Despesas = require("./modells/Despesas");

const Membros = require("./modells/Membros");
const Cargo = require("./modells/Cargo");

const CargoMembro = require("./modells/CargoMembro");


app.use(express.json());

// Inicializa conexão com o banco e sobe o servidor
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados com sucesso.');
    await sequelize.sync({ force: false });

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
  }
})();
