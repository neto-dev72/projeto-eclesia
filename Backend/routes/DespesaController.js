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


// Rota para cadastrar nova despesa
router.post('/despesas', async (req, res) => {
  try {
    const { descricao, valor, data, categoria, tipo, observacao } = req.body;

    if (!descricao || !valor || !data || !tipo) {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }

    const novaDespesa = await Despesas.create({
      descricao,
      valor,
      data,
      categoria: categoria || null,
      tipo,
      observacao: observacao || null,
    });

    res.status(201).json(novaDespesa);
  } catch (error) {
    console.error('Erro ao cadastrar despesa:', error);
    res.status(500).json({ message: 'Erro interno ao cadastrar despesa.' });
  }
});



router.get('/lista/tipos-despesa', async (req, res) => {
  try {
    const tipos = await Despesas.findAll({
      attributes: ['id', 'nome', 'ativo', 'createdAt'],
    });

    const tiposComTotais = await Promise.all(
      tipos.map(async (tipo) => {
        const despesas = await Despesas.findAll({
          where: { TipoDespesaId: tipo.id },
          attributes: ['valor'],
        });

        const valores = despesas.map(d => parseFloat(d.valor));
        const receitaTotal = valores.reduce((acc, v) => acc + v, 0);
        const receitaMedia = valores.length ? receitaTotal / valores.length : 0;
        const maiorDespesa = Math.max(...valores, 0);

        return {
          ...tipo.toJSON(),
          totalDespesas: despesas.length,
          valorTotal: receitaTotal,
          valorMedio: receitaMedia,
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

// GET /despesas
router.get('/despesas', async (req, res) => {
  try {
    const despesas = await Despesas.findAll({
      order: [['data', 'DESC'], ['createdAt', 'DESC']],
    });

    res.status(200).json(despesas);
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    res.status(500).json({ message: 'Erro ao buscar despesas.' });
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


// GET /despesas/totais
router.get('/despesas/totais', async (req, res) => {
  try {
    const { Op } = require('sequelize');

    const totalGeral = await Despesas.sum('valor');

    const totalPorTipo = await Despesas.findAll({
      attributes: ['tipo', [Despesas.sequelize.fn('SUM', Despesas.sequelize.col('valor')), 'total']],
      group: ['tipo'],
    });

    const totalPorCategoria = await Despesas.findAll({
      attributes: ['categoria', [Despesas.sequelize.fn('SUM', Despesas.sequelize.col('valor')), 'total']],
      group: ['categoria'],
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
