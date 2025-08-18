const express = require("express")
const router = express.Router();
const bcrypt = require("bcrypt")

const Usuarios = require("../modells/Usuarios")

const Membros = require("../modells/Membros");


const Cargo = require("../modells/Cargo");

const Contribuicao = require("../modells/Contribuicoes");



const TipoContribuicao = require("../modells/TipoContribuicao");



const Despesas = require("../modells/Despesas");


const CargoMembro = require("../modells/CargoMembro");

router.post('/usuarios', async (req, res) => {
  const { nome, email, senha, funcao, ativo } = req.body;

  console.log('Body recebido:', req.body);

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    const existe = await Usuarios.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }

    const hashSenha = await bcrypt.hash(senha, 10);

    const ativoBool = ativo === 'true' || ativo === true;

    const novoUsuario = await Usuarios.create({
      nome,
      email,
      senha: hashSenha,
      funcao: funcao || 'membro',
      ativo: ativoBool,
    });

    return res.status(201).json({ message: 'Usuário criado com sucesso!', usuario: novoUsuario });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});





const jwt = require('jsonwebtoken');

const JWT_SECRET = 'berna12890i'; // ⚠️ Coloque uma senha mais segura para produção

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  console.log(req.body)

  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    const usuario = await Usuarios.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    const payload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      funcao: usuario.funcao,
    };

    // Gerar o token com chave definida diretamente aqui
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1d' // expira em 1 dia
    });

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      usuario: payload
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});




router.get('/membros', async (req, res) => {
  try {
    const membros = await Membros.findAll({
      attributes: [
        'id',
        'nome',
        'foto',
        'genero',
        'data_nascimento',
        'estado_civil',
        'telefone',
        'email',
        'endereco_cidade',
        'profissao',
        'batizado',
        'ativo'
      ]
    });
    return res.status(200).json(membros);
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});







// Rota para cadastrar um novo cargo
router.post('/cadastrar-cargos', async (req, res) => {
  const { nome, descricao } = req.body;

  console.log(req.bpdy)

  if (!nome) {
    return res.status(400).json({ message: 'O nome do cargo é obrigatório.' });
  }

  try {
    const existente = await Cargo.findOne({ where: { nome } });
    if (existente) {
      return res.status(409).json({ message: 'Já existe um cargo com este nome.' });
    }

    const novoCargo = await Cargo.create({ nome, descricao });

    return res.status(201).json({
      message: 'Cargo cadastrado com sucesso!',
      cargo: novoCargo,
    });
  } catch (error) {
    console.error('Erro ao cadastrar cargo:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar cargo.' });
  }
});


// Rota para listar todos os cargos
router.get('/cargos', async (req, res) => {
  try {
    const cargos = await Cargo.findAll({
      attributes: ['id', 'nome', 'descricao'],
      order: [['nome', 'ASC']],
    });
    return res.status(200).json(cargos);
  } catch (error) {
    console.error('Erro ao listar cargos:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar cargos.' });
  }
});

 














router.get('/lista/cargos', async (req, res) => {
  try {
    // Busca todos os cargos e inclui suas associações com CargoMembro
    const cargos = await Cargo.findAll({
      include: [
        {
          model: CargoMembro,
          attributes: ['createdAt'],
        },
      ],
      order: [['nome', 'ASC']],
    });

    // Enriquecer os cargos com totalMembros e ultimoAtribuido
    const cargosEnriquecidos = cargos.map(cargo => {
      const totalMembros = cargo.CargoMembros.length;

      const ultimoAtribuido = cargo.CargoMembros.length > 0
        ? cargo.CargoMembros.reduce((maisRecente, atual) => {
            return new Date(atual.createdAt) > new Date(maisRecente.createdAt)
              ? atual
              : maisRecente;
          }).createdAt
        : null;

      return {
        id: cargo.id,
        nome: cargo.nome,
        descricao: cargo.descricao,
        totalMembros,
        ultimoAtribuido,
      };
    });

    return res.status(200).json(cargosEnriquecidos);
  } catch (error) {
    console.error('Erro ao listar cargos:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar cargos.' });
  }
});






















router.post('/membros-cargos', async (req, res) => {
  const { membroId, cargoId } = req.body;

  if (!membroId || !cargoId) {
    return res.status(400).json({ message: 'membroId e cargoId são obrigatórios.' });
  }

  try {
    // Verifica se membro existe
    const membro = await Membros.findByPk(membroId);
    if (!membro) {
      return res.status(404).json({ message: 'Membro não encontrado.' });
    }

    // Verifica se cargo existe
    const cargo = await Cargo.findByPk(cargoId);
    if (!cargo) {
      return res.status(404).json({ message: 'Cargo não encontrado.' });
    }

    // Atualiza o cargo do membro
    membro.CargoMembroId = cargoId;
    await membro.save();

    return res.status(200).json({ message: 'Cargo atribuído ao membro com sucesso.' });
  } catch (error) {
    console.error('Erro ao atribuir cargo ao membro:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

module.exports = router;












// Limpar valores vazios que causam erro de validação
const limparCamposVazios = (obj) => {
  const result = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== '') {
      result[key] = value;
    }
  });
  return result;
};





router.post('/membros', async (req, res) => {
  const {
    nome,
    foto,
    genero,
    data_nascimento,
    estado_civil,
    bi,
    telefone,
    email,
    endereco_rua,
    endereco_bairro,
    endereco_cidade,
    endereco_provincia,
    grau_academico,
    profissao,
    batizado,
    data_batismo,
    ativo,
    CargoId // <- Agora compatível com o frontend
  } = req.body;

  console.log('CargoId recebido:', CargoId);

  try {
    if (!nome || !genero || !CargoId) {
      return res.status(400).json({ message: 'Nome, gênero e cargo são obrigatórios.' });
    }

    const dados = limparCamposVazios({
      nome,
      foto,
      genero,
      data_nascimento,
      estado_civil,
      bi,
      telefone,
      email,
      endereco_rua,
      endereco_bairro,
      endereco_cidade,
      endereco_provincia,
      grau_academico,
      profissao,
      batizado: batizado === true || batizado === 'true',
      data_batismo,
      ativo: ativo === false || ativo === 'false' ? false : true,
    });

    // Cria o membro
    const novoMembro = await Membros.create(dados);

    // Associa cargos ao membro
    const cargosIds = Array.isArray(CargoId) ? CargoId : [CargoId];

    if (cargosIds.length > 0) {
      const registros = cargosIds.map(cargoId => ({
        MembroId: novoMembro.id,
        CargoId: cargoId,
      }));

      await CargoMembro.bulkCreate(registros);
    }

    return res.status(201).json({
      message: 'Membro cadastrado com sucesso!',
      membro: novoMembro,
    });
  } catch (error) {
    console.error('Erro ao cadastrar membro e cargos:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});




router.post('/atribuir-cargos', async (req, res) => {
  const { membroId, cargoId } = req.body;

  // Verificações básicas
  if (!membroId || !cargoId) {
    return res.status(400).json({ message: 'IDs de membro e cargo são obrigatórios.' });
  }

  try {
    const novoRegistro = await CargoMembro.create({
      MembroId: membroId,
      CargoId: cargoId,
    });

    return res.status(201).json({
      message: 'Cargo atribuído com sucesso.',
      cargoMembro: novoRegistro,
    });
  } catch (error) {
    console.error('Erro ao atribuir cargo ao membro:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});







const Sequelize = require("sequelize")


router.get('/lista/tipos-contribuicao', async (req, res) => {
  try {
    const tipos = await TipoContribuicao.findAll({
      attributes: ['id', 'nome', 'ativo', 'createdAt'],
    });

    // Para cada tipo, buscamos os dados financeiros agregados
    const tiposComTotais = await Promise.all(
      tipos.map(async (tipo) => {
        const resultado = await Contribuicao.findOne({
          attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalContribuicoes'],
            [Sequelize.fn('SUM', Sequelize.col('valor')), 'receitaTotal'],
            [Sequelize.fn('AVG', Sequelize.col('valor')), 'receitaMedia'],
            [Sequelize.fn('MAX', Sequelize.col('valor')), 'maiorContribuicao'],
          ],
          where: { TipoContribuicaoId: tipo.id },
          raw: true,
        });

        return {
          ...tipo.toJSON(),
          totalContribuicoes: parseInt(resultado.totalContribuicoes, 10),
          receitaTotal: parseFloat(resultado.receitaTotal) || 0,
          receitaMedia: parseFloat(resultado.receitaMedia) || 0,
          maiorContribuicao: parseFloat(resultado.maiorContribuicao) || 0,
        };
      })
    );

    res.status(200).json(tiposComTotais);
  } catch (error) {
    console.error('Erro ao listar tipos de contribuição:', error);
    res.status(500).json({ message: 'Erro ao buscar tipos de contribuição' });
  }
});



// Rota 2 - Criar novo tipo de contribuição
router.post('/tipos-contribuicao', async (req, res) => {
  const { nome, ativo = true } = req.body;

  try {
    const tipo = await TipoContribuicao.create({ nome, ativo });
    res.status(201).json(tipo);
  } catch (error) {
    console.error('Erro ao criar tipo de contribuição:', error);
    res.status(500).json({ message: 'Erro ao criar tipo de contribuição' });
  }
});



// Rota 3 - Editar tipo de contribuição
router.put('/tipos-contribuicao/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, ativo } = req.body;

  try {
    const tipo = await TipoContribuicao.findByPk(id);
    if (!tipo) return res.status(404).json({ message: 'Tipo não encontrado' });

    await tipo.update({ nome, ativo });
    res.status(200).json(tipo);
  } catch (error) {
    console.error('Erro ao atualizar tipo:', error);
    res.status(500).json({ message: 'Erro ao atualizar tipo' });
  }
});


// Rota 4 - Excluir tipo de contribuição
router.delete('/tipos-contribuicao/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const tipo = await TipoContribuicao.findByPk(id);
    if (!tipo) return res.status(404).json({ message: 'Tipo não encontrado' });

    await tipo.destroy();
    res.status(200).json({ message: 'Tipo excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir tipo:', error);
    res.status(500).json({ message: 'Erro ao excluir tipo' });
  }
});




// Rota 5 - Lançar nova contribuição
router.post('/contribuicoes', async (req, res) => {
  const { valor, data, descricao, MembroId, TipoContribuicaoId } = req.body;

  try {
    const contribuicao = await Contribuicao.create({
      valor,
      data,
      descricao,
      MembroId,
      TipoContribuicaoId,
    });

    res.status(201).json(contribuicao);
  } catch (error) {
    console.error('Erro ao lançar contribuição:', error);
    res.status(500).json({ message: 'Erro ao lançar contribuição' });
  }
});


const { Op } = require('sequelize');


// Rota 6 - Buscar contribuições com filtros
router.get('/lista/contribuicoes', async (req, res) => {
  const { search } = req.query;

  try {
    const contribuicoes = await Contribuicao.findAll({
      include: [
        {
          model: TipoContribuicao,
          attributes: ['nome'],
        },
        {
          model: Membros,
          attributes: ['nome'],
          where: search ? {
            nome: { [Op.like]: `%${search}%` }
          } : undefined
        }
      ],
      order: [['data', 'DESC']],
    });

    res.status(200).json(contribuicoes);
  } catch (error) {
    console.error('Erro ao buscar contribuições:', error);
    res.status(500).json({ message: 'Erro ao buscar contribuições' });
  }
});






// Rota 7 - Excluir contribuição
router.delete('/contribuicoes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const contribuicao = await Contribuicao.findByPk(id);
    if (!contribuicao) return res.status(404).json({ message: 'Contribuição não encontrada' });

    await contribuicao.destroy();
    res.status(200).json({ message: 'Contribuição excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir contribuição:', error);
    res.status(500).json({ message: 'Erro ao excluir contribuição' });
  }
});
































module.exports = router;
