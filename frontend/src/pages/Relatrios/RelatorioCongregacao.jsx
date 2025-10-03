// src/pages/dashboard/DashboardCongregacao.jsx
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Avatar,
} from "@mui/material";
import { Groups, Opacity, MonetizationOn, PersonAdd } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api/axiosConfig";

// Importando fonte premium do Google
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";

export default function DashboardCongregacao() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumoCongregacao = async () => {
      try {
        const res = await api.get("/resumo-congregacao");
        setDados(res.data);
      } catch (err) {
        console.error("Erro ao buscar resumo da congregação:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumoCongregacao();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress size={60} thickness={5} />
      </Box>
    );
  }

  if (!dados) {
    return (
      <Typography color="error" align="center" mt={4}>
        Não foi possível carregar os dados da congregação.
      </Typography>
    );
  }

  // === Cards principais ===
  const cardBgColor = "#4a90e2"; // azul uniforme
  const cards = [
    {
      titulo: "Total de Membros",
      valor: dados.totalMembros,
      icone: <Groups fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Batizados",
      valor: `${dados.batizados} (${dados.percBatizados}%)`,
      icone: <Opacity fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Ofertas / Dízimos (Mês)",
      valor: `Kz ${Number(dados.ofertasMes).toLocaleString("pt-PT", { minimumFractionDigits: 2 })}`,
      icone: <MonetizationOn fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Total Contribuições",
      valor: `Kz ${Number(dados.totalContribuicoes).toLocaleString("pt-PT", { minimumFractionDigits: 2 })}`,
      icone: <MonetizationOn fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Membros aguardando batismo",
      valor: dados.aguardandoBatismo,
      icone: <PersonAdd fontSize="large" sx={{ color: "#fff" }} />,
    },
  ];

  // Formata os dados de crescimento para o gráfico
  const crescimentoData = dados.crescimento?.map((c) => ({
    mes: `${c.mes}/${c.ano}`,
    novos: c.novos,
  })) || [];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: "linear-gradient(to bottom, #1e3c72, #2a5298)",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        fontWeight="700"
        sx={{ mb: 4, textAlign: "center", letterSpacing: 1 }}
      >
        Painel da Congregação - {dados.congregacao.nome}
      </Typography>

      {/* Cards principais */}
      <Grid container spacing={3}>
        {cards.map((c, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card
              sx={{
                borderRadius: 5,
                boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
                backgroundColor: cardBgColor,
                color: "#fff",
                minHeight: 220,
                transition: "transform 0.4s, box-shadow 0.4s",
                "&:hover": {
                  transform: "translateY(-12px)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "transparent",
                  width: 70,
                  height: 70,
                  mb: 2,
                }}
              >
                {c.icone}
              </Avatar>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  variant="h5"
                  fontWeight="700"
                  sx={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {c.valor}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  {c.titulo}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráfico de crescimento */}
      <Box sx={{ mt: 6 }}>
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
          <Typography variant="h6" fontWeight="700" gutterBottom>
            Crescimento nos últimos 6 meses
          </Typography>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={crescimentoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#a0c4ff" />
              <XAxis dataKey="mes" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: "#1e3c72", border: "none", color: "#fff" }} />
              <Line
                type="monotone"
                dataKey="novos"
                stroke="#ffdd57"
                activeDot={{ r: 8 }}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Box>
    </Box>
  );
}
