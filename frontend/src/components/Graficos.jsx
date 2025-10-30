import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Box, Typography, Button, ButtonGroup } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { People, Timeline, History } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Graficos() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [secao, setSecao] = useState("membros");

  useEffect(() => {
    const fetchGraficos = async () => {
      try {
        const res = await api.get("/graficos");
        setDados(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados para gráficos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraficos();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Box className="spinner-border text-primary" role="status" />
      </Box>
    );

  if (!dados)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h5" color="error">
          Não foi possível carregar os gráficos.
        </Typography>
      </Box>
    );

  // ---------- DATASETS ----------
  const membrosData = {
    labels: ["Ativos", "Inativos"],
    datasets: [
      {
        label: "Membros",
        data: [dados.membrosAtivosInativos.ativos, dados.membrosAtivosInativos.inativos],
        backgroundColor: ["#42a5f5", "#9e9e9e"],
        borderWidth: 2
      }
    ]
  };

  const generoData = {
    labels: ["Homens", "Mulheres"],
    datasets: [
      {
        label: "Gênero",
        data: [dados.distribuicaoGenero.homens, dados.distribuicaoGenero.mulheres],
        backgroundColor: ["#1976d2", "#ec407a"],
        borderWidth: 2
      }
    ]
  };

  const faixasData = {
    labels: Object.keys(dados.faixasEtarias),
    datasets: [
      {
        label: "Faixa Etária",
        data: Object.values(dados.faixasEtarias),
        backgroundColor: ["#5c6bc0", "#26a69a", "#ffee58", "#ef5350"],
        borderWidth: 2
      }
    ]
  };

  const batismoData = {
    labels: ["Batizados", "Não Batizados"],
    datasets: [
      {
        label: "Batismo",
        data: [dados.situacaoBatismo.batizados, dados.situacaoBatismo.naoBatizados],
        backgroundColor: ["#29b6f6", "#bdbdbd"],
        borderWidth: 2
      }
    ]
  };

  const financeiroData = {
    labels: ["Contribuições", "Despesas"],
    datasets: [
      {
        label: "Financeiro",
        data: [dados.financeiro.contribMes, dados.financeiro.despMes],
        backgroundColor: ["#43a047", "#ef5350"],
        borderWidth: 2
      }
    ]
  };

  const presencasFuturasData = {
    labels: dados.cultos.futuros.map(p => `${p.tipoCulto} (${new Date(p.data).toLocaleDateString()})`),
    datasets: [
      {
        label: "Presenças por Culto",
        data: dados.cultos.futuros.map(p => p.totalPresenca),
        backgroundColor: "#1e88e5"
      }
    ]
  };

  const contribFuturasData = {
    labels: dados.cultos.futuros.map(c => `${c.tipoCulto} (${new Date(c.data).toLocaleDateString()})`),
    datasets: [
      {
        label: "Contribuições por Culto (Kz)",
        data: dados.cultos.futuros.map(c => c.totalContribuicao),
        backgroundColor: "#ffb300"
      }
    ]
  };

  const presencasPassadasData = {
    labels: dados.cultos.passados.map(p => `${p.tipoCulto} (${new Date(p.data).toLocaleDateString()})`),
    datasets: [
      {
        label: "Presenças por Culto",
        data: dados.cultos.passados.map(p => p.totalPresenca),
        backgroundColor: "#26a69a"
      }
    ]
  };

  const contribPassadasData = {
    labels: dados.cultos.passados.map(c => `${c.tipoCulto} (${new Date(c.data).toLocaleDateString()})`),
    datasets: [
      {
        label: "Contribuições por Culto (Kz)",
        data: dados.cultos.passados.map(c => c.totalContribuicao),
        backgroundColor: "#8e24aa"
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: { labels: { color: "#333", font: { size: 14, weight: 600 } } },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.85)",
        titleColor: "#fff",
        bodyColor: "#fff"
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  const secoes = {
    membros: [
      { title: "Atividade dos Membros", chart: <Doughnut data={membrosData} options={chartOptions} /> },
      { title: "Distribuição de Gênero", chart: <Doughnut data={generoData} options={chartOptions} /> },
      { title: "Faixas Etárias", chart: <Bar data={faixasData} options={chartOptions} /> },
      { title: "Situação de Batismo", chart: <Doughnut data={batismoData} options={chartOptions} /> }
    ],
    atuais: [
      { title: "Financeiro: Contribuições vs Despesas", chart: <Bar data={financeiroData} options={chartOptions} /> },
      { title: "Presenças por Culto", chart: <Bar data={presencasFuturasData} options={chartOptions} /> },
      { title: "Contribuições por Culto", chart: <Bar data={contribFuturasData} options={chartOptions} /> }
    ],
    historico: [
      { title: "Presenças por Culto", chart: <Bar data={presencasPassadasData} options={chartOptions} /> },
      { title: "Contribuições por Culto", chart: <Bar data={contribPassadasData} options={chartOptions} /> }
    ]
  };

  return (
    <Box
      sx={{
        py: 6,
        px: { xs: 2, md: 10 },
        background: "linear-gradient(135deg, #e3f2fd, #fafafa)",
        minHeight: "100vh"
      }}
    >
      {/* Título */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 800,
            mb: 5,
            fontFamily: "'Poppins', sans-serif",
            borderBottom: "3px solid #1976d2",
            pb: 1,
            color: "#0d47a1",
            textShadow: "0 2px 10px rgba(0,0,0,0.15)"
          }}
        >
          📊 Painel de Análise Geral
        </Typography>
      </motion.div>

      {/* Botões Premium */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
        <ButtonGroup sx={{ borderRadius: 5, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
          <Button
            startIcon={<People />}
            variant={secao === "membros" ? "contained" : "outlined"}
            onClick={() => setSecao("membros")}
            sx={{
              px: 3,
              py: 1.2,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              background: secao === "membros" ? "linear-gradient(90deg, #1976d2, #42a5f5)" : "transparent",
              color: secao === "membros" ? "#fff" : "#1976d2",
              "&:hover": { background: "linear-gradient(90deg, #1565c0, #42a5f5)", color: "#fff" }
            }}
          >
            Visão dos Membros
          </Button>

          <Button
            startIcon={<Timeline />}
            variant={secao === "atuais" ? "contained" : "outlined"}
            onClick={() => setSecao("atuais")}
            sx={{
              px: 3,
              py: 1.2,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              background: secao === "atuais" ? "linear-gradient(90deg, #009688, #4db6ac)" : "transparent",
              color: secao === "atuais" ? "#fff" : "#009688",
              "&:hover": { background: "linear-gradient(90deg, #00796b, #4db6ac)", color: "#fff" }
            }}
          >
            Indicadores Atuais
          </Button>

          <Button
            startIcon={<History />}
            variant={secao === "historico" ? "contained" : "outlined"}
            onClick={() => setSecao("historico")}
            sx={{
              px: 3,
              py: 1.2,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              background: secao === "historico" ? "linear-gradient(90deg, #8e24aa, #ba68c8)" : "transparent",
              color: secao === "historico" ? "#fff" : "#8e24aa",
              "&:hover": { background: "linear-gradient(90deg, #6a1b9a, #ba68c8)", color: "#fff" }
            }}
          >
            Histórico de Cultos Passados
          </Button>
        </ButtonGroup>
      </Box>

      {/* Gráficos */}
      <AnimatePresence mode="wait">
        <motion.div
          key={secao}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <Box className="row g-4">
            {secoes[secao].map((g, idx) => (
              <motion.div key={idx} className="col-md-6" whileHover={{ scale: 1.03 }}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    backdropFilter: "blur(10px)",
                    background: "rgba(255,255,255,0.75)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                    height: 400,
                    transition: "all 0.3s ease"
                  }}
                >
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      fontFamily: "'Poppins', sans-serif",
                      color: "#0d47a1"
                    }}
                  >
                    {g.title}
                  </Typography>
                  <Box sx={{ height: "calc(100% - 60px)" }}>{g.chart}</Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
