// src/pages/Relatorios/RelatorioContribuicoes.jsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { FilterAlt, Summarize, PictureAsPdf } from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import api from '../../api/axiosConfig';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Import correto
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function RelatorioContribuicoes() {
  const [periodo, setPeriodo] = useState('mes');
  const [tipos, setTipos] = useState([]);
  const [membros, setMembros] = useState([]);
  const [tipoId, setTipoId] = useState('');
  const [membroId, setMembroId] = useState('');
  const [loading, setLoading] = useState(false);
  const [contribuicoes, setContribuicoes] = useState([]);
  const [total, setTotal] = useState(0);

  // --- Carregar filtros
  useEffect(() => {
    (async () => {
      try {
        const [resTipos, resMembros] = await Promise.all([
          api.get('/lista/tipos-contribuicao'),
          api.get('/membros'),
        ]);
        setTipos(resTipos.data);
        setMembros(resMembros.data);
      } catch (err) {
        console.error('Erro ao carregar filtros', err);
      }
    })();
  }, []);

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
      const res = await api.get('/lista/contribuicoes', {
        params: {
          startDate: start,
          endDate: end,
          tipoId,
          membroId: membroId || undefined,
        },
      });
      setContribuicoes(res.data);
      const soma = res.data.reduce((acc, c) => acc + parseFloat(c.valor), 0);
      setTotal(soma);
    } catch (err) {
      console.error('Erro ao buscar relatório', err);
    } finally {
      setLoading(false);
    }
  };

  // 📊 Dados para o gráfico de pizza
  const dadosPizza = useMemo(() => {
    const mapa = {};
    contribuicoes.forEach((c) => {
      const tipo = c.TipoContribuicao?.nome || 'Outros';
      mapa[tipo] = (mapa[tipo] || 0) + parseFloat(c.valor);
    });
    return Object.entries(mapa).map(([name, value]) => ({ name, value }));
  }, [contribuicoes]);

  const cores = ['#6b78ff', '#9c27b0', '#ff9800', '#4caf50', '#f44336', '#2196f3'];

  // ---- Exportar PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório de Contribuições', 14, 18);
    doc.setFontSize(12);
    doc.text(`Total: Kz ${total.toFixed(2)}`, 14, 28);

    const rows = contribuicoes.map((c) => [
      dayjs(c.data).format('DD/MM/YYYY'),
      c.Membro?.nome || '-',
      c.TipoContribuicao?.nome || '-',
      parseFloat(c.valor).toFixed(2),
      c.descricao || '-',
    ]);

    autoTable(doc, { // ✅ Uso correto
      head: [['Data', 'Membro', 'Tipo', 'Valor (Kz)', 'Descrição']],
      body: rows,
      startY: 36,
      styles: { fontSize: 10 },
    });

    doc.save('relatorio-contribuicoes.pdf');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: 2, md: 6 },
        background: 'linear-gradient(135deg,#6b78ff 0%, #9c27b0 100%)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', maxWidth: 1100 }}
      >
        <Card elevation={8} sx={{ borderRadius: 4, overflow: 'hidden', backdropFilter: 'blur(6px)' }}>
          <Box
            sx={{
              p: 4,
              background: 'linear-gradient(90deg, rgba(33,150,243,1) 0%, rgba(156,39,176,1) 100%)',
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              color="white"
              textAlign="center"
            >
              <Summarize sx={{ fontSize: 40, mr: 1, verticalAlign: 'middle' }} />
              Relatório de Contribuições
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
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Período</InputLabel>
                <Select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                  <MenuItem value="hoje">Hoje</MenuItem>
                  <MenuItem value="semana">Semana</MenuItem>
                  <MenuItem value="mes">Mês</MenuItem>
                  <MenuItem value="trimestre">Trimestre</MenuItem>
                  <MenuItem value="semestre">Semestre</MenuItem>
                  <MenuItem value="ano">Ano</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Tipo de Contribuição</InputLabel>
                <Select value={tipoId} onChange={(e) => setTipoId(e.target.value)}>
                  {tipos.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Membro (opcional)</InputLabel>
                <Select value={membroId} onChange={(e) => setMembroId(e.target.value)}>
                  <MenuItem value="">Todos</MenuItem>
                  {membros.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<FilterAlt />}
                onClick={buscarRelatorio}
                sx={{
                  background: 'linear-gradient(90deg,#6b78ff,#9c27b0)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1.2,
                  borderRadius: 3,
                  '&:hover': {
                    background: 'linear-gradient(90deg,#5a68e5,#8e24aa)',
                  },
                }}
              >
                Gerar Relatório
              </Button>

              {/* Botão Exportar PDF */}
              <Button
                variant="outlined"
                startIcon={<PictureAsPdf />}
                onClick={exportarPDF}
                disabled={!contribuicoes.length}
                sx={{
                  borderColor: '#6b78ff',
                  color: '#6b78ff',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1.2,
                  borderRadius: 3,
                  '&:hover': {
                    background: 'rgba(107,120,255,0.1)',
                    borderColor: '#5a68e5',
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
                <Typography
                  variant="h6"
                  mb={2}
                  sx={{ textAlign: 'center', fontWeight: 'bold' }}
                >
                  Total arrecadado:{' '}
                  <Box component="span" sx={{ color: '#6b78ff' }}>
                    Kz {total.toFixed(2)}
                  </Box>
                </Typography>

                {/* Tabela */}
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    mb: 4,
                  }}
                >
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell>Data</TableCell>
                        <TableCell>Membro</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell align="right">Valor (Kz)</TableCell>
                        <TableCell>Descrição</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {contribuicoes.map((c) => (
                        <TableRow
                          key={c.id}
                          hover
                          sx={{
                            '&:nth-of-type(even)': { backgroundColor: '#fafafa' },
                          }}
                        >
                          <TableCell>{dayjs(c.data).format('DD/MM/YYYY')}</TableCell>
                          <TableCell>{c.Membro?.nome || '-'}</TableCell>
                          <TableCell>{c.TipoContribuicao?.nome}</TableCell>
                          <TableCell align="right">
                            {parseFloat(c.valor).toFixed(2)}
                          </TableCell>
                          <TableCell>{c.descricao || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Gráfico de Pizza */}
                {dadosPizza.length > 0 && (
                  <Box sx={{ height: 350 }}>
                    <Typography
                      variant="h6"
                      textAlign="center"
                      mb={2}
                      fontWeight="bold"
                    >
                      Distribuição por Tipo de Contribuição
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosPizza}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          label
                        >
                          {dadosPizza.map((_, i) => (
                            <Cell key={i} fill={cores[i % cores.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
