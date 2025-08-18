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

const Op = require("sequelize");





function calcularPeriodo(periodo) {
  const hoje = new Date();
  let inicio, fim;

  switch (periodo) {
    case 'dia':
      inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
      fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
      break;

    case 'semana':
      const diaSemana = hoje.getDay(); // 0=domingo
      inicio = new Date(hoje);
      inicio.setDate(hoje.getDate() - diaSemana); // domingo
      fim = new Date(inicio);
      fim.setDate(inicio.getDate() + 6); // sábado
      break;

    case 'mes':
      inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      break;

    case 'trimestre':
      const mes = hoje.getMonth();
      const trimestreInicio = mes - (mes % 3);
      inicio = new Date(hoje.getFullYear(), trimestreInicio, 1);
      fim = new Date(hoje.getFullYear(), trimestreInicio + 3, 0);
      break;

    case 'semestre':
      const semestreInicio = hoje.getMonth() < 6 ? 0 : 6;
      inicio = new Date(hoje.getFullYear(), semestreInicio, 1);
      fim = new Date(hoje.getFullYear(), semestreInicio + 6, 0);
      break;

    case 'ano':
      inicio = new Date(hoje.getFullYear(), 0, 1);
      fim = new Date(hoje.getFullYear(), 11, 31);
      break;

    default: // tudo
      inicio = new Date(0);
      fim = new Date(9999, 11, 31);
      break;
  }

  // formatar como YYYY-MM-DD para DATE no MySQL
  const formatarData = (d) => d.toISOString().split('T')[0];

  return { inicio: formatarData(inicio), fim: formatarData(fim) };
}

// Rota
router.get('/relatorios/contribuicoes', async (req, res) => {
  try {
    const { periodo = 'mes', tipo, membro } = req.query;
    const { inicio, fim } = calcularPeriodo(periodo);

    const where = {
      data: { [Op.between]: [inicio, fim] }, // funciona com DATE
    };

    if (tipo) where.TipoContribuicaoId = tipo;
    if (membro) where.MembroId = membro;

    const contribuicoes = await Contribuicao.findAll({
      where,
      include: [
        { model: Membros, attributes: ['id', 'nome'] },
        { model: TipoContribuicao, attributes: ['id', 'nome'] },
      ],
      order: [['data', 'ASC']],
    });

    const totalArrecadado = contribuicoes.reduce((sum, c) => sum + parseFloat(c.valor), 0);

    const detalhes = contribuicoes.map(c => ({
      id: c.id,
      data: c.data,
      descricao: c.descricao,
      valor: parseFloat(c.valor),
      Membro: c.Membro,
      TipoContribuicao: c.TipoContribuicao,
    }));

    res.json({ totalArrecadado, detalhes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});


module.exports = router;
