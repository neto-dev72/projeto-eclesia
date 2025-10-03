// src/pages/dashboard/DashboardCentro.jsx
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Groups,
  AccountBalance,
  Opacity,
  MonetizationOn,
  PersonAdd,
  TrendingUp,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import api from "../../api/axiosConfig";

// Fontes Google (Poppins)
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";

export default function DashboardCentro() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumoCentro = async () => {
      try {
        const res = await api.get("/resumo-centro");
        setDados(res.data);
      } catch (err) {
        console.error("Erro ao buscar resumo do centro:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumoCentro();
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
        Não foi possível carregar os dados do centro.
      </Typography>
    );
  }

  // === Prepara dados do gráfico de crescimento ===
  const crescimentoData = (dados.crescimentoCentro || []).map((item) => ({
    mes: `${item.mes}/${item.ano}`,
    novos: Number(item.novos),
  }));

  // === Cards principais ===
  const cardBgColor = "#4a90e2"; // azul uniforme
  const cards = [
    {
      titulo: "Total Membros (Centro)",
      valor: dados.totalMembrosCentro,
      icone: <Groups fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Total Membros (Congregações)",
      valor: dados.totalMembrosCongregacao,
      icone: <Groups fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Batizados (Centro)",
      valor: `${dados.batizadosCentro} (${dados.percBatizadosCentro}%)`,
      icone: <Opacity fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Batizados (Congregações)",
      valor: `${dados.batizadosCongregacao} (${dados.percBatizadosCongregacao}%)`,
      icone: <Opacity fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Ofertas Mês (Centro)",
      valor: `Kz ${Number(dados.ofertasMesCentro || 0).toLocaleString("pt-PT", {
        minimumFractionDigits: 2,
      })}`,
      icone: <MonetizationOn fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Total Contribuições (Centro)",
      valor: `Kz ${Number(dados.totalContribuicoesCentro || 0).toLocaleString(
        "pt-PT",
        { minimumFractionDigits: 2 }
      )}`,
      icone: <MonetizationOn fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Ofertas Mês (Congregações)",
      valor: `Kz ${Number(dados.ofertasMesCongregacao || 0).toLocaleString(
        "pt-PT",
        { minimumFractionDigits: 2 }
      )}`,
      icone: <MonetizationOn fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Total Contribuições (Congregações)",
      valor: `Kz ${Number(
        dados.totalContribuicoesCongregacao || 0
      ).toLocaleString("pt-PT", { minimumFractionDigits: 2 })}`,
      icone: <MonetizationOn fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Membros aguardando batismo (Centro)",
      valor: dados.aguardandoBatismoCentro,
      icone: <PersonAdd fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Membros aguardando batismo (Congregações)",
      valor: dados.aguardandoBatismoCongregacao,
      icone: <PersonAdd fontSize="large" sx={{ color: "#fff" }} />,
    },
  ];

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
        Painel do Centro - Visão Geral
      </Typography>

      {/* === Cards === */}
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
                <Typography
                  variant="subtitle1"
                  sx={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {c.titulo}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* === Gráfico de crescimento === */}
      <Box sx={{ mt: 6 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            bgcolor: "rgba(255,255,255,0.1)",
          }}
        >
          <Typography variant="h6" fontWeight="700" gutterBottom>
            Crescimento de Membros (últimos 6 meses)
          </Typography>
          {crescimentoData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={crescimentoData}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="mes" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="novos"
                  stroke="#4caf50"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography>Nenhum dado de crescimento disponível.</Typography>
          )}
        </Card>
      </Box>

      {/* === Congregações abaixo da média === */}
      <Box sx={{ mt: 6 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            bgcolor: "rgba(255,255,255,0.1)",
          }}
        >
          <Typography variant="h6" fontWeight="700" gutterBottom>
            Congregações Abaixo da Média de Contribuições
          </Typography>
          <Divider sx={{ mb: 2, bgcolor: "#fff" }} />
          {dados.congregacoesAbaixoMedia?.length ? (
            <List dense>
              {dados.congregacoesAbaixoMedia.map((c) => (
                <ListItem key={c.id}>
                  <ListItemText
                    primary={<Typography fontWeight="700">{c.nome}</Typography>}
                    secondary={`Total Contribuições: Kz ${Number(
                      c.total || 0
                    ).toLocaleString("pt-PT", { minimumFractionDigits: 2 })}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">
              Nenhuma congregação abaixo da média.
            </Typography>
          )}
        </Card>
      </Box>
    </Box>
  );
}
