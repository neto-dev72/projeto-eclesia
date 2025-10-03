// src/pages/Relatorios/RelatorioPorMembro.jsx
import React, { useEffect, useState } from 'react';
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
import { Summarize, FilterAlt, PictureAsPdf } from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import api from '../../api/axiosConfig';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function RelatorioPorMembro() {
  const [membros, setMembros] = useState([]);
  const [membroId, setMembroId] = useState('');
  const [periodo, setPeriodo] = useState('mes');
  const [loading, setLoading] = useState(false);

  const [total, setTotal] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [resumoTipo, setResumoTipo] = useState([]);
  const [contribuicoes, setContribuicoes] = useState([]);

  // Carregar lista de membros
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/membros');
        setMembros(res.data);
      } catch (err) {
        console.error('Erro ao carregar membros', err);
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
    if (!membroId) return;
    setLoading(true);
    try {
      const { start, end } = calcularPeriodo(periodo);
      const res = await api.get('/relatorios/membro', {
        params: { membroId, startDate: start, endDate: end },
      });
      setTotal(res.data.totalContribuido || 0);
      setQuantidade(res.data.quantidade || 0);
      setResumoTipo(res.data.resumoPorTipo || []);
      setContribuicoes(res.data.contribuicoes || []);
    } catch (err) {
      console.error('Erro ao buscar relatório', err);
    } finally {
      setLoading(false);
    }
  };

  // Exportar PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório por Membro', 14, 18);
    doc.setFontSize(12);
    doc.text(`Total Contribuído: Kz ${total.toFixed(2)}`, 14, 28);
    doc.text(`Quantidade de Contribuições: ${quantidade}`, 14, 36);

    // Tabela por tipo
    if (resumoTipo.length) {
      autoTable(doc, {
        head: [['Tipo de Contribuição', 'Total (Kz)', 'Qtd']],
        body: resumoTipo.map(r => [
          r.TipoContribuicao?.nome || '-',
          parseFloat(r.totalTipo).toFixed(2),
          r.quantidadeTipo
        ]),
        startY: 46,
        styles: { fontSize: 10 },
      });
    }

    // Detalhes individuais
    if (contribuicoes.length) {
      autoTable(doc, {
        head: [['Data', 'Tipo', 'Valor (Kz)', 'Descrição']],
        body: contribuicoes.map(c => [
          dayjs(c.data).format('DD/MM/YYYY'),
          c.TipoContribuicao?.nome || '-',
          parseFloat(c.valor).toFixed(2),
          c.descricao || '-'
        ]),
        startY: doc.lastAutoTable.finalY + 10,
        styles: { fontSize: 10 },
      });
    }

    doc.save('relatorio-membro.pdf');
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
        <Card elevation={8} sx={{ borderRadius: 4, overflow: 'hidden' }}>
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
              Relatório por Membro
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
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Membro</InputLabel>
                <Select
                  value={membroId}
                  onChange={(e) => setMembroId(e.target.value)}
                >
                  {membros.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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
            ) : membroId && (
              <>
                <Typography
                  variant="h6"
                  mb={2}
                  textAlign="center"
                  fontWeight="bold"
                >
                  Total Contribuído:{' '}
                  <Box component="span" sx={{ color: '#6b78ff' }}>
                    Kz {total.toFixed(2)}
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  mb={4}
                  textAlign="center"
                  fontWeight="bold"
                >
                  Quantidade de Contribuições:{' '}
                  <Box component="span" sx={{ color: '#9c27b0' }}>
                    {quantidade}
                  </Box>
                </Typography>

                {/* Resumo por tipo */}
                {resumoTipo.length > 0 && (
                  <TableContainer
                    component={Paper}
                    sx={{ borderRadius: 3, mb: 4 }}
                  >
                    <Table>
                      <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                          <TableCell>Tipo de Contribuição</TableCell>
                          <TableCell align="right">Total (Kz)</TableCell>
                          <TableCell align="right">Quantidade</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {resumoTipo.map((r, i) => (
                          <TableRow key={i} hover>
                            <TableCell>{r.TipoContribuicao?.nome || '-'}</TableCell>
                            <TableCell align="right">
                              {parseFloat(r.totalTipo).toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              {r.quantidadeTipo}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* Tabela de contribuições detalhada */}
                {contribuicoes.length > 0 && (
                  <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                    <Table>
                      <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                          <TableCell>Data</TableCell>
                          <TableCell>Tipo</TableCell>
                          <TableCell align="right">Valor (Kz)</TableCell>
                          <TableCell>Descrição</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contribuicoes.map((c) => (
                          <TableRow key={c.id} hover>
                            <TableCell>{dayjs(c.data).format('DD/MM/YYYY')}</TableCell>
                            <TableCell>{c.TipoContribuicao?.nome || '-'}</TableCell>
                            <TableCell align="right">
                              {parseFloat(c.valor).toFixed(2)}
                            </TableCell>
                            <TableCell>{c.descricao || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
