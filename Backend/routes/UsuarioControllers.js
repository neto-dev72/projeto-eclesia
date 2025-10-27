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

// Rota protegida
router.get('/teste-auth', auth, (req, res) => {
  // Mostra os dados do usuário logado no terminal
  console.log('Usuário autenticado:', req.usuario);

  return res.json({
    mensagem: 'Middleware funcionando! Usuário autenticado.',
    usuarioLogado: req.usuario
  });
});





// Rota para buscar departamentos filtrados pelo contexto do usuário (Sede/Filhal)
router.get('/departamentos', auth, async (req, res) => {
  try {
    const { SedeId, FilhalId } = req.usuario;

    // Define filtro com base no usuário logado
    let filtro = {};
    if (FilhalId) {
      filtro.FilhalId = FilhalId;
    } else if (SedeId) {
      filtro.SedeId = SedeId;
    }

    const departamentos = await Departamentos.findAll({
      where: filtro,
      attributes: ['id', 'nome'],
      order: [['nome', 'ASC']], // ordena pelo nome
    });

    return res.status(200).json(departamentos);
  } catch (error) {
    console.error('Erro ao buscar departamentos:', error);
    return res.status(500).json({ message: 'Erro ao buscar departamentos' });
  }
});







// ====================
// Rota para criar usuário
// ====================


// ====================
// Rota para criar usuário
// ====================
router.post("/usuarios", async (req, res) => {
  const { nome, senha, SedeId, FilhalId } = req.body;

  console.log("Body recebido:", req.body);

  // Validação básica
  if (!nome || !senha) {
    return res.status(400).json({ message: "Nome e senha são obrigatórios." });
  }

  try {
    // Hash da senha
    const hashSenha = await bcrypt.hash(senha, 10);

    // Criação do usuário com função sempre como super_admin
    const novoUsuario = await Usuarios.create({
      nome,
      senha: hashSenha,
      SedeId: SedeId || null,
      FilhalId: FilhalId || null,
      funcao: "super_admin", // atribuindo função fixa
    });

    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso!", usuario: novoUsuario });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});





const jwt = require('jsonwebtoken');

const JWT_SECRET = 'berna12890i'; // ⚠️ Coloque uma senha mais segura para produção




// Rota de login
router.post('/login', async (req, res) => {
  const { nome, senha } = req.body;

  console.log('Body recebido:', req.body);

  // Validação básica
  if (!nome || !senha) {
    return res.status(400).json({ message: 'Nome e senha são obrigatórios.' });
  }

  try {
    // Buscar usuário pelo nome
    const usuario = await Usuarios.findOne({ where: { nome } });

    if (!usuario) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    // Payload do token com base nos campos reais da tabela, incluindo função
    const payload = {
      id: usuario.id,
      nome: usuario.nome,
      SedeId: usuario.SedeId || null,
      FilhalId: usuario.FilhalId || null,
      funcao: usuario.funcao || null, // adicionando a função
    };

    // Gerar token JWT válido por 1 dia
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

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








// Rota para buscar um membro pelo ID
router.get('/perfil-membros/:id', auth, async (req, res) => {
  try {
    const membroId = req.params.id;

    // Buscar o membro com apenas os campos que existem na tabela
    const membro = await Membros.findOne({
      where: { id: membroId },
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
      ],
    });

    if (!membro) {
      return res.status(404).json({ message: 'Membro não encontrado.' });
    }

    // Buscar departamentos do membro
    const deptosIds = await DepartamentoMembros.findAll({
      where: { MembroId: membroId },
      attributes: ['DepartamentoId']
    });
    const departamentoIds = deptosIds.map(d => d.DepartamentoId);
    const departamentos = await Departamentos.findAll({
      where: { id: departamentoIds },
      attributes: ['id', 'nome']
    });

    // Buscar cargos do membro
    const cargosIds = await CargoMembro.findAll({
      where: { MembroId: membroId },
      attributes: ['CargoId']
    });
    const cargoIds = cargosIds.map(c => c.CargoId);
    const cargos = await Cargo.findAll({
      where: { id: cargoIds },
      attributes: ['id', 'nome']
    });

    // Buscar dados acadêmicos
    const dadosAcademicos = await DadosAcademicos.findOne({
      where: { MembroId: membroId },
      attributes: ['habilitacoes', 'especialidades', 'estudo_teologico', 'local_formacao']
    });

    // Buscar dados cristãos
    const dadosCristaos = await DadosCristaos.findOne({
      where: { MembroId: membroId },
      attributes: ['consagrado', 'data_consagracao', 'categoria_ministerial']
    });

    // Buscar dados diversos
    const diversos = await Diversos.findOne({
      where: { MembroId: membroId },
      attributes: ['trabalha', 'conta_outrem', 'conta_propria']
    });

    // Montar a resposta
    const membroCompleto = {
      ...membro.dataValues,
      foto: membro.foto ? `${req.protocol}://${req.get('host')}${membro.foto}` : null,
      departamentos,
      cargos,
      dadosAcademicos: dadosAcademicos ? dadosAcademicos.dataValues : null,
      dadosCristaos: dadosCristaos ? dadosCristaos.dataValues : null,
      diversos: diversos ? diversos.dataValues : null
    };

    return res.status(200).json(membroCompleto);

  } catch (error) {
    console.error('Erro ao buscar membro:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});











// Rota para buscar membros filtrados pelo auth hierárquico (Sede/Filhal)
router.get('/membros', auth, async (req, res) => {
  try {
    console.log(`Usuário logado: ID=${req.usuario.id}, Nome=${req.usuario.nome}`);

    const { SedeId, FilhalId } = req.usuario;

    // Define o filtro inicial com base na hierarquia
    let filtro = {};
    if (FilhalId) {
      filtro.FilhalId = FilhalId;
    } else if (SedeId) {
      filtro.SedeId = SedeId;
    }

    // Buscar membros filtrados
    const membros = await Membros.findAll({
      where: filtro,
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
      ],
      order: [['id', 'DESC']],
    });

    // Para cada membro, buscar departamentos e cargos
    const membrosComDepartamentosECargos = await Promise.all(
      membros.map(async (membro) => {
        // --- Departamentos ---
        const deptosIds = await DepartamentoMembros.findAll({
          where: { MembroId: membro.id },
          attributes: ['DepartamentoId']
        });
        const departamentoIds = deptosIds.map(d => d.DepartamentoId);
        const departamentos = await Departamentos.findAll({
          where: { id: departamentoIds },
          attributes: ['id', 'nome']
        });

        // --- Cargos ---
        const cargosIds = await CargoMembro.findAll({
          where: { MembroId: membro.id },
          attributes: ['CargoId']
        });
        const cargoIds = cargosIds.map(c => c.CargoId);
        const cargos = await Cargo.findAll({
          where: { id: cargoIds },
          attributes: ['id', 'nome']
        });

        return {
          ...membro.dataValues,
          foto: membro.foto ? `${req.protocol}://${req.get('host')}${membro.foto}` : null,
          departamentos,
          cargos
        };
      })
    );

    return res.status(200).json(membrosComDepartamentosECargos);
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});




// Rota básica: busca todos os membros (sem filtro de Sede/Filial e sem detalhes extras)
router.get('/membros-todos', async (req, res) => {
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
      ],
      order: [['id', 'DESC']]
    });

    // Se quiser incluir a URL completa da foto também:
    const membrosComFotoUrl = membros.map(membro => ({
      ...membro.dataValues,
      foto: membro.foto ? `${req.protocol}://${req.get('host')}${membro.foto}` : null,
    }));

    return res.status(200).json(membrosComFotoUrl);
  } catch (error) {
    console.error('Erro ao buscar todos os membros:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});




// Rota para cadastrar um novo cargo com hierarquia (Sede/Filhal)
router.post('/cadastrar-cargos', auth, async (req, res) => {
  const { nome, descricao } = req.body;

  if (!nome) {
    return res.status(400).json({ message: 'O nome do cargo é obrigatório.' });
  }

  try {
    // Pega os dados do usuário logado (já vem do middleware auth)
    const { SedeId, FilhalId } = req.usuario;

    // Cria o cargo já associado à sede ou filhal do usuário
    const novoCargo = await Cargo.create({
      nome,
      descricao: descricao || null,
      SedeId: SedeId || null,
      FilhalId: FilhalId || null
    });

    return res.status(201).json({
      message: 'Cargo cadastrado com sucesso!',
      cargo: novoCargo,
    });
  } catch (error) {
    console.error('Erro ao cadastrar cargo:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar cargo.' });
  }
});



// Rota para listar cargos filtrados pelo contexto do usuário (Sede/Filhal)
router.get('/cargos', auth, async (req, res) => {
  try {
    const { SedeId, FilhalId } = req.usuario;

    // Define filtro com base na hierarquia
    let filtro = {};
    if (FilhalId) {
      filtro.FilhalId = FilhalId;
    } else if (SedeId) {
      filtro.SedeId = SedeId;
    }

    const cargos = await Cargo.findAll({
      where: filtro,
      attributes: ['id', 'nome', 'descricao'],
      order: [['nome', 'ASC']],
    });

    return res.status(200).json(cargos);
  } catch (error) {
    console.error('Erro ao listar cargos:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar cargos.' });
  }
});

 













// Lista de cargos filtrada por hierarquia (Sede/Filhal)
router.get('/lista/cargos', auth, async (req, res) => {
  try {
    const { SedeId, FilhalId } = req.usuario;

    // Filtro hierárquico
    let filtroHierarquia = {};
    if (FilhalId) {
      filtroHierarquia.FilhalId = FilhalId;
    } else if (SedeId) {
      filtroHierarquia.SedeId = SedeId;
    }

    // Busca todos os cargos filtrados e inclui suas associações com CargoMembro
    const cargos = await Cargo.findAll({
      where: filtroHierarquia,
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



// ==========================
// ATUALIZAR CARGO (PUT)
// ==========================
router.put('/cargos/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    const { SedeId, FilhalId } = req.usuario;

    // Filtro hierárquico para segurança
    let filtroHierarquia = {};
    if (FilhalId) {
      filtroHierarquia.FilhalId = FilhalId;
    } else if (SedeId) {
      filtroHierarquia.SedeId = SedeId;
    }

    const cargo = await Cargo.findOne({
      where: { id, ...filtroHierarquia },
    });

    if (!cargo) {
      return res.status(404).json({ message: 'Cargo não encontrado' });
    }

    await cargo.update({ nome, descricao });

    return res.status(200).json({ message: 'Cargo atualizado com sucesso', cargo });
  } catch (error) {
    console.error('Erro ao atualizar cargo:', error);
    return res.status(500).json({ message: 'Erro interno ao atualizar cargo' });
  }
});


// ==========================
// DELETAR CARGO (DELETE)
// ==========================
router.delete('/cargos/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { SedeId, FilhalId } = req.usuario;

    // Filtro hierárquico
    let filtroHierarquia = {};
    if (FilhalId) {
      filtroHierarquia.FilhalId = FilhalId;
    } else if (SedeId) {
      filtroHierarquia.SedeId = SedeId;
    }

    const cargo = await Cargo.findOne({
      where: { id, ...filtroHierarquia },
    });

    if (!cargo) {
      return res.status(404).json({ message: 'Cargo não encontrado' });
    }

    await cargo.destroy();

    return res.status(200).json({ message: 'Cargo excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir cargo:', error);
    return res.status(500).json({ message: 'Erro interno ao excluir cargo' });
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




// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/fotos'); // pasta onde vai salvar as fotos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });




// Rota para atualizar membro com foto, departamentos e tabelas relacionadas
router.put('/membros/:id', auth, upload.single('foto'), async (req, res) => {
  try {
    const membroId = req.params.id;
    const {
      nome, genero, data_nascimento, estado_civil, bi, telefone, email,
      endereco_rua, endereco_bairro, endereco_cidade, endereco_provincia,
      grau_academico, profissao, batizado, data_batismo, ativo, CargosIds,
      DepartamentosIds,
      habilitacoes, especialidades, estudo_teologico, local_formacao,
      consagrado, data_consagracao, categoria_ministerial,
      trabalha, conta_outrem, conta_propria
    } = req.body;

    const membro = await Membros.findByPk(membroId);
    if (!membro) return res.status(404).json({ message: 'Membro não encontrado.' });

    // Função para converter datas inválidas em null
    const parseDate = (dateStr) => {
      if (!dateStr || dateStr === '' || dateStr === 'Invalid date') return null;
      return dateStr;
    };

    // Função para converter arrays de IDs
    const parseIds = (input) => {
      if (!input) return [];
      if (Array.isArray(input)) return input.map(id => parseInt(id, 10));
      return input.split(',').map(id => parseInt(id, 10));
    };
    const cargosArray = parseIds(CargosIds);
    const departamentosArray = parseIds(DepartamentosIds);

    // Validação mínima: nome e gênero sempre
    if (!nome || !genero) {
      return res.status(400).json({ message: 'Nome e gênero são obrigatórios.' });
    }

    const fotoCaminho = req.file ? `/uploads/fotos/${req.file.filename}` : membro.foto;

    // Atualiza dados do membro
    await membro.update({
      nome,
      foto: fotoCaminho,
      genero,
      data_nascimento: parseDate(data_nascimento),
      estado_civil,
      bi: bi && bi.trim() !== '' ? bi.trim() : null, // Evita conflito UNIQUE
      telefone,
      email,
      endereco_rua,
      endereco_bairro,
      endereco_cidade,
      endereco_provincia,
      grau_academico,
      profissao,
      batizado: batizado === true || batizado === 'true',
      data_batismo: parseDate(data_batismo),
      ativo: ativo === true || ativo === 'true',
    });

    // Atualiza cargos se vierem
    if (CargosIds) {
      await CargoMembro.destroy({ where: { MembroId: membroId } });
      if (cargosArray.length > 0) {
        const registrosCargo = cargosArray.map(cargoId => ({ MembroId: membroId, CargoId: cargoId }));
        await CargoMembro.bulkCreate(registrosCargo);
      }
    }

    // Atualiza departamentos se vierem
    if (DepartamentosIds) {
      await DepartamentoMembros.destroy({ where: { MembroId: membroId } });
      if (departamentosArray.length > 0) {
        const registrosDepartamentos = departamentosArray.map(depId => ({
          MembroId: membroId,
          DepartamentoId: depId,
          ativo: true,
          data_entrada: new Date(),
        }));
        await DepartamentoMembros.bulkCreate(registrosDepartamentos);
      }
    }

    // Atualiza dados acadêmicos
    const dadosAcademicos = await DadosAcademicos.findOne({ where: { MembroId: membroId } });
    if (dadosAcademicos) {
      await dadosAcademicos.update({
        habilitacoes: habilitacoes || null,
        especialidades: especialidades || null,
        estudo_teologico: estudo_teologico || null,
        local_formacao: local_formacao || null,
      });
    }

    // Atualiza dados cristãos
    const dadosCristaos = await DadosCristaos.findOne({ where: { MembroId: membroId } });
    if (dadosCristaos) {
      await dadosCristaos.update({
        consagrado: consagrado === true || consagrado === 'true',
        data_consagracao: parseDate(data_consagracao),
        categoria_ministerial: categoria_ministerial || null,
      });
    }

    // Atualiza diversos
    const diversos = await Diversos.findOne({ where: { MembroId: membroId } });
    if (diversos) {
      await diversos.update({
        trabalha: trabalha === true || trabalha === 'true',
        conta_outrem: conta_outrem === true || conta_outrem === 'true',
        conta_propria: conta_propria === true || conta_propria === 'true',
      });
    }

    return res.status(200).json({ message: 'Membro atualizado com sucesso!', membro });

  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});










































router.get('/completos-membros/:id', auth, async (req, res) => {
  try {
    const membroId = req.params.id;

    // 1️⃣ Buscar o membro principal
    const membro = await Membros.findByPk(membroId);
    if (!membro) {
      return res.status(404).json({ message: 'Membro não encontrado.' });
    }

    // 2️⃣ Buscar os dados acadêmicos (1:1)
    const dadosAcademicos = await DadosAcademicos.findOne({ where: { MembroId: membroId } });

    // 3️⃣ Buscar os dados cristãos (1:1)
    const dadosCristaos = await DadosCristaos.findOne({ where: { MembroId: membroId } });

    // 4️⃣ Buscar os dados diversos (1:1)
    const diversos = await Diversos.findOne({ where: { MembroId: membroId } });

    // 5️⃣ Buscar os cargos (N:N)
    const cargoMembros = await CargoMembro.findAll({ where: { MembroId: membroId } });
    const cargos = await Promise.all(
      cargoMembros.map(async (cm) => await Cargo.findByPk(cm.CargoId))
    );

    // 6️⃣ Buscar os departamentos (N:N)
    const departamentoMembros = await DepartamentoMembros.findAll({ where: { MembroId: membroId } });
    const departamentos = await Promise.all(
      departamentoMembros.map(async (dm) => await Departamentos.findByPk(dm.DepartamentoId))
    );

    // 7️⃣ Preparar o caminho completo da foto
    let fotoUrl = null;
    if (membro.foto) {
      // Ajusta o caminho absoluto, garantindo que a imagem possa ser acessada pelo cliente
      fotoUrl = `${req.protocol}://${req.get('host')}${membro.foto.startsWith('/') ? membro.foto : '/' + membro.foto}`;
    }

    // 8️⃣ Montar o objeto final
    const membroCompleto = {
      ...membro.toJSON(),
      foto: fotoUrl, // inclui a foto com URL acessível
      dadosAcademicos: dadosAcademicos || null,
      dadosCristaos: dadosCristaos || null,
      diversos: diversos || null,
      cargos: cargos.filter(Boolean),
      departamentos: departamentos.filter(Boolean),
    };

    console.log('✅ Membro completo retornado:', membroCompleto);

    res.status(200).json(membroCompleto);
  } catch (error) {
    console.error('❌ Erro ao buscar membro completo:', error);
    res.status(500).json({ message: 'Erro interno ao buscar dados completos do membro.' });
  }
});















// Rota para cadastrar membros com foto, departamentos e tabelas relacionadas
router.post('/membros', auth, upload.single('foto'), async (req, res) => {
  try {
    const {
      nome, genero, data_nascimento, estado_civil, bi, telefone, email,
      endereco_rua, endereco_bairro, endereco_cidade, endereco_provincia,
      grau_academico, profissao, batizado, data_batismo, ativo, CargosIds,
      DepartamentosIds,

      // Dados Acadêmicos
      habilitacoes, especialidades, estudo_teologico, local_formacao,

      // Dados Cristãos
      consagrado, data_consagracao, categoria_ministerial,

      // Diversos
      trabalha, conta_outrem, conta_propria
    } = req.body;

    // Validação obrigatória
    const cargosArray = Array.isArray(CargosIds) ? CargosIds : CargosIds ? [CargosIds] : [];
    if (!nome || !genero || cargosArray.length === 0) {
      return res.status(400).json({
        message: 'Nome, gênero e pelo menos um cargo são obrigatórios.'
      });
    }

    const fotoCaminho = req.file ? `/uploads/fotos/${req.file.filename}` : null;

    // Cadastro do membro
    const dados = limparCamposVazios({
      nome,
      foto: fotoCaminho,
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
      // Pega automaticamente da autenticação
      SedeId: req.usuario.SedeId || null,
      FilhalId: req.usuario.FilhalId || null
    });

    const novoMembro = await Membros.create(dados);

    // Cadastro dos cargos (múltiplos)
    if (cargosArray.length > 0) {
      const registrosCargo = cargosArray.map(cargoId => ({
        MembroId: novoMembro.id,
        CargoId: parseInt(cargoId, 10),
      }));
      await CargoMembro.bulkCreate(registrosCargo);
    }

    // Cadastro dos departamentos
    const departamentosArray = Array.isArray(DepartamentosIds) ? DepartamentosIds : DepartamentosIds ? [DepartamentosIds] : [];
    if (departamentosArray.length > 0 && departamentosArray[0] !== '') {
      const registrosDepartamentos = departamentosArray.map(depId => ({
        MembroId: novoMembro.id,
        DepartamentoId: parseInt(depId, 10),
        ativo: true,
        data_entrada: new Date(),
      }));
      await DepartamentoMembros.bulkCreate(registrosDepartamentos);
    }

    // === Cadastro das tabelas novas ===

    // Dados Acadêmicos
    await DadosAcademicos.create({
      habilitacoes: habilitacoes || null,
      especialidades: especialidades || null,
      estudo_teologico: estudo_teologico || null,
      local_formacao: local_formacao || null,
      MembroId: novoMembro.id
    });

    // Dados Cristãos
    await DadosCristaos.create({
      consagrado: consagrado === true || consagrado === 'true',
      data_consagracao: data_consagracao || null,
      categoria_ministerial: categoria_ministerial || null,
      MembroId: novoMembro.id
    });

    // Diversos / Trabalho
    await Diversos.create({
      trabalha: trabalha === true || trabalha === 'true',
      conta_outrem: conta_outrem === true || conta_outrem === 'true',
      conta_propria: conta_propria === true || conta_propria === 'true',
      MembroId: novoMembro.id
    });

    return res.status(201).json({
      message: 'Membro cadastrado com sucesso!',
      membro: novoMembro
    });
  } catch (error) {
    console.error('Erro ao cadastrar membro, cargos, departamentos ou tabelas relacionadas:', error);
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


// Rota - Listar tipos de contribuição filtrados pelo usuário logado (Sede/Filhal)
router.get('/lista/tipos-contribuicao', auth, async (req, res) => {
  try {
    console.log(`Usuário logado: ID=${req.usuario.id}, Nome=${req.usuario.nome}`);

    const { SedeId, FilhalId } = req.usuario;

    // Define o filtro inicial com base na hierarquia
    let filtro = {};
    if (FilhalId) {
      filtro.FilhalId = FilhalId;
    } else if (SedeId) {
      filtro.SedeId = SedeId;
    }

    // Buscar tipos de contribuição filtrados
    const tipos = await TipoContribuicao.findAll({
      where: filtro,
      attributes: ['id', 'nome', 'ativo', 'createdAt'],
    });

    // Para cada tipo, buscamos os dados financeiros agregados, filtrados pelo mesmo contexto
    const tiposComTotais = await Promise.all(
      tipos.map(async (tipo) => {
        const resultado = await Contribuicao.findOne({
          attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalContribuicoes'],
            [Sequelize.fn('SUM', Sequelize.col('valor')), 'receitaTotal'],
            [Sequelize.fn('AVG', Sequelize.col('valor')), 'receitaMedia'],
            [Sequelize.fn('MAX', Sequelize.col('valor')), 'maiorContribuicao'],
          ],
          where: {
            TipoContribuicaoId: tipo.id,
            ...(FilhalId && { FilhalId }),
            ...(!FilhalId && SedeId && { SedeId })
          },
          raw: true,
        });

        return {
          ...tipo.toJSON(),
          totalContribuicoes: parseInt(resultado.totalContribuicoes, 10) || 0,
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






// Rota - Criar novo tipo de contribuição com dados do auth (Sede/Filhal)
router.post('/tipos-contribuicao', auth, async (req, res) => {
  const { nome, ativo = true } = req.body;

  if (!nome) {
    return res.status(400).json({ message: 'O nome do tipo de contribuição é obrigatório.' });
  }

  try {
    // Pega os dados do usuário logado (via middleware auth)
    const { SedeId, FilhalId } = req.usuario;

    // Cria o tipo de contribuição já associado ao contexto do usuário
    const tipo = await TipoContribuicao.create({
      nome,
      ativo,
      SedeId: SedeId || null,
      FilhalId: FilhalId || null
    });

    return res.status(201).json({
      message: 'Tipo de contribuição criado com sucesso!',
      tipo
    });
  } catch (error) {
    console.error('Erro ao criar tipo de contribuição:', error);

    // Verifica se foi erro de nome duplicado
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Já existe um tipo de contribuição com esse nome.' });
    }

    return res.status(500).json({ message: 'Erro ao criar tipo de contribuição.' });
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



// Rota - Lançar nova contribuição com dados do auth (Sede/Filial)
router.post('/contribuicoes', auth, async (req, res) => {
  try {
    const { valor, data, descricao, MembroId, TipoContribuicaoId, CultoId } = req.body;

    // Validação básica
    if (!valor || !data || !TipoContribuicaoId) {
      return res.status(400).json({
        message: 'Valor, data e tipo de contribuição são obrigatórios.'
      });
    }

    // Pega os dados do usuário logado (via middleware auth)
    const { SedeId, FilhalId } = req.usuario;

    // Cria a contribuição já associada ao contexto correto
    const contribuicao = await Contribuicao.create({
      valor: parseFloat(valor),               // garante que é numérico
      data: new Date(data),                   // normaliza a data
      descricao: descricao?.trim() || null,   // opcional
      MembroId: MembroId || null,             // opcional
      TipoContribuicaoId,                     // obrigatório
      CultoId: CultoId || null,               // opcional
      SedeId: SedeId || null,
      FilhalId: FilhalId || null
    });

    return res.status(201).json({
      message: 'Contribuição lançada com sucesso!',
      contribuicao
    });

  } catch (error) {
    console.error('Erro ao lançar contribuição:', error);
    return res.status(500).json({
      message: 'Erro ao lançar contribuição.',
      error: error.message
    });
  }
});


const { Op } = require('sequelize');




// Rota - Listar contribuições filtradas pelo usuário logado (Sede/Filhal)
router.get('/lista/contribuicoes', auth, async (req, res) => {
  const { startDate, endDate, tipoId, membroId } = req.query;

  const where = {};

  // Filtro de datas
  if (startDate && endDate) {
    where.data = { [Op.between]: [startDate, endDate] };
  }

  // Filtro por tipo e membro (opcional)
  if (tipoId) where.TipoContribuicaoId = tipoId;
  if (membroId) where.MembroId = membroId;

  // Filtro hierárquico pelo usuário logado
  const { SedeId, FilhalId } = req.usuario;
  if (FilhalId) {
    where.FilhalId = FilhalId;
  } else if (SedeId) {
    where.SedeId = SedeId;
  }

  try {
    const contribuicoes = await Contribuicao.findAll({
      where,
      include: [
        { model: TipoContribuicao, attributes: ['nome'] },
        { model: Membros, attributes: ['nome'] }
      ],
      order: [['data', 'DESC']],
    });

    return res.status(200).json(contribuicoes);
  } catch (error) {
    console.error('Erro ao buscar contribuições:', error);
    return res.status(500).json({ message: 'Erro ao buscar contribuições' });
  }
});


// Rota - Excluir contribuição (garante que só a Sede/Filhal dona pode excluir)
router.delete('/contribuicoes/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { SedeId, FilhalId } = req.usuario;

  try {
    const contribuicao = await Contribuicao.findByPk(id);

    if (!contribuicao) {
      return res.status(404).json({ message: 'Contribuição não encontrada' });
    }

    // Verifica se o usuário logado pertence à mesma sede/filhal da contribuição
    if (
      (FilhalId && contribuicao.FilhalId !== FilhalId) ||
      (!FilhalId && SedeId && contribuicao.SedeId !== SedeId)
    ) {
      return res.status(403).json({ message: 'Você não tem permissão para excluir esta contribuição.' });
    }

    await contribuicao.destroy();
    return res.status(200).json({ message: 'Contribuição excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir contribuição:', error);
    return res.status(500).json({ message: 'Erro ao excluir contribuição' });
  }
});






// Relatório financeiro filtrado por usuário (Sede/Filhal)
router.get('/financeiro', auth, async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const { SedeId, FilhalId } = req.usuario;

    // Filtro hierárquico
    let filtroHierarquia = {};
    if (FilhalId) {
      filtroHierarquia.FilhalId = FilhalId;
    } else if (SedeId) {
      filtroHierarquia.SedeId = SedeId;
    }

    // Filtros de período
    const wherePeriodoContribuicao = { ...filtroHierarquia };
    const wherePeriodoDespesa = { ...filtroHierarquia };

    if (startDate && endDate) {
      wherePeriodoContribuicao.data = { [Op.between]: [startDate, endDate] };
      wherePeriodoDespesa.data = { [Op.between]: [startDate, endDate] };
    }

    // Totais gerais
    const totalArrecadado = await Contribuicao.sum('valor', { where: wherePeriodoContribuicao }) || 0;
    const totalGasto = await Despesa.sum('valor', { where: wherePeriodoDespesa }) || 0;
    const saldo = totalArrecadado - totalGasto;

    // ---- AGRUPAMENTO POR DIA ----
    // Contribuições agrupadas
    const entradasPorDia = await Contribuicao.findAll({
      attributes: [
        [fn('DATE', col('data')), 'data'],
        [fn('SUM', col('valor')), 'entrada']
      ],
      where: wherePeriodoContribuicao,
      group: [fn('DATE', col('data'))],
      raw: true,
    });

    // Despesas agrupadas
    const saidasPorDia = await Despesa.findAll({
      attributes: [
        [fn('DATE', col('data')), 'data'],
        [fn('SUM', col('valor')), 'saida']
      ],
      where: wherePeriodoDespesa,
      group: [fn('DATE', col('data'))],
      raw: true,
    });

    // Combina os dois arrays em um único objeto por data
    const mapa = {};

    entradasPorDia.forEach(e => {
      const dia = e.data;
      mapa[dia] = mapa[dia] || { data: dia, entrada: 0, saida: 0 };
      mapa[dia].entrada = parseFloat(e.entrada);
    });

    saidasPorDia.forEach(s => {
      const dia = s.data;
      mapa[dia] = mapa[dia] || { data: dia, entrada: 0, saida: 0 };
      mapa[dia].saida = parseFloat(s.saida);
    });

    const grafico = Object.values(mapa).sort((a, b) => a.data.localeCompare(b.data));

    return res.status(200).json({
      totalArrecadado,
      totalGasto,
      saldo,
      grafico, // <-- array [{data:'YYYY-MM-DD', entrada:123, saida:45}, ...]
    });
  } catch (error) {
    console.error('Erro ao gerar relatório financeiro:', error);
    return res.status(500).json({ message: 'Erro ao gerar relatório financeiro' });
  }
});







// 📌 Relatório por Membro – filtrado por hierarquia (Sede/Filhal)
router.get('/relatorios/membro', auth, async (req, res) => {
  const { membroId, startDate, endDate } = req.query;

  if (!membroId) {
    return res.status(400).json({ message: 'membroId é obrigatório' });
  }

  try {
    const { SedeId, FilhalId } = req.usuario;

    // 🔎 Filtro hierárquico
    let filtroHierarquia = {};
    if (FilhalId) {
      filtroHierarquia.FilhalId = FilhalId;
    } else if (SedeId) {
      filtroHierarquia.SedeId = SedeId;
    }

    // 🔎 Filtro de membro e período
    let where = { MembroId: membroId, ...filtroHierarquia };
    if (startDate && endDate) {
      where.data = { [Op.between]: [startDate, endDate] };
    }

    // 📌 Lista completa para exibir na tabela
    const contribuicoes = await Contribuicao.findAll({
      where,
      include: [
        { model: TipoContribuicao, attributes: ['nome'] },
        { model: Membros, attributes: ['nome'] }
      ],
      order: [['data', 'DESC']],
    });

    // 📌 Totais
    const totalContribuido = contribuicoes.reduce(
      (acc, c) => acc + parseFloat(c.valor),
      0
    );
    const quantidade = contribuicoes.length;

    // 📌 Resumo agrupado por tipo de contribuição
    const resumoPorTipo = await Contribuicao.findAll({
      where,
      attributes: [
        'TipoContribuicaoId',
        [fn('SUM', col('Contribuicao.valor')), 'totalTipo'],
        [fn('COUNT', col('Contribuicao.id')), 'quantidadeTipo'],
      ],
      include: [{ model: TipoContribuicao, attributes: ['nome'] }],
      group: ['Contribuicao.TipoContribuicaoId', 'TipoContribuicao.id'],
    });

    return res.status(200).json({
      totalContribuido,
      quantidade,
      resumoPorTipo,
      contribuicoes
    });

  } catch (error) {
    console.error('Erro ao gerar relatório por membro:', error);
    return res.status(500).json({ message: 'Erro ao gerar relatório por membro' });
  }
});







// GET /rota/lista/cultos - retorna cultos ativos filtrados pelo auth hierárquico
router.get('/rota/lista/cultos', auth, async (req, res) => {
  try {
    console.log(`Usuário logado: ID=${req.usuario.id}, Nome=${req.usuario.nome}`);

    const { SedeId, FilhalId } = req.usuario;

    // 🔎 Filtro hierárquico: Filhal > Sede
    let filtro = { ativo: 1 };
    if (FilhalId) {
      filtro.FilhalId = FilhalId;
    } else if (SedeId) {
      filtro.SedeId = SedeId;
    }

    // Buscar cultos ativos respeitando a hierarquia
    const cultos = await Cultos.findAll({
      where: filtro,
      attributes: ['id', 'dataHora', 'local', 'responsavel', 'observacoes'], // 🔥 removido "nome"
      include: [
        {
          model: TipoCulto,
          attributes: ['id', 'nome'], // nome vem do TipoCulto
        },
      ],
      order: [['dataHora', 'ASC']],
    });

    // Formatar dados para o front-end
    const cultosFormatados = cultos.map((c) => ({
      id: c.id,
      dataHora: dayjs(c.dataHora).format('YYYY-MM-DD HH:mm:ss'),
      local: c.local,
      responsavel: c.responsavel,
      observacoes: c.observacoes,
      tipoCulto: c.TipoCulto ? c.TipoCulto.nome : null, // 👈 Nome do culto vem daqui
    }));

    return res.status(200).json(cultosFormatados);
  } catch (error) {
    console.error('Erro ao buscar cultos:', error);
    return res.status(500).json({ message: 'Erro ao buscar cultos' });
  }
});




// POST /cadastrar/cultos - cadastrar um novo culto
router.post('/cadastrar/cultos', auth, async (req, res) => {
  try {
    const { nome, dataHora, local, responsavel, observacoes, ativo = 1 } = req.body;
    const { SedeId, FilhalId } = req.usuario;

    // Validação básica
    if (!nome || !dataHora) {
      return res.status(400).json({ message: 'Campos obrigatórios: nome e dataHora.' });
    }

    // Criação do culto já associado ao contexto do usuário
    const novoCulto = await Cultos.create({
      nome,
      dataHora,
      local: local || null,
      responsavel: responsavel || null,
      observacoes: observacoes || null,
      ativo,
      SedeId: SedeId || null,
      FilhalId: FilhalId || null
    });

    return res.status(201).json({
      message: 'Culto cadastrado com sucesso!',
      culto: novoCulto
    });
  } catch (error) {
    console.error('Erro ao cadastrar culto:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar culto.' });
  }
});


















// ====================
// ROTA: Buscar todas as Sedes
// ====================
router.get("/sedes", async (req, res) => {
  try {
    const sedes = await Sede.findAll({
      order: [["nome", "ASC"]],
    });
    res.status(200).json(sedes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar Sedes", error });
  }
});

// ====================
// ROTA: Buscar todas as Filhais
// ====================
router.get("/filhais", async (req, res) => {
  try {
    const filhais = await Filhal.findAll({
      include: [
        {
          model: Sede,
          attributes: ["id", "nome"], // traz a sede a que pertence
        },
      ],
      order: [["nome", "ASC"]],
    });
    res.status(200).json(filhais);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar Filhais", error });
  }
});





// Rota - Listar todos os tipos de culto filtrados pelo auth hierárquico
router.get('/lista/tipos-culto', auth, async (req, res) => {
  try {
    const { SedeId, FilhalId } = req.usuario;

    // 🔎 Filtro hierárquico: Filhal > Sede
    let filtro = { ativo: 1 }; // apenas tipos ativos
    if (FilhalId) {
      filtro.FilhalId = FilhalId;
    } else if (SedeId) {
      filtro.SedeId = SedeId;
    }

    const tiposCulto = await TipoCulto.findAll({
      where: filtro,
      attributes: ['id', 'nome', 'descricao', 'createdAt'],
      order: [['nome', 'ASC']]
    });

    res.status(200).json(tiposCulto);
  } catch (error) {
    console.error('Erro ao buscar tipos de culto:', error);
    res.status(500).json({ message: 'Erro ao buscar tipos de culto' });
  }
});



// Rota - Criar novo tipo de culto
router.post('/tipocultos', auth, async (req, res) => {
  try {
    const { nome, descricao, ativo } = req.body;
    const { SedeId, FilhalId } = req.usuario; // dados do usuário logado

    // Validação simples
    if (!nome || nome.trim() === '') {
      return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
    }

    // Criação do novo tipo de culto
    const novoTipoCulto = await TipoCulto.create({
      nome: nome.trim(),
      descricao: descricao || '',
      ativo: ativo !== undefined ? ativo : 1, // default 1
      SedeId: SedeId || null,
      FilhalId: FilhalId || null,
    });

    res.status(201).json({
      message: "Tipo de culto criado com sucesso!",
      tipoCulto: novoTipoCulto,
    });
  } catch (error) {
    console.error('Erro ao criar tipo de culto:', error);
    res.status(500).json({ message: 'Erro ao criar tipo de culto' });
  }
});



// Rota - Listar cultos com nome do tipo (limitando os últimos 20)
router.get('/buscar-cultos', async (req, res) => {
  try {
    const cultos = await Cultos.findAll({
      include: [
        {
          model: TipoCulto,
          attributes: ['id', 'nome']
        }
      ],
      order: [['dataHora', 'DESC']],
      limit: 20 // pega apenas os 20 mais recentes
    });

    res.json(cultos);
  } catch (error) {
    console.error('Erro ao buscar cultos:', error);
    res.status(500).json({ message: 'Erro ao buscar cultos' });
  }
});
























// POST /detalhes-cultos → cadastra culto + contribuições (agregadas/individuais) + presenças
router.post('/detalhes-cultos', auth, async (req, res) => {
  const { dataHora, tipoCultoId, contribuicoes, homens, mulheres, criancas } = req.body;

  // pega a hierarquia direto do usuário logado
  const { SedeId, FilhalId } = req.usuario;

  const transaction = await Cultos.sequelize.transaction();

  try {
    // 1. Criar o culto
    const culto = await Cultos.create(
      {
        dataHora,
        TipoCultoId: tipoCultoId,
        SedeId: SedeId || null,
        FilhalId: FilhalId || null,
      },
      { transaction }
    );

    // 2. Criar contribuições
    if (Array.isArray(contribuicoes) && contribuicoes.length > 0) {
      // contribuicoes pode conter tanto agregadas quanto individuais
      // formato esperado:
      // [{ tipoId: 1, valor: 5000 }, { tipoId: 2, valor: 10000, membroId: 7 }]
      const contribs = contribuicoes.map(c => ({
        valor: parseFloat(c.valor) || 0,
        data: new Date(),
        TipoContribuicaoId: c.tipoId,
        CultoId: culto.id,
        MembroId: c.membroId || null,     // se vier, fica individual
        SedeId: SedeId || null,
        FilhalId: FilhalId || null,
      }));

      await Contribuicao.bulkCreate(contribs, { transaction });
    }

    // 3. Criar presença vinculada ao culto
    const total = (parseInt(homens) || 0) + (parseInt(mulheres) || 0) + (parseInt(criancas) || 0);
    await Presencas.create(
      {
        total,
        homens: parseInt(homens) || 0,
        mulheres: parseInt(mulheres) || 0,
        criancas: parseInt(criancas) || 0,
        adultos: (parseInt(homens) || 0) + (parseInt(mulheres) || 0),
        CultoId: culto.id,
        SedeId: SedeId || null,
        FilhalId: FilhalId || null,
      },
      { transaction }
    );

    // Confirma tudo
    await transaction.commit();

    res.status(201).json({ message: 'Culto registrado com sucesso!', cultoId: culto.id });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao registrar culto:', error);
    res.status(500).json({ error: 'Erro ao registrar culto.' });
  }
});












// PUT /detalhes-cultos/:id → atualiza culto + contribuições + presenças
router.put('/detalhes-cultos/:id', auth, async (req, res) => {
  const cultoId = req.params.id;
  const { dataHora, tipoCultoId, contribuicoes, homens, mulheres, criancas } = req.body;
  const { SedeId, FilhalId } = req.usuario;

  const transaction = await Cultos.sequelize.transaction();

  try {
    // 1. Atualiza os dados do culto
    await Cultos.update(
      {
        dataHora,
        TipoCultoId: tipoCultoId,
        SedeId: SedeId || null,
        FilhalId: FilhalId || null,
      },
      { where: { id: cultoId }, transaction }
    );

    // 2. Remove contribuições antigas e recria
    await Contribuicao.destroy({ where: { CultoId: cultoId }, transaction });

    if (Array.isArray(contribuicoes) && contribuicoes.length > 0) {
      const novasContribuicoes = contribuicoes.map(c => ({
        valor: parseFloat(c.valor) || 0,
        data: new Date(),
        TipoContribuicaoId: c.tipoId,
        CultoId: cultoId,
        MembroId: c.membroId || null,
        SedeId: SedeId || null,
        FilhalId: FilhalId || null,
      }));

      await Contribuicao.bulkCreate(novasContribuicoes, { transaction });
    }

    // 3. Atualiza presença
    const total = (parseInt(homens) || 0) + (parseInt(mulheres) || 0) + (parseInt(criancas) || 0);

    await Presencas.update(
      {
        total,
        homens: parseInt(homens) || 0,
        mulheres: parseInt(mulheres) || 0,
        criancas: parseInt(criancas) || 0,
        adultos: (parseInt(homens) || 0) + (parseInt(mulheres) || 0),
        SedeId: SedeId || null,
        FilhalId: FilhalId || null,
      },
      { where: { CultoId: cultoId }, transaction }
    );

    await transaction.commit();
    res.status(200).json({ message: 'Culto atualizado com sucesso!' });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao atualizar culto:', error);
    res.status(500).json({ error: 'Erro ao atualizar culto.' });
  }
});





// DELETE /detalhes-cultos/:id → deleta culto + contribuições + presenças
router.delete('/detalhes-cultos/:id', auth, async (req, res) => {
  const cultoId = req.params.id;
  const transaction = await Cultos.sequelize.transaction();

  try {
    // 1. Exclui contribuições vinculadas
    await Contribuicao.destroy({ where: { CultoId: cultoId }, transaction });

    // 2. Exclui presença vinculada
    await Presencas.destroy({ where: { CultoId: cultoId }, transaction });

    // 3. Exclui o culto
    await Cultos.destroy({ where: { id: cultoId }, transaction });

    await transaction.commit();
    res.status(200).json({ message: 'Culto e dados associados deletados com sucesso!' });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao deletar culto:', error);
    res.status(500).json({ error: 'Erro ao deletar culto.' });
  }
});























// GET /detalhes-cultos/:id → retorna culto com presenças e contribuições
router.get("/detalhes-cultos/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o culto básico
    const culto = await Cultos.findByPk(id);
    if (!culto) {
      return res.status(404).json({ error: "Culto não encontrado" });
    }

    // Busca a presença associada
    const presenca = await Presencas.findOne({ where: { CultoId: id } });

    // Busca as contribuições associadas
    const contribuicoes = await Contribuicao.findAll({ where: { CultoId: id } });

    // Busca tipos e membros para mapear manualmente
    const tipos = await TipoContribuicao.findAll();
    const membros = await Membros.findAll();

    // Simula o mesmo comportamento do include, mas com map manual
    const contribuicoesCompletas = contribuicoes.map((c) => {
      const tipo = tipos.find((t) => t.id === c.TipoContribuicaoId);
      const membro = membros.find((m) => m.id === c.MembroId);

      return {
        ...c.toJSON(),
        tipo: tipo ? { id: tipo.id, nome: tipo.nome } : null,
        membro: membro ? { id: membro.id, nome: membro.nome } : null,
      };
    });

    // Monta a resposta (formato idêntico ao que você pediu)
    const response = {
      id: culto.id,
      dataHora: culto.dataHora,
      tipoCultoId: culto.TipoCultoId,
      homens: presenca?.homens || 0,
      mulheres: presenca?.mulheres || 0,
      criancas: presenca?.criancas || 0,
      contribuicoes: contribuicoesCompletas.map((c) => ({
        tipoId: c.tipo?.id,
        tipoNome: c.tipo?.nome,
        membroId: c.membro?.id || null,
        membroNome: c.membro?.nome || null,
        valor: c.valor,
      })),
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar culto:", error);
    res.status(500).json({ error: "Erro ao buscar culto." });
  }
});







router.get('/lista/presencas', async (req, res) => {
  try {
    const { tipoCultoId, startDate: startQuery, endDate: endQuery } = req.query;

    if (!tipoCultoId) {
      return res.status(400).json({ message: 'tipoCultoId é obrigatório' });
    }

    const startDate = startQuery ? dayjs(startQuery).startOf('day') : null;
    const endDate = endQuery ? dayjs(endQuery).endOf('day') : dayjs().endOf('day');

    // 🔹 Filtrar cultos pelo tipo e intervalo de datas
    let whereCultos = { TipoCultoId: tipoCultoId };
    if (startDate) {
      whereCultos.dataHora = { [Op.between]: [startDate.toDate(), endDate.toDate()] };
    }

    const cultos = await Cultos.findAll({
      where: whereCultos,
      include: [{ model: TipoCulto, attributes: ['id', 'nome'] }],
      order: [['dataHora', 'ASC']],
    });

    const cultoIds = cultos.map(c => c.id);

    const presencas = await Presencas.findAll({
      where: { CultoId: { [Op.in]: cultoIds } },
      include: [{ model: Cultos, attributes: ['id', 'dataHora', 'TipoCultoId'], include: [{ model: TipoCulto, attributes: ['nome'] }] }],
      order: [['createdAt', 'ASC']],
    });

    const totais = {
      totalPresentes: presencas.reduce((acc, p) => acc + (p.total || 0), 0),
      homens: presencas.reduce((acc, p) => acc + (p.homens || 0), 0),
      mulheres: presencas.reduce((acc, p) => acc + (p.mulheres || 0), 0),
      adultos: presencas.reduce((acc, p) => acc + (p.adultos || 0), 0),
      criancas: presencas.reduce((acc, p) => acc + (p.criancas || 0), 0),
    };

    const contribuicoes = await Contribuicao.findAll({
      where: { CultoId: { [Op.in]: cultoIds } },
      include: [
        { model: TipoContribuicao, attributes: ['id', 'nome'] },
        { model: Membros, attributes: ['id', 'nome'], required: false },
      ],
      order: [['data', 'ASC']],
    });

    // 🔹 Totais por tipo de contribuição
    const totaisContribuicoes = {};
    let totalGeralContribuicoes = 0; // ← Novo: total geral

    contribuicoes.forEach(c => {
      const tipo = c.TipoContribuicao.nome;
      const valor = parseFloat(c.valor);
      if (!totaisContribuicoes[tipo]) totaisContribuicoes[tipo] = 0;
      totaisContribuicoes[tipo] += valor;
      totalGeralContribuicoes += valor; // ← soma ao total geral
    });

    // 🔹 Nome do tipo de culto
    const tipoCultoNome = cultos.length > 0 ? cultos[0].TipoCulto.nome : '';

    res.status(200).json({
      tipoCultoNome,
      cultos,
      presencas,
      totais,
      contribuicoes,
      totaisContribuicoes,
      totalGeralContribuicoes, // ← Adicionado no retorno
    });

  } catch (error) {
    console.error('Erro ao buscar presenças e contribuições:', error);
    res.status(500).json({ message: 'Erro ao buscar presenças e contribuições' });
  }
});




























// Rota para buscar todas as sedes com suas filhais
router.get('/sedes-com-filhais', async (req, res) => {
  try {
    const sedes = await Sede.findAll({
      include: [
        {
          model: Filhal,
          attributes: ['id', 'nome', 'endereco', 'telefone', 'email', 'status'] // campos que quer retornar
        }
      ],
      order: [
        ['nome', 'ASC'],
        [Filhal, 'nome', 'ASC']
      ]
    });

    res.status(200).json(sedes);
  } catch (error) {
    console.error('Erro ao buscar sedes com filhais:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});








// Rota para criar uma nova Sede
router.post('/sedes', async (req, res) => {
  try {
    const { nome, endereco, telefone, email, status } = req.body;

    // Validação básica
    if (!nome) {
      return res.status(400).json({ message: 'O nome da Sede é obrigatório.' });
    }

    // Criar a sede
    const novaSede = await Sede.create({
      nome,
      endereco: endereco || null,
      telefone: telefone || null,
      email: email || null,
      status: status || 'pendente'
    });

    return res.status(201).json(novaSede);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar nova Sede.' });
  }
});










/**
 * PATCH /sedes/:id/status       -> Atualiza status de uma Sede
 * PATCH /filhais/:id/status     -> Atualiza status de uma Filhal
 */
router.patch('/:tipo/:id/status', async (req, res) => {
  const { tipo, id } = req.params;
  const { status } = req.body;

  if (!['sedes', 'filhais'].includes(tipo)) {
    return res.status(400).json({ message: 'Tipo inválido. Deve ser sedes ou filhais.' });
  }

  if (!['ativo', 'pendente', 'bloqueado'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido.' });
  }

  try {
    let registro;
    if (tipo === 'sedes') {
      registro = await Sede.findByPk(id);
    } else if (tipo === 'filhais') {
      registro = await Filhal.findByPk(id);
    }

    if (!registro) {
      return res.status(404).json({ message: `${tipo.slice(0, -1)} não encontrado.` });
    }

    registro.status = status;
    await registro.save();

    res.json({ message: 'Status atualizado com sucesso.', status: registro.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar status.', error: err.message });
  }
});










// Rota para verificar status da sede e filhal do usuário logado
router.get('/usuario/status', auth, async (req, res) => {
  try {
    const { id, SedeId, FilhalId } = req.usuario;

    // Buscar a sede e filhal pelo ID do usuário
    const sede = SedeId ? await Sede.findByPk(SedeId) : null;
    const filhal = FilhalId ? await Filhal.findByPk(FilhalId) : null;

    // Verificar status da sede
    if (sede && sede.status !== 'ativo') {
      return res.status(403).json({ message: `A sede (${sede.nome}) não está ativa.` });
    }

    // Verificar status da filhal
    if (filhal && filhal.status !== 'ativo') {
      return res.status(403).json({ message: `A filhal (${filhal.nome}) não está ativa.` });
    }

    return res.status(200).json({
      message: 'Usuário autorizado',
      usuario: {
        id,
        SedeId,
        FilhalId,
        funcao: req.usuario.funcao,
        nome: req.usuario.nome
      }
    });

  } catch (err) {
    console.error('Erro ao verificar status do usuário:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});




// ==========================
// EDITAR DEPARTAMENTO (PUT)
// ==========================
router.put("/departamentos/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const departamento = await Departamentos.findByPk(id);
    if (!departamento) {
      return res.status(404).json({ message: "Departamento não encontrado" });
    }

    await departamento.update(dados);

    return res.status(200).json({
      message: "Departamento atualizado com sucesso",
      departamento,
    });
  } catch (error) {
    console.error("❌ Erro ao editar departamento:", error);
    return res.status(500).json({ message: "Erro ao editar departamento" });
  }
});

// ==========================
// DELETAR DEPARTAMENTO (DELETE)
// ==========================
router.delete("/departamentos/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const departamento = await Departamentos.findByPk(id);
    if (!departamento) {
      return res.status(404).json({ message: "Departamento não encontrado" });
    }

    await departamento.destroy();

    return res.status(200).json({ message: "Departamento excluído com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao excluir departamento:", error);
    return res.status(500).json({ message: "Erro ao excluir departamento" });
  }
});






// GET - Listar departamentos filtrados por Sede/Filhal com contagem de membros
router.get('/departamentos-membros', auth, async (req, res) => {
  try {
    const { SedeId, FilhalId } = req.usuario;

    // Filtro hierárquico
    let filtro = { ativo: 1 };
    if (FilhalId) {
      filtro.FilhalId = FilhalId;
    } else if (SedeId) {
      filtro.SedeId = SedeId;
    }

    // Buscar departamentos
    const departamentos = await Departamentos.findAll({
      where: filtro,
      attributes: ['id', 'nome', 'descricao', 'data_criacao', 'ativo', 'local', 'numero_membros', 'createdAt'],
      order: [['nome', 'ASC']]
    });

    // Para cada departamento, contar membros ativos
    const departamentosComMembros = await Promise.all(
      departamentos.map(async (dep) => {
        const countMembros = await DepartamentoMembros.count({
          where: { DepartamentoId: dep.id, ativo: 1 },
          include: [{
            model: Membros,
            required: true
          }]
        });
        return {
          ...dep.toJSON(),
          totalMembros: countMembros
        };
      })
    );

    res.status(200).json(departamentosComMembros);
  } catch (error) {
    console.error('Erro ao listar departamentos:', error);
    res.status(500).json({ message: 'Erro ao listar departamentos' });
  }
});




// POST - Criar novo departamento
router.post('/departamentos', auth, async (req, res) => {
  try {
    const { nome, descricao, data_criacao, ativo, local } = req.body;
    const { SedeId, FilhalId } = req.usuario;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
    }

    const novoDepartamento = await Departamentos.create({
      nome: nome.trim(),
      descricao: descricao || '',
      data_criacao: data_criacao || new Date(),
      ativo: ativo !== undefined ? ativo : 1,
      local: local || '',
      numero_membros: 0,
      SedeId: SedeId || null,
      FilhalId: FilhalId || null,
    });

    res.status(201).json({
      message: 'Departamento criado com sucesso!',
      departamento: novoDepartamento
    });
  } catch (error) {
    console.error('Erro ao criar departamento:', error);
    res.status(500).json({ message: 'Erro ao criar departamento' });
  }
});




// GET - Dados do usuário logado
router.get('/meu-perfil', auth, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    // Buscar usuário
    const usuario = await Usuarios.findOne({
      where: { id: usuarioId },
      attributes: ['id', 'nome', 'funcao', 'SedeId', 'FilhalId', 'createdAt', 'updatedAt'],
      include: [
        { model: Sede, attributes: ['id', 'nome'], required: false },      // Inclui sede
        { model: Filhal, attributes: ['id', 'nome'], required: false },    // Inclui filhal
      ]
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json({ usuario });
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil do usuário.' });
  }
});




// POST - Criar novo usuário
router.post('/novo-usuarios', auth, async (req, res) => {
  try {
    const { nome, senha, funcao } = req.body;

    // Validação básica
    if (!nome || !senha || !funcao) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Não permitir criação de super_admin via frontend
    if (funcao === 'super_admin') {
      return res.status(403).json({ message: 'Não é permitido criar usuário com função super_admin.' });
    }

    const { SedeId, FilhalId } = req.usuario; // pegar do usuário logado

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar usuário
    const novoUsuario = await Usuarios.create({
      nome,
      senha: hashedPassword,
      funcao,
      SedeId: SedeId || null,
      FilhalId: FilhalId || null,
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso!',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        funcao: novoUsuario.funcao,
        SedeId: novoUsuario.SedeId,
        FilhalId: novoUsuario.FilhalId,
      },
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário.' });
  }
});




// PUT - Atualizar perfil do usuário logado
router.put('/meu-perfil', auth, async (req, res) => {
  try {
    const { nome, senha, funcao } = req.body;

    // Buscar usuário logado
    const usuario = await Usuarios.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualiza campos, se enviados
    if (nome) usuario.nome = nome;
    if (senha) {
      const hashedPassword = await bcrypt.hash(senha, 10);
      usuario.senha = hashedPassword;
    }

    // Não permitir que usuário comum altere função
    if (funcao && req.usuario.funcao !== 'usuario') {
      // Impede alterar para super_admin
      if (funcao === 'super_admin') {
        return res.status(403).json({ message: 'Não é permitido definir função super_admin.' });
      }
      usuario.funcao = funcao;
    }

    // Mantém SedeId e FilhalId atuais
    usuario.SedeId = usuario.SedeId;
    usuario.FilhalId = usuario.FilhalId;

    await usuario.save();

    res.json({
      message: 'Perfil atualizado com sucesso!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        funcao: usuario.funcao,
        SedeId: usuario.SedeId,
        FilhalId: usuario.FilhalId,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil.' });
  }
});





// GET - Listar usuários da mesma Sede e Filhal
router.get('/gestao-usuarios', auth, async (req, res) => {
  try {
    const { SedeId, FilhalId } = req.usuario;

    if (!SedeId && !FilhalId) {
      return res.status(400).json({ message: 'Usuário não está associado a nenhuma Sede ou Filhal.' });
    }

    // Buscar usuários da mesma Sede e Filhal
    const usuarios = await Usuarios.findAll({
      where: {
        ...(SedeId && { SedeId }),
        ...(FilhalId && { FilhalId }),
      },
      attributes: ['id', 'nome', 'funcao', 'SedeId', 'FilhalId', 'createdAt', 'updatedAt'],
      order: [['nome', 'ASC']],
    });

    res.json({ usuarios });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
});




// PUT - Atualizar função do usuário
router.put('/usuarios/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { funcao } = req.body;

    // Validação
    if (!funcao) {
      return res.status(400).json({ message: 'A função é obrigatória.' });
    }

    // Não permitir super_admin via frontend
    if (funcao === 'super_admin') {
      return res.status(403).json({ message: 'Não é permitido atribuir a função super_admin.' });
    }

    // Buscar usuário pelo ID
    const usuario = await Usuarios.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Só permitir alteração se o usuário logado pertence à mesma Sede e Filhal
    const { SedeId, FilhalId } = req.usuario;
    if (usuario.SedeId !== SedeId || usuario.FilhalId !== FilhalId) {
      return res.status(403).json({ message: 'Não autorizado a alterar função deste usuário.' });
    }

    // Atualizar função
    usuario.funcao = funcao;
    await usuario.save();

    res.status(200).json({
      message: 'Função do usuário atualizada com sucesso!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        funcao: usuario.funcao,
        SedeId: usuario.SedeId,
        FilhalId: usuario.FilhalId,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar função do usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar função do usuário.' });
  }
});


// DELETE - Remover usuário
router.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuarios.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado.' });

    await usuario.destroy();

    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário.' });
  }
});






























// Remova o 'auth' para permitir acesso de visitantes
router.get('/verificar-super-admin', async (req, res) => {
  try {
    // Procurar qualquer usuário cuja função seja 'super_admin'
    const superAdmin = await Usuarios.findOne({ where: { funcao: 'super_admin' } });

    if (superAdmin) {
      return res.status(200).json({ existe: true });
    } else {
      return res.status(200).json({ existe: false });
    }
  } catch (error) {
    console.error('Erro ao verificar super_admin:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});












// GET /usuarios/:tipo/:id
// tipo = "sede" ou "filhal"
router.get('/:tipo/:id', auth, async (req, res) => {
  try {
    const { tipo, id } = req.params;

    if (!['sede', 'filhal'].includes(tipo)) {
      return res.status(400).json({ message: 'Tipo inválido. Use "sede" ou "filhal".' });
    }

    let usuarios;

    if (tipo === 'sede') {
      // pega usuários diretamente da sede
      usuarios = await Usuarios.findAll({
        where: { SedeId: id, FilhalId: null }, // só usuários da sede
        attributes: ['id', 'nome', 'email', 'funcao', 'status', 'createdAt']
      });
    } else if (tipo === 'filhal') {
      usuarios = await Usuarios.findAll({
        where: { FilhalId: id },
        attributes: ['id', 'nome', 'email', 'funcao', 'status', 'createdAt']
      });
    }

    if (!usuarios || usuarios.length === 0) {
      return res.json({ message: `Nenhum usuário encontrado para esta ${tipo}.`, usuarios: [] });
    }

    return res.json({ usuarios });
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    return res.status(500).json({ message: 'Erro ao buscar usuários.', error: err.message });
  }
});






// POST /filhais - cadastrar nova filhal (opcional) e usuário
router.post('/filhais', async (req, res) => {
  try {
    const {
      nome,
      endereco,
      telefone,
      email,
      status,
      SedeId,
      usuarioNome,
      usuarioSenha,
      usuarioFuncao
    } = req.body;

    // Agora só valida dados obrigatórios do usuário e sede
    if (!SedeId || !usuarioNome || !usuarioSenha) {
      return res.status(400).json({ message: 'Sede, nome e senha do usuário são obrigatórios.' });
    }

    // Verifica se a sede existe
    const sede = await Sede.findByPk(SedeId);
    if (!sede) {
      return res.status(404).json({ message: 'Sede não encontrada.' });
    }

    let filhal = null;

    // Só cria filial se o nome foi informado
    if (nome && nome.trim() !== '') {
      filhal = await Filhal.create({
        nome,
        endereco,
        telefone,
        email,
        status: status || 'pendente',
        SedeId
      });
    }

    // Hash da senha do usuário
    const hashSenha = await bcrypt.hash(usuarioSenha, 10);

    // Cria o usuário vinculado à sede e, se existir, à filial
    const usuario = await Usuarios.create({
      nome: usuarioNome,
      senha: hashSenha,
      funcao: usuarioFuncao || 'admin',
      SedeId,
      FilhalId: filhal ? filhal.id : null
    });

    // Retorna o que foi criado
    return res.status(201).json({
      message: filhal
        ? 'Filial e usuário criados com sucesso!'
        : 'Usuário criado com sucesso (sem filial).',
      filhal,
      usuario
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao cadastrar filial e usuário.' });
  }
});


/**
 * PATCH /sedes/:id/status       -> Atualiza status de uma Sede
 * PATCH /filhais/:id/status     -> Atualiza status de uma Filhal
 */
router.patch('/:tipo/:id/status', async (req, res) => {
  const { tipo, id } = req.params;
  const { status } = req.body;

  if (!['sedes', 'filhais'].includes(tipo)) {
    return res.status(400).json({ message: 'Tipo inválido. Deve ser sedes ou filhais.' });
  }

  if (!['ativo', 'pendente', 'bloqueado'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido.' });
  }

  try {
    let registro;
    if (tipo === 'sedes') {
      registro = await Sede.findByPk(id);
    } else if (tipo === 'filhais') {
      registro = await Filhal.findByPk(id);
    }

    if (!registro) {
      return res.status(404).json({ message: `${tipo.slice(0, -1)} não encontrado.` });
    }

    registro.status = status;
    await registro.save();

    res.json({ message: 'Status atualizado com sucesso.', status: registro.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar status.', error: err.message });
  }
});

















































// Rota para buscar todos os membros + filtros únicos (filtrados por Sede/Filhal)
router.get('/membros-filtros', auth, async (req, res) => {
  try {
    const { SedeId, FilhalId } = req.usuario;

    // Filtro hierárquico
    let filtro = { ativo: 1 };
    if (FilhalId) {
      filtro.FilhalId = FilhalId;
    } else if (SedeId) {
      filtro.SedeId = SedeId;
    }

    const membros = await Membros.findAll({
      where: filtro,
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
        'ativo',
        'SedeId',
        'FilhalId'
      ],
      order: [['id', 'DESC']]
    });

    const membrosComFotoUrl = membros.map(membro => {
      // Calcula idade
      let idade = null;
      if (membro.data_nascimento) {
        const hoje = new Date();
        const nascimento = new Date(membro.data_nascimento);
        idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
          idade--;
        }
      }

      return {
        ...membro.dataValues,
        idade,
        batizadoStatus: membro.batizado ? "Sim" : "Não",
        foto: membro.foto ? `${req.protocol}://${req.get('host')}${membro.foto}` : null,
      };
    });

    // Função para contar membros por valor
    const contarPor = (campo) => {
      const contagem = {};
      membros.forEach(m => {
        let valor = m[campo];
        if (campo === "batizado") valor = m.batizado ? "Sim" : "Não";
        if (valor) contagem[valor] = (contagem[valor] || 0) + 1;
      });
      return Object.entries(contagem).map(([valor, qtd]) => `${valor} (${qtd} membros)`);
    };

    // Filtros com contagem
    const generos = contarPor("genero");
    const estadosCivis = contarPor("estado_civil");
    const profissoes = contarPor("profissao");

    // Faixas etárias predefinidas
    const idades = ["0-18", "19-30", "31-50", "51+"].map(faixa => {
      let qtd = 0;
      membrosComFotoUrl.forEach(m => {
        if (m.idade !== null) {
          const idade = m.idade;
          const corresponde =
            (faixa === "0-18" && idade <= 18) ||
            (faixa === "19-30" && idade >= 19 && idade <= 30) ||
            (faixa === "31-50" && idade >= 31 && idade <= 50) ||
            (faixa === "51+" && idade >= 51);
          if (corresponde) qtd++;
        }
      });
      return `${faixa} (${qtd} membros)`;
    });

    // Batizado
    const batizados = ["Sim", "Não"].map(status => {
      const qtd = membrosComFotoUrl.filter(m => m.batizadoStatus === status).length;
      return `${status} (${qtd} membros)`;
    });

    return res.status(200).json({
      membros: membrosComFotoUrl,
      filtros: {
        generos,
        estadosCivis,
        profissoes,
        idades,
        batizados
      }
    });
  } catch (error) {
    console.error('Erro ao buscar membros e filtros:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});












// Rota para gerar relatório de membros com múltiplos filtros (com Sede/Filhal)
router.post('/membros-relatorio', auth, async (req, res) => {
  try {
    const { 
      generos = [], 
      estadosCivis = [], 
      profissoes = [], 
      idades = [], 
      batizados = [] 
    } = req.body;

    const { SedeId, FilhalId } = req.usuario;

    // Monta filtro básico para Membros
    let where = { ativo: 1 };
    if (generos.length > 0) where.genero = generos;
    if (estadosCivis.length > 0) where.estado_civil = estadosCivis;
    if (profissoes.length > 0) where.profissao = profissoes;

    // Filtro hierárquico
    if (FilhalId) {
      where.FilhalId = FilhalId;
    } else if (SedeId) {
      where.SedeId = SedeId;
    }

    // Busca membros conforme filtros básicos
    let membros = await Membros.findAll({
      where,
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
        'ativo',
        'SedeId',
        'FilhalId'
      ],
      order: [['id', 'DESC']]
    });

    // Filtros extras (idades e batizado) aplicados em memória
    membros = membros.filter(m => {
      let atende = true;

      // Filtrar por faixa etária
      if (idades.length > 0 && m.data_nascimento) {
        const hoje = new Date();
        const nascimento = new Date(m.data_nascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
          idade--;
        }

        const faixa = 
          idade <= 18 ? "0-18" :
          idade <= 30 ? "19-30" :
          idade <= 50 ? "31-50" : "51+";

        if (!idades.includes(faixa)) atende = false;
      }

      // Filtrar por batizado
      if (batizados.length > 0) {
        const status = m.batizado ? "Sim" : "Não";
        if (!batizados.includes(status)) atende = false;
      }

      return atende;
    });

    // Monta resposta final
    const membrosComFotoUrl = membros.map(membro => {
      // Calcula idade
      let idade = null;
      if (membro.data_nascimento) {
        const hoje = new Date();
        const nascimento = new Date(membro.data_nascimento);
        idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
          idade--;
        }
      }

      return {
        ...membro.dataValues,
        idade,
        batizadoStatus: membro.batizado ? "Sim" : "Não",
        foto: membro.foto ? `${req.protocol}://${req.get('host')}${membro.foto}` : null,
      };
    });

    return res.status(200).json(membrosComFotoUrl);
  } catch (error) {
    console.error('Erro ao gerar relatório de membros:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});








// Rota para histórico de contribuições de um membro
router.get('/membros/:membroId/historico', auth, async (req, res) => {
  const { membroId } = req.params;

  if (!membroId) {
    return res.status(400).json({ message: 'membroId é obrigatório' });
  }

  try {
    const { SedeId, FilhalId } = req.usuario;

    // Filtro hierárquico do usuário
    let filtroHierarquia = {};
    if (FilhalId) filtroHierarquia.FilhalId = FilhalId;
    else if (SedeId) filtroHierarquia.SedeId = SedeId;

    // Buscar todas as contribuições do membro
    const contribuicoes = await Contribuicao.findAll({
      where: { MembroId: membroId, ...filtroHierarquia },
      include: [{ model: TipoContribuicao, attributes: ['nome'] }],
      order: [['data', 'DESC']],
    });

    // Calcular totais por tipo de contribuição
    const totalPorTipo = {};
    contribuicoes.forEach(c => {
      const tipo = c.TipoContribuicao.nome;
      if (!totalPorTipo[tipo]) totalPorTipo[tipo] = 0;
      totalPorTipo[tipo] += parseFloat(c.valor);
    });

    // Calcular total geral
    const totalGeral = contribuicoes.reduce((acc, c) => acc + parseFloat(c.valor), 0);

    // Determinar status do membro
    let status = 'Novo';
    if (contribuicoes.length > 0) {
      const ultimaContribuicao = new Date(contribuicoes[0].data);
      const hoje = new Date();
      const diffMeses = (hoje.getFullYear() - ultimaContribuicao.getFullYear()) * 12 
                       + (hoje.getMonth() - ultimaContribuicao.getMonth());
      if (diffMeses <= 3) status = 'Regular';
      else status = 'Irregular';
    }

    // Criar resumo por tipo de contribuição com porcentagem
    const resumoPorTipo = Object.entries(totalPorTipo).map(([tipo, valor]) => ({
      tipo,
      total: valor,
      percentual: ((valor / totalGeral) * 100).toFixed(2) + '%'
    }));

    console.log({
      status,
      totalGeral,
      quantidadeContribuicoes: contribuicoes.length,
      resumoPorTipo,
      contribuicoes
    })

    return res.status(200).json({
      status,
      totalGeral,
      quantidadeContribuicoes: contribuicoes.length,
      resumoPorTipo,
      contribuicoes
    });

  } catch (error) {
    console.error('Erro ao buscar histórico do membro:', error);
    return res.status(500).json({ message: 'Erro ao buscar histórico do membro' });
  }
});























// Rota para deletar um membro e todos os seus dados relacionados
router.delete('/membros/:id', auth, async (req, res) => {
  try {
    const membroId = req.params.id;

    const membro = await Membros.findByPk(membroId);
    if (!membro) return res.status(404).json({ message: 'Membro não encontrado.' });

    // Remove foto do servidor se existir
    if (membro.foto) {
      const fotoPath = path.join(__dirname, '..', membro.foto);
      if (fs.existsSync(fotoPath)) {
        fs.unlinkSync(fotoPath);
      }
    }

    // Remove cargos relacionados
    await CargoMembro.destroy({ where: { MembroId: membroId } });

    // Remove departamentos relacionados
    await DepartamentoMembros.destroy({ where: { MembroId: membroId } });

    // Remove dados acadêmicos
    await DadosAcademicos.destroy({ where: { MembroId: membroId } });

    // Remove dados cristãos
    await DadosCristaos.destroy({ where: { MembroId: membroId } });

    // Remove diversos
    await Diversos.destroy({ where: { MembroId: membroId } });

    // Finalmente remove o membro
    await membro.destroy();

    return res.status(200).json({ message: 'Membro e todos os seus dados foram removidos com sucesso!' });

  } catch (error) {
    console.error('Erro ao deletar membro:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});






























module.exports = router;
