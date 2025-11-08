// src/pages/Relatorios/RelatorioFinanceiroGeral.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
} from '@mui/material';
import { FilterAlt, PictureAsPdf, MonetizationOn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import api from '../../api/axiosConfig';

export default function RelatorioFinanceiroGeral() {
  const [periodo, setPeriodo] = useState('mes');
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState({
    totalArrecadado: 0,
    totalGasto: 0,
    saldo: 0,
  });

  const calcularPeriodo = (p) => {
    const agora = dayjs();
    let inicio;
    switch (p) {
      case 'hoje': inicio = agora.startOf('day'); break;
      case 'semana': inicio = agora.startOf('week'); break;
      case 'mes': inicio = agora.startOf('month'); break;
      case 'trimestre': inicio = agora.subtract(3, 'month').startOf('day'); break;
      case 'semestre': inicio = agora.subtract(6, 'month').startOf('day'); break;
      case 'ano': inicio = agora.startOf('year'); break;
      default: inicio = agora.startOf('month');
    }
    return { start: inicio.format('YYYY-MM-DD'), end: agora.format('YYYY-MM-DD') };
  };

  const buscarRelatorio = async () => {
    setLoading(true);
    try {
      const { start, end } = calcularPeriodo(periodo);
      const res = await api.get('/financeiro', {
        params: { startDate: start, endDate: end },
      });

      setDados({
        totalArrecadado: res.data.totalArrecadado || 0,
        totalGasto: res.data.totalGasto || 0,
        saldo: res.data.saldo || 0,
      });
    } catch (err) {
      console.error('Erro ao buscar relatório financeiro', err);
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório Financeiro Geral', 14, 18);
    doc.setFontSize(12);
    doc.text(`Período: ${periodo.toUpperCase()}`, 14, 28);
    doc.text(`Total Arrecadado: Kz ${dados.totalArrecadado.toFixed(2)}`, 14, 38);
    doc.text(`Total Gasto: Kz ${dados.totalGasto.toFixed(2)}`, 14, 46);
    doc.text(`Saldo: Kz ${dados.saldo.toFixed(2)}`, 14, 54);

    autoTable(doc, {
      head: [['Resumo', 'Valor (Kz)']],
      body: [
        ['Total Arrecadado', dados.totalArrecadado.toFixed(2)],
        ['Total Gasto', dados.totalGasto.toFixed(2)],
        ['Saldo', dados.saldo.toFixed(2)],
      ],
      startY: 64,
    });

    doc.save('relatorio-financeiro.pdf');
  };

  // prepara dados do gráfico
  const dadosGrafico = [
    {
      nome: 'Totais Financeiros',
      Contribuição: dados.totalArrecadado,
      Despesas: dados.totalGasto,
      Saldo: dados.saldo,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: 2, md: 6 },
        background: 'linear-gradient(135deg,#4facfe 0%, #00f2fe 100%)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', maxWidth: 1000 }}
      >
        <Card
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Box
            sx={{
              p: 4,
              background: 'linear-gradient(90deg,#2196f3 0%, #00bcd4 100%)',
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              color="white"
              textAlign="center"
            >
              <MonetizationOn
                sx={{ fontSize: 40, mr: 1, verticalAlign: 'middle' }}
              />
              Relatório Financeiro Geral
            </Typography>
          </Box>

          <CardContent>
            {/* Filtros */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mb: 4,
                justifyContent: 'center',
              }}
            >
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Período</InputLabel>
                <Select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                >
                  <MenuItem value="hoje">Hoje</MenuItem>
                  <MenuItem value="semana">Semana</MenuItem>
                  <MenuItem value="mes">Mês</MenuItem>
                  <MenuItem value="trimestre">Trimestre</MenuItem>
                  <MenuItem value="semestre">Semestre</MenuItem>
                  <MenuItem value="ano">Ano</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<FilterAlt />}
                onClick={buscarRelatorio}
                sx={{
                  background: 'linear-gradient(90deg,#2196f3,#00bcd4)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1.2,
                  borderRadius: 3,
                  '&:hover': {
                    background: 'linear-gradient(90deg,#1976d2,#0097a7)',
                  },
                }}
              >
                Gerar Relatório
              </Button>

              <Button
                variant="outlined"
                startIcon={<PictureAsPdf />}
                onClick={exportarPDF}
                disabled={loading || (dados.totalArrecadado === 0 && dados.totalGasto === 0)}
                sx={{
                  borderColor: '#2196f3',
                  color: '#2196f3',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1.2,
                  borderRadius: 3,
                  '&:hover': {
                    background: 'rgba(33,150,243,0.1)',
                    borderColor: '#1976d2',
                  },
                }}
              >
                Exportar PDF
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* Cards de resumo */}
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#4caf50', color: 'white', p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">
                        Contribuição Total
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        Kz {dados.totalArrecadado.toFixed(2)}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#f44336', color: 'white', p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">
                        Despesas Totais
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        Kz {dados.totalGasto.toFixed(2)}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#2196f3', color: 'white', p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">
                        Saldo Atual
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        Kz {dados.saldo.toFixed(2)}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                {/* Gráfico de barras */}
                <Box sx={{ mt: 6, width: '100%', height: 400 }}>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    fontWeight="bold"
                    mb={2}
                  >
                    Comparativo Financeiro — Contribuição, Despesa e Saldo
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosGrafico}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nome" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Contribuição" fill="#4caf50" name="Contribuição Total" />
                      <Bar dataKey="Despesas" fill="#f44336" name="Despesas Totais" />
                      <Bar dataKey="Saldo" fill="#2196f3" name="Saldo Atual" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
