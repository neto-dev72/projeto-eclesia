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


const { Op } = require('sequelize');




const auth = require("../middlewere/auth");


// GET /lista/despesas - listar despesas filtradas pelo usuário logado
router.get('/lista/despesas', auth, async (req, res) => {
  try {
    const { SedeId, FilhalId } = req.usuario;

    // Define o filtro inicial com base na hierarquia
    let filtro = {};
    if (FilhalId) {
      filtro.FilhalId = FilhalId;
    } else if (SedeId) {
      filtro.SedeId = SedeId;
    }

    // Buscar despesas filtradas
    const despesas = await Despesas.findAll({
      where: filtro,
      order: [['createdAt', 'DESC']], // mais recentes primeiro
    });

    res.status(200).json(despesas);
  } catch (error) {
    console.error('Erro ao listar despesas:', error);
    res.status(500).json({ message: 'Erro ao buscar despesas' });
  }
});



// POST /despesas - cadastrar nova despesa com dados do usuário logado
router.post('/despesas', auth, async (req, res) => {
  try {
    const { descricao, valor, data, categoria, tipo, observacao } = req.body;

    // Validação básica
    if (!descricao || !valor || !data || !tipo) {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }

    // Pega os dados do usuário logado
    const { SedeId, FilhalId } = req.usuario;

    // Criação do registro
    const novaDespesa = await Despesas.create({
      descricao,
      valor,
      data,
      categoria: categoria || null,
      tipo,
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





// GET /lista/tipos-despesa - listar tipos de despesa com totais filtrados pelo usuário logado
router.get('/lista/tipos-despesa', auth, async (req, res) => {
  try {
    const { SedeId, FilhalId } = req.usuario;

    // Buscar todos os tipos de despesa
    const tipos = await Despesas.findAll({
      attributes: ['id', 'descricao', 'tipo', 'createdAt'], // ajustar campos conforme tabela de tipos
      group: ['id', 'descricao', 'tipo', 'createdAt'], // garantir que não haja duplicidade
    });

    // Calcular totais para cada tipo considerando o contexto hierárquico
    const tiposComTotais = await Promise.all(
      tipos.map(async (tipo) => {
        const despesas = await Despesas.findAll({
          where: {
            TipoDespesaId: tipo.id,
            ...(SedeId && { SedeId }),
            ...(!SedeId && FilhalId && { FilhalId })
          },
          attributes: ['valor'],
        });

        const valores = despesas.map(d => parseFloat(d.valor));
        const valorTotal = valores.reduce((acc, v) => acc + v, 0);
        const valorMedio = valores.length ? valorTotal / valores.length : 0;
        const maiorDespesa = valores.length ? Math.max(...valores) : 0;

        return {
          ...tipo.toJSON(),
          totalDespesas: despesas.length,
          valorTotal,
          valorMedio,
          maiorDespesa
        };
      })
    );

    res.status(200).json(tiposComTotais);
  } catch (error) {
    console.error('Erro ao listar tipos de despesa:', error);
    res.status(500).json({ message: 'Erro ao buscar tipos de despesa' });
  }
});






// GET /relatorio/despesas - relatório de despesas filtrado pelo usuário logado
router.get('/relatorio/despesas', auth, async (req, res) => {
  try {
    const { startDate, endDate, tipo } = req.query;
    const { SedeId, FilhalId } = req.usuario;

    console.log('📅 Filtros recebidos:', { startDate, endDate, tipo });
    console.log('🏢 Usuário logado:', { SedeId, FilhalId });

    let where = {};

    // 📆 Corrige o filtro de datas
    if (startDate && endDate) {
      const inicio = new Date(`${startDate}T00:00:00`);
      const fim = new Date(`${endDate}T23:59:59`);
      where.data = { [Op.between]: [inicio, fim] };
      console.log('🗓️ Intervalo de datas aplicado:', where.data);
    }

    // 🧾 Filtro de tipo
    if (tipo) {
      where.tipo = tipo;
    }

    // 🏛️ Filtro hierárquico
    if (FilhalId) {
      where.FilhalId = FilhalId;
    } else if (SedeId) {
      where.SedeId = SedeId;
    }

    console.log('🔎 Filtro final aplicado:', JSON.stringify(where, null, 2));

    const despesas = await Despesas.findAll({
      where,
      order: [['data', 'DESC'], ['createdAt', 'DESC']],
    });

    console.log(`✅ ${despesas.length} despesas encontradas.`);
    return res.status(200).json(despesas);
  } catch (error) {
    console.error('❌ Erro ao gerar relatório de despesas:', error);
    return res.status(500).json({ message: 'Erro ao gerar relatório de despesas.' });
  }
});










// PUT /despesas/:id
router.put('/despesas/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, data, categoria, tipo, observacao } = req.body;

  try {
    const despesa = await Despesas.findByPk(id);

    if (!despesa) {
      return res.status(404).json({ message: 'Despesa não encontrada.' });
    }

    await despesa.update({
      descricao,
      valor,
      data,
      categoria,
      tipo,
      observacao,
    });

    res.status(200).json({ message: 'Despesa atualizada com sucesso.', despesa });
  } catch (error) {
    console.error('Erro ao atualizar despesa:', error);
    res.status(500).json({ message: 'Erro ao atualizar despesa.' });
  }
});



// DELETE /despesas/:id
router.delete('/despesas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const despesa = await Despesas.findByPk(id);

    if (!despesa) {
      return res.status(404).json({ message: 'Despesa não encontrada.' });
    }

    await despesa.destroy();
    res.status(200).json({ message: 'Despesa excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir despesa:', error);
    res.status(500).json({ message: 'Erro ao excluir despesa.' });
  }
});





// GET /despesas/totais - totais de despesas filtrados pelo usuário logado
router.get('/despesas/totais', auth, async (req, res) => {
  try {
    const { SedeId, FilhalId } = req.usuario;

    // Filtro hierárquico
    let filtro = {};
    if (SedeId) {
      filtro.SedeId = SedeId;
    } else if (FilhalId) {
      filtro.FilhalId = FilhalId;
    }

    // Total geral
    const totalGeral = await Despesas.sum('valor', { where: filtro }) || 0;

    // Total por tipo
    const totalPorTipo = await Despesas.findAll({
      attributes: [
        'tipo',
        [Despesas.sequelize.fn('SUM', Despesas.sequelize.col('valor')), 'total']
      ],
      where: filtro,
      group: ['tipo'],
      raw: true
    });

    // Total por categoria
    const totalPorCategoria = await Despesas.findAll({
      attributes: [
        'categoria',
        [Despesas.sequelize.fn('SUM', Despesas.sequelize.col('valor')), 'total']
      ],
      where: filtro,
      group: ['categoria'],
      raw: true
    });

    res.status(200).json({
      totalGeral,
      totalPorTipo,
      totalPorCategoria,
    });
  } catch (error) {
    console.error('Erro ao calcular totais de despesas:', error);
    res.status(500).json({ message: 'Erro ao calcular totais.' });
  }
});




module.exports = router;
