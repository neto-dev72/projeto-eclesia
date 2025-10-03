// src/pages/dashboard/DashboardResumo.jsx
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Groups,
  LocationCity,
  AccountBalance,
  Opacity,
  MonetizationOn,
  TrendingUp,
  PersonAdd,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../api/axiosConfig";
import TabelaCentros from "../../components/TabelaCentros";

// Importando fonte premium do Google
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";

export default function DashboardResumo() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumo = async () => {
      try {
        const res = await api.get("/resumo");
        setDados(res.data);
      } catch (err) {
        console.error("Erro ao buscar resumo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumo();
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
        Não foi possível carregar o resumo.
      </Typography>
    );
  }

  // === Cards principais - ícones premium e uniforme azul ===
  const cardBgColor = "#4a90e2"; // azul uniforme
  const cards = [
    {
      titulo: "Total de Membros",
      valor: dados.totalMembros,
      subtitulo: `+${dados.membrosEsteMes} este mês`,
      icone: <Groups fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Centros Ativos",
      valor: dados.totalCentros,
      icone: <LocationCity fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Congregações Ativas",
      valor: dados.totalCongregacoes,
      icone: <AccountBalance fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Batizados",
      valor: `${dados.batizados} (${dados.percBatizados}%)`,
      icone: <Opacity fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Ofertas / Dízimos (Mês)",
      valor: `Kz ${Number(dados.ofertasMes).toLocaleString("pt-PT", { minimumFractionDigits: 2 })}`,
      subtitulo: `Mês anterior: Kz ${Number(dados.ofertasMesAnterior).toLocaleString("pt-PT", { minimumFractionDigits: 2 })}`,
      icone: <MonetizationOn fontSize="large" sx={{ color: "#fff" }} />,
    },
    {
      titulo: "Total Contribuições",
      valor: `Kz ${Number(dados.totalContribuicoes).toLocaleString("pt-PT", { minimumFractionDigits: 2 })}`,
      icone: <MonetizationOn fontSize="large" sx={{ color: "#fff" }} />,
    },
  ];

  // === Gráfico de linha ===
  const crescimentoData = dados.crescimento?.map((c) => ({
    mes: `${c.mes}/${c.ano}`,
    novos: c.novos,
  })) || [];

  // === Gráfico de pizza ===
  const COLORS = ["#ffdd57", "#ff7f50", "#00bfff", "#7b68ee"];
  const pieData = dados.contribPorTipo?.map((t) => ({
    name: t.tipo,
    value: Number(t.total),
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
        Painel da Sede - Visão Geral de Todos os Centros e Congregações
      </Typography>

      {/* Cards de indicadores */}
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
                {c.subtitulo && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1,
                      fontWeight: 600,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {c.subtitulo}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cartões de centros e batismo acima dos gráficos */}
      <Grid container spacing={4} sx={{ mt: 6 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              Centros com Contribuições Abaixo da Média
            </Typography>
            <Divider sx={{ mb: 2, bgcolor: "#fff" }} />
            {dados.centrosAbaixoMedia?.length ? (
              <List dense>
                {dados.centrosAbaixoMedia.map((c) => (
                  <ListItem key={c.id}>
                    <ListItemText
                      primary={<Typography fontWeight="700">{c.nome}</Typography>}
                      secondary={`Total: Kz ${Number(c.total).toLocaleString("pt-PT", { minimumFractionDigits: 2 })}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">Nenhum centro abaixo da média.</Typography>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              textAlign: "center",
              background: "#2980b9",
              color: "#fff",
            }}
          >
            <PersonAdd sx={{ fontSize: 55, mb: 2 }} />
            <Typography variant="h6" fontWeight="700">
              Membros aguardando batismo
            </Typography>
            <Typography variant="h4" fontWeight="700" sx={{ mt: 1 }}>
              {dados.aguardandoBatismo}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Crescimento e pizza centralizados */}
      <Grid container spacing={4} sx={{ mt: 4, justifyContent: "center" }}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              Tendência de Crescimento
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={crescimentoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#a0c4ff" />
                <XAxis dataKey="mes" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e3c72", border: "none", color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="novos"
                  stroke="#ffdd57"
                  activeDot={{ r: 8 }}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
            <Chip
              icon={<TrendingUp sx={{ color: "#1e3c72" }} />}
              label={`Crescimento vs. ano anterior: ${dados.percCrescimentoAnoAnterior}%`}
              sx={{ mt: 2, fontWeight: "bold", backgroundColor: "#fff", color: "#1e3c72" }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              Distribuição de Contribuições
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={{ fill: "#fff", fontWeight: "700" }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ color: "#fff", fontFamily: "'Poppins', sans-serif" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela de Centros */}
      <Box sx={{ mt: 8 }}>
        <TabelaCentros />
      </Box>
    </Box>
  );
}
