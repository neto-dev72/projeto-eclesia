const express = require("express")
const router = express.Router();
const bcrypt = require("bcrypt")

const Usuarios = require("../modells/Usuarios")

const Membro = require("../modells/Membros");


const Contribuicao = require("../modells/Contribuicoes");




const Atendimento = require("../modells/Atendimento");

const Sede  = require("../modells/Sede")
const Filhal = require("../modells/filhal")



const TipoContribuicao = require("../modells/TipoContribuicao");

const TipoCulto = require("../modells/TipoCulto");

const Despesas = require("../modells/Despesas");


const Diversos = require("../modells/Diversos")

const Cargo = require("../modells/Cargo");

const CargoMembro = require("../modells/CargoMembro");



const Departamentos = require("../modells/Departamentos");


const DepartamentoMembros = require("../modells/DptMembros");


const { Op, Sequelize, sequelize } = require('sequelize'); // IMPORT CORRETO



// ro
const { fn, col, literal } = require("sequelize");




const Culto = require('../modells/Cultos');

const Presencas = require("../modells/Presencas")





const dayjs = require('dayjs');

const auth = require("../middlewere/auth");
const DadosCristaos = require("../modells/DadosCristaos");


// GET /cultos → agrupado por tipo de culto
router.get('/cultos', auth, async (req, res) => {
  try {
    const { SedeId, FilhalId } = req.usuario;

    // Filtro hierárquico: Filhal > Sede
    let filtro = { ativo: true };
    if (FilhalId) {
      filtro.FilhalId = FilhalId;
    } else if (SedeId) {
      filtro.SedeId = SedeId;
    }

    // Pega todos cultos (não agrupado ainda)
    const cultos = await Culto.findAll({
      where: filtro,
      include: [
        {
          model: TipoCulto,
          attributes: ['id', 'nome'],
        },
        {
          model: Contribuicao,
          attributes: ['id', 'valor'],
        },
        {
          model: Presencas,
          attributes: ['id', 'total', 'homens', 'mulheres', 'criancas'],
        },
      ],
      order: [['dataHora', 'DESC']],
    });

    // Agrupamento manual por tipo de culto
    const agrupado = {};
    cultos.forEach((c) => {
      const tipo = c.TipoCulto ? c.TipoCulto.nome : 'Sem Tipo';
      if (!agrupado[tipo]) {
        agrupado[tipo] = {
          tipoCulto: tipo,
          cultos: [],
          totalContribuicoes: 0,
          presencasTotais: { homens: 0, mulheres: 0, criancas: 0, total: 0 },
          presencaMax: 0,
          presencaMin: null,
        };
      }

      // adiciona culto à lista
      agrupado[tipo].cultos.push({
        id: c.id,
        dataHora: c.dataHora,
        local: c.local,
        responsavel: c.responsavel,
        observacoes: c.observacoes,
        presencas: c.Presenca
          ? {
              total: c.Presenca.total,
              homens: c.Presenca.homens,
              mulheres: c.Presenca.mulheres,
              criancas: c.Presenca.criancas,
            }
          : null,
      });

      // soma contribuições
      if (c.Contribuicaos && c.Contribuicaos.length > 0) {
        agrupado[tipo].totalContribuicoes += c.Contribuicaos.reduce(
          (sum, con) => sum + Number(con.valor),
          0
        );
      }

      // calcula presenças
      if (c.Presenca) {
        const { total, homens, mulheres, criancas } = c.Presenca;

        agrupado[tipo].presencasTotais.total += total || 0;
        agrupado[tipo].presencasTotais.homens += homens || 0;
        agrupado[tipo].presencasTotais.mulheres += mulheres || 0;
        agrupado[tipo].presencasTotais.criancas += criancas || 0;

        // max e min
        if (total > agrupado[tipo].presencaMax) {
          agrupado[tipo].presencaMax = total;
        }
        if (agrupado[tipo].presencaMin === null || total < agrupado[tipo].presencaMin) {
          agrupado[tipo].presencaMin = total;
        }
      }
    });

    // transforma objeto em array + calcula percentuais
    const cultosFormatados = Object.values(agrupado).map((g) => {
      const { homens, mulheres, criancas, total } = g.presencasTotais;

      const percentuais = total > 0 ? {
        homens: ((homens / total) * 100).toFixed(1),
        mulheres: ((mulheres / total) * 100).toFixed(1),
        criancas: ((criancas / total) * 100).toFixed(1),
      } : { homens: 0, mulheres: 0, criancas: 0 };

      return {
        tipoCulto: g.tipoCulto,
        cultos: g.cultos,
        totalContribuicoes: g.totalContribuicoes,
        presencaMax: g.presencaMax,
        presencaMin: g.presencaMin,
        percentuaisPresencas: percentuais,
      };
    });

    res.status(200).json(cultosFormatados);
  } catch (error) {
    console.error('Erro ao listar cultos agrupados:', error);
    res.status(500).json({ message: 'Erro ao listar cultos agrupados' });
  }
});








// GET /cultos/:id/presencas → retorna números do culto
router.get('/cultos/:id/presencas', async (req, res) => {
  const { id } = req.params;

  try {
    const presenca = await Presencas.findOne({
      where: { CultoId: id },
      attributes: ['total', 'criancas', 'adultos', 'homens', 'mulheres']
    });

    res.status(200).json(presenca || {
      total: 0,
      criancas: 0,
      adultos: 0,
      homens: 0,
      mulheres: 0
    });
  } catch (error) {
    console.error('Erro ao buscar presenças agregadas:', error);
    res.status(500).json({ message: 'Erro ao buscar presenças' });
  }
});



// POST /cultos/:id/presencas → salva números do culto
router.post('/cultos/:id/presencas', async (req, res) => {
  const { id } = req.params;
  const { total, criancas, adultos, homens, mulheres } = req.body;

  try {
    await Presencas.upsert({
      CultoId: parseInt(id),
      total: total || 0,
      criancas: criancas || 0,
      adultos: adultos || 0,
      homens: homens || 0,
      mulheres: mulheres || 0
    });

    res.status(200).json({ message: 'Presenças atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar presenças agregadas:', error);
    res.status(500).json({ message: 'Erro ao atualizar presenças' });
  }
});







// Rota - Cadastrar nova despesa com dados do usuário logado
router.post('/cadastro/despesas', auth, async (req, res) => {
  try {
    const { descricao, valor, data, categoria, tipo, observacao } = req.body;

    // Validação básica
    if (!descricao || !valor || !data || !tipo) {
      return res.status(400).json({ message: 'Campos obrigatórios: descricao, valor, data e tipo.' });
    }

    // Pega os dados do usuário logado
    const { SedeId, FilhalId } = req.usuario;

    // Criação do registro
    const novaDespesa = await Despesas.create({
      descricao,
      valor,
      data,
      categoria: categoria || null,
      tipo,                  // 'Fixa' ou 'Variável'
      observacao: observacao || null,
      SedeId: SedeId || null,
      FilhalId: FilhalId || null
    });

    return res.status(201).json({
      message: 'Despesa cadastrada com sucesso!',
      despesa: novaDespesa
    });
  } catch (error) {
    console.error('Erro ao cadastrar despesa:', error);
    return res.status(500).json({ message: 'Erro interno ao cadastrar despesa.' });
  }
});










// POST /lista/membros → busca membros com filtros e hierarquia
router.post('/lista/membros', auth, async (req, res) => {
  try {
    const {
      generos = [],
      estadosCivis = [],
      profissoes = [],
      grausAcademicos = [],
      batizados = [],
      bis = [],
      idades = [],
      departamentos = [],
      cargos = [],
      trabalha = [],
      categoriaMinisterial = []
    } = req.body;

    const where = {};

    // --- Filtros básicos ---
    if (Array.isArray(generos) && generos.length > 0) where.genero = { [Op.in]: generos };
    if (Array.isArray(estadosCivis) && estadosCivis.length > 0) where.estado_civil = { [Op.in]: estadosCivis };
    if (Array.isArray(profissoes) && profissoes.length > 0) where.profissao = { [Op.in]: profissoes };
    if (Array.isArray(grausAcademicos) && grausAcademicos.length > 0) where.grau_academico = { [Op.in]: grausAcademicos };
    if (Array.isArray(batizados) && batizados.length > 0) where.batizado = { [Op.in]: batizados.map(b => (b ? 1 : 0)) };
    if (Array.isArray(bis) && bis.length > 0) where.bi = { [Op.in]: bis }; // opcional, se quiser remover, delete esta linha

    // --- Filtro por idade ---
    if (Array.isArray(idades) && idades.length > 0) {
      const today = new Date();
      const idadeFilters = idades.map(idade => {
        const anoMin = today.getFullYear() - idade - 1;
        const anoMax = today.getFullYear() - idade;
        return {
          data_nascimento: {
            [Op.between]: [new Date(anoMin, today.getMonth(), today.getDate() + 1), new Date(anoMax, today.getMonth(), today.getDate())]
          }
        };
      });
      // Se já existir Op.or, concatenar
      if (where[Op.and]) where[Op.and].push({ [Op.or]: idadeFilters });
      else where[Op.and] = [{ [Op.or]: idadeFilters }];
    }

    // --- Hierarquia do usuário ---
    const { SedeId, FilhalId } = req.usuario;
    if (FilhalId) where.FilhalId = FilhalId;
    else if (SedeId) where.SedeId = SedeId;

    // --- Include departamentos ---
    const includeDepartamentos = (Array.isArray(departamentos) && departamentos.length > 0) ? [{
      model: DepartamentoMembros,
      required: true,
      attributes: [],
      where: { DepartamentoId: { [Op.in]: departamentos } }
    }] : [];

    // --- Include cargos ---
    const includeCargos = (Array.isArray(cargos) && cargos.length > 0) ? [{
      model: CargoMembro,
      required: true,
      attributes: [],
      where: { CargoId: { [Op.in]: cargos } }
    }] : [];

    // --- Include Diversos para filtrar trabalha ---
    const includeDiversos = [{
      model: Diversos,
      required: trabalha.length > 0,
      attributes: ['trabalha'],
      where: trabalha.length > 0 ? { trabalha: { [Op.in]: trabalha.map(t => (t === 'true' || t === true ? 1 : 0)) } } : undefined
    }];

    // --- Include DadosCristaos para filtrar categoria ministerial ---
    const includeDadosCristaos = [{
      model: DadosCristaos,
      required: categoriaMinisterial.length > 0,
      attributes: ['categoria_ministerial'],
      where: categoriaMinisterial.length > 0 ? { categoria_ministerial: { [Op.in]: categoriaMinisterial } } : undefined
    }];

    // --- Buscar membros ---
    const membros = await Membro.findAll({
      where,
      order: [['nome', 'ASC']],
      attributes: [
        'id', 'nome', 'genero', 'data_nascimento', 'estado_civil',
        'profissao', 'grau_academico', 'batizado', 'foto'
      ],
      include: [
        ...includeDepartamentos,
        ...includeCargos,
        ...includeDiversos,
        ...includeDadosCristaos
      ]
    });

    // --- Ajustar URL da foto ---
    const membrosComFoto = membros.map(m => ({
      ...m.toJSON(),
      foto: m.foto ? `${req.protocol}://${req.get('host')}${m.foto}` : null
    }));

    res.status(200).json({ membros: membrosComFoto });

  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório de membros', error: error.message });
  }
});


















// Rota otimizada para listar filtros de membros com hierarquia do usuário logado
router.get('/lista/filtros-membros', auth, async (req, res) => {
  try {
    const { SedeId, FilhalId } = req.usuario;

    // Condição de filtro pela hierarquia
    const hierarquiaWhere = {
      ...(SedeId ? { SedeId } : {}),
      ...(FilhalId ? { FilhalId } : {})
    };

    // ---- Função utilitária para contar valores distintos ----
    const contarPorCampo = async (campo) => {
      const resultados = await Membro.findAll({
        attributes: [
          campo,
          [Sequelize.fn('COUNT', Sequelize.col(campo)), 'total']
        ],
        where: hierarquiaWhere,
        group: [campo],
        raw: true
      });

      return resultados.map(r => ({
        valor: r[campo],
        total: Number(r.total)
      }));
    };

    // ---- Executar todos os filtros básicos em paralelo ----
    const [
      generos,
      estadosCivis,
      profissoes,
      grausAcademicos,
      batizadosRaw,
      membrosComData
    ] = await Promise.all([
      contarPorCampo('genero'),
      contarPorCampo('estado_civil'),
      contarPorCampo('profissao'),
      contarPorCampo('grau_academico'),
      contarPorCampo('batizado'),
      Membro.findAll({ attributes: ['data_nascimento'], where: hierarquiaWhere, raw: true })
    ]);

    const batizados = batizadosRaw.map(b => ({
      valor: b.valor === 1,
      total: b.total
    }));

    // ---- Cálculo de idades ----
    const hoje = new Date();
    const idadeMap = {};
    membrosComData.forEach(m => {
      if (m.data_nascimento) {
        const dataNasc = new Date(m.data_nascimento);
        let idade = hoje.getFullYear() - dataNasc.getFullYear();
        const mDiff = hoje.getMonth() - dataNasc.getMonth();
        if (mDiff < 0 || (mDiff === 0 && hoje.getDate() < dataNasc.getDate())) idade--;
        idadeMap[idade] = (idadeMap[idade] || 0) + 1;
      }
    });

    const idades = Object.keys(idadeMap).map(idade => ({
      valor: Number(idade),
      total: idadeMap[idade]
    }));

    // ---- Departamentos filtrando por hierarquia Sede/Filhal ----
    const departamentos = await Departamentos.findAll({
      attributes: [
        'id',
        'nome',
        [Sequelize.fn('COUNT', Sequelize.col('DepartamentoMembros.id')), 'total']
      ],
      where: hierarquiaWhere,
      include: [{
        model: DepartamentoMembros,
        attributes: [],
        required: false,
        include: [{
          model: Membro,
          attributes: [],
          required: true,
          where: hierarquiaWhere
        }]
      }],
      group: ['Departamento.id', 'Departamento.nome'],
      raw: true
    });

    const departamentosFiltro = departamentos.map(d => ({
      valor: String(d.id),
      nome: d.nome,
      total: Number(d.total)
    }));

    // ---- Cargos filtrando por hierarquia Sede/Filhal ----
    const cargos = await Cargo.findAll({
      attributes: [
        'id',
        'nome',
        [Sequelize.fn('COUNT', Sequelize.col('CargoMembros.id')), 'total']
      ],
      where: hierarquiaWhere,
      include: [{
        model: CargoMembro,
        attributes: [],
        required: true,
        include: [{
          model: Membro,
          attributes: [],
          required: true,
          where: hierarquiaWhere
        }]
      }],
      group: ['Cargo.id', 'Cargo.nome'],
      raw: true
    });

    const cargosFiltro = cargos.map(c => ({
      valor: String(c.id),
      nome: c.nome,
      total: Number(c.total)
    }));

    // ---- Trabalha (Sim/Não) usando tabela Diversos ----
    const trabalhaRaw = await Diversos.findAll({
      attributes: [
        'trabalha',
        [Sequelize.fn('COUNT', Sequelize.col('trabalha')), 'total']
      ],
      include: [{
        model: Membro,
        attributes: [],
        required: true,
        where: hierarquiaWhere
      }],
      group: ['trabalha'],
      raw: true
    });

    const trabalhaFiltro = trabalhaRaw.map(t => ({
      valor: t.trabalha === 1,
      nome: t.trabalha === 1 ? 'Sim' : 'Não',
      total: Number(t.total)
    }));

    // ---- Categoria Ministerial (tabela DadosCristaos) ----
    const categoriasRaw = await DadosCristaos.findAll({
      attributes: [
        'categoria_ministerial',
        [Sequelize.fn('COUNT', Sequelize.col('categoria_ministerial')), 'total']
      ],
      include: [{
        model: Membro,
        attributes: [],
        required: true,
        where: hierarquiaWhere
      }],
      group: ['categoria_ministerial'],
      raw: true
    });

    const categoriaMinisterialFiltro = categoriasRaw.map(c => ({
      valor: c.categoria_ministerial,
      nome: c.categoria_ministerial,
      total: Number(c.total)
    }));

    // ---- Resposta final ----
    res.status(200).json({
      generos,
      estadosCivis,
      profissoes,
      grausAcademicos,
      batizados,
      idades,
      departamentos: departamentosFiltro,
      cargos: cargosFiltro,
      trabalha: trabalhaFiltro,
      categoriaMinisterial: categoriaMinisterialFiltro // ✅ novo dropdown
    });

  } catch (error) {
    console.error('Erro ao carregar filtros:', error);
    res.status(500).json({ message: 'Erro ao carregar filtros', error: error.message });
  }
});






module.exports = router;
