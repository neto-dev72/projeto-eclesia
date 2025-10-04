// src/pages/RelatorioPresencasPremium.jsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem,
  Button, CircularProgress, Divider, Table, TableBody, TableCell, TableHead, TableRow,
  Avatar, Chip, Stack
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import api from '../../api/axiosConfig';
import { Person, MonetizationOn, CalendarToday, Group, PictureAsPdf } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function RelatorioPresencasPremium() {
  const [tiposCulto, setTiposCulto] = useState([]);
  const [selectedTipoCulto, setSelectedTipoCulto] = useState('');
  const [nomeTipoCulto, setNomeTipoCulto] = useState('');
  const [periodo, setPeriodo] = useState('mes');
  const [loading, setLoading] = useState(false);
  const [totais, setTotais] = useState({
    totalPresentes: 0,
    homens: 0,
    mulheres: 0,
    adultos: 0,
    criancas: 0
  });
  const [dataCulto, setDataCulto] = useState('');
  const [contribuicoes, setContribuicoes] = useState([]);
  const [totaisContribuicoes, setTotaisContribuicoes] = useState({});
  const [totalGeralContribuicoes, setTotalGeralContribuicoes] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/lista/tipos-culto');
        setTiposCulto(res.data);
      } catch (err) {
        console.error('Erro ao carregar tipos de culto', err);
      }
    })();
  }, []);

  const calcularPeriodo = (p) => {
    const agora = dayjs();
    let start;
    switch (p) {
      case 'hoje': start = agora.startOf('day'); break;
      case 'semana': start = agora.startOf('week'); break;
      case 'mes': start = agora.startOf('month'); break;
      case 'trimestre': start = agora.subtract(3, 'month').startOf('month'); break;
      case 'semestre': start = agora.subtract(6, 'month').startOf('month'); break;
      case 'ano': start = agora.startOf('year'); break;
      default: start = agora.startOf('month');
    }
    return { start: start.format('YYYY-MM-DD'), end: agora.format('YYYY-MM-DD') };
  };

  const gerarRelatorio = async () => {
    if (!selectedTipoCulto) return;
    setLoading(true);
    try {
      const { start, end } = calcularPeriodo(periodo);
      const res = await api.get('/lista/presencas', {
        params: { tipoCultoId: selectedTipoCulto, startDate: start, endDate: end }
      });
      setTotais(res.data.totais);
      setDataCulto(res.data.cultos.length ? dayjs(res.data.cultos[0].dataHora).format('DD/MM/YYYY HH:mm') : '');
      setContribuicoes(res.data.contribuicoes || []);
      setTotaisContribuicoes(res.data.totaisContribuicoes || {});
      setTotalGeralContribuicoes(res.data.totalGeralContribuicoes || 0);
      setNomeTipoCulto(res.data.tipoCultoNome || '');
    } catch (err) {
      console.error('Erro ao buscar presenças e contribuições', err);
    } finally {
      setLoading(false);
    }
  };

  const dadosPizza = useMemo(() => [
    { name: 'Homens', value: totais.homens },
    { name: 'Mulheres', value: totais.mulheres },
    { name: 'Crianças', value: totais.criancas }
  ], [totais]);

  const cores = ['#3f51b5', '#ff4081', '#ffa726'];

  const exportarPDF = () => {
    if (!selectedTipoCulto) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório de Presenças e Contribuições', 14, 18);
    if (nomeTipoCulto) doc.setFontSize(12).text(`Tipo de Culto: ${nomeTipoCulto}`, 14, 26);
    if (dataCulto) doc.setFontSize(12).text(`Data do Culto: ${dataCulto}`, 14, 34);

    const totaisArray = [
      ['Total Presentes', totais.totalPresentes],
      ['Homens', totais.homens],
      ['Mulheres', totais.mulheres],
      ['Adultos', totais.adultos],
      ['Crianças', totais.criancas],
    ];

    autoTable(doc, { startY: 38, head: [['Categoria', 'Quantidade']], body: totaisArray, styles: { fontSize: 10 } });

    if (Object.keys(totaisContribuicoes).length) {
      const contribArray = Object.entries(totaisContribuicoes).map(([tipo, valor]) => [tipo, `Kz ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]);
      autoTable(doc, { startY: doc.lastAutoTable.finalY + 10, head: [['Tipo de Contribuição', 'Valor Total']], body: contribArray, styles: { fontSize: 10 } });
      autoTable(doc, { startY: doc.lastAutoTable.finalY + 6, head: [['Total Geral de Contribuições', `Kz ${totalGeralContribuicoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]], body: [], styles: { fontSize: 10, halign: 'right' }, theme: 'plain' });
    }

    if (contribuicoes.length) {
      const rows = contribuicoes.map(c => [
        dayjs(c.data).format('DD/MM/YYYY'),
        c.Membro?.nome || '-',
        c.TipoContribuicao?.nome || '-',
        parseFloat(c.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        c.descricao || '-'
      ]);
      autoTable(doc, { startY: doc.lastAutoTable.finalY + 10, head: [['Data', 'Membro', 'Tipo', 'Valor (Kz)', 'Descrição']], body: rows, styles: { fontSize: 10 } });
    }
    doc.save(`Relatorio_TipoCulto_${selectedTipoCulto || 'SemNome'}.pdf`);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      p: { xs: 2, md: 6 },
      background: 'linear-gradient(to bottom, #1e3c72, #2a5298)',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ width: '100%', maxWidth: 1100 }}>
        <Card elevation={20} sx={{ borderRadius: 5, overflow: 'hidden', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <Box sx={{ p: 4, background: 'linear-gradient(90deg,#0f2027,#203a43,#2c5364)' }}>
            <Typography variant="h4" fontWeight="bold" color="white" textAlign="center" sx={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
              <MonetizationOn sx={{ mr: 1 }} /> Relatório Premium de Presenças & Contribuições
            </Typography>
          </Box>
          <CardContent>
            {/* Filtros */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 220, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <InputLabel sx={{ color: 'white' }}>Tipo de Culto</InputLabel>
                <Select value={selectedTipoCulto} onChange={(e) => setSelectedTipoCulto(e.target.value)} sx={{ color: 'white' }}>
                  <MenuItem value="">-- Selecione --</MenuItem>
                  {tiposCulto.map(c => <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 160, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <InputLabel sx={{ color: 'white' }}>Período</InputLabel>
                <Select value={periodo} onChange={(e) => setPeriodo(e.target.value)} sx={{ color: 'white' }}>
                  <MenuItem value="hoje">Hoje</MenuItem>
                  <MenuItem value="semana">Semana</MenuItem>
                  <MenuItem value="mes">Mês</MenuItem>
                  <MenuItem value="trimestre">Trimestre</MenuItem>
                  <MenuItem value="semestre">Semestre</MenuItem>
                  <MenuItem value="ano">Ano</MenuItem>
                </Select>
              </FormControl>

              <Button variant="contained" onClick={gerarRelatorio} sx={{
                background: 'linear-gradient(90deg,#f7971e,#ffd200)',
                color: 'white',
                fontWeight: 'bold',
                px: 5,
                py: 1.5,
                borderRadius: 3,
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                transition: '0.4s',
                '&:hover': { transform: 'scale(1.05)', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }
              }}>
                Gerar Relatório
              </Button>

              <Button
                variant="outlined"
                startIcon={<PictureAsPdf />}
                onClick={exportarPDF}
                disabled={!selectedTipoCulto || (!contribuicoes.length && Object.keys(totaisContribuicoes).length === 0)}
                sx={{
                  borderColor: '#ffd200',
                  color: '#ffd200',
                  fontWeight: 'bold',
                  px: 4,
                  '&:hover': { background: 'rgba(255,210,0,0.1)', borderColor: '#ffcf33' }
                }}
              >
                Exportar PDF
              </Button>
            </Box>

            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}><CircularProgress size={60} color="secondary" /></Box>}

            {!loading && selectedTipoCulto && (
              <>
                {nomeTipoCulto && (
                  <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4} color="#ffd200" sx={{ textShadow: '2px 2px 6px rgba(0,0,0,0.4)' }}>
                    Tipo de Culto: {nomeTipoCulto}
                  </Typography>
                )}

                {/* Resumo Presenças */}
                <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Box sx={{ mb: 4, p: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 5, boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
                    <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3} color="#fff">
                      <CalendarToday sx={{ mr: 1 }} /> Resumo Estatístico
                    </Typography>
                    {dataCulto && <Typography variant="body1" textAlign="center" mb={3} color="#fff">Data do Culto: {dataCulto}</Typography>}
                    <Divider sx={{ mb: 3, backgroundColor: '#ffd200' }} />
                    <Stack direction="row" spacing={2} justifyContent="space-around" flexWrap="wrap">
                      <Chip icon={<Group />} label={`Total: ${totais.totalPresentes}`} color="primary" variant="filled" sx={{ fontWeight: 'bold', px:2 }}/>
                      <Chip icon={<Person />} label={`Homens: ${totais.homens}`} color="info" variant="filled" sx={{ fontWeight: 'bold', px:2 }}/>
                      <Chip icon={<Person />} label={`Mulheres: ${totais.mulheres}`} color="secondary" variant="filled" sx={{ fontWeight: 'bold', px:2 }}/>
                      <Chip icon={<Person />} label={`Adultos: ${totais.adultos}`} color="success" variant="filled" sx={{ fontWeight: 'bold', px:2 }}/>
                      <Chip icon={<Person />} label={`Crianças: ${totais.criancas}`} color="warning" variant="filled" sx={{ fontWeight: 'bold', px:2 }}/>
                    </Stack>
                  </Box>
                </motion.div>

                {/* Gráfico Pizza */}
                <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Box sx={{ height: 420, background: 'rgba(255,255,255,0.1)', borderRadius: 5, p: 3, boxShadow: '0 16px 40px rgba(0,0,0,0.25)', mb: 4 }}>
                    <Typography variant="h6" textAlign="center" mb={2} fontWeight="bold" color="#fff">
                      Distribuição por Categoria
                    </Typography>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie data={dadosPizza} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={140} label={({ name, percent }) => `${name}: ${(percent*100).toFixed(0)}%`}>
                          {dadosPizza.map((_, i) => <Cell key={i} fill={cores[i % cores.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e1e2f', borderRadius: 8, border: 'none', color:'#fff' }}/>
                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ color: '#fff' }}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </motion.div>

                {/* Contribuições */}
                <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Box sx={{ mb: 4, p: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 5, boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
                    <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3} color="#ffd200">
                      <MonetizationOn sx={{ mr: 1 }} /> Contribuições
                    </Typography>

                    {Object.keys(totaisContribuicoes).length > 0 && (
                      <>
                        <Stack direction="row" spacing={2} justifyContent="space-around" flexWrap="wrap" mb={3}>
                          {Object.entries(totaisContribuicoes).map(([tipo, valor]) => (
                            <Chip key={tipo} label={`${tipo}: Kz ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} color="secondary" variant="filled" sx={{ fontWeight:'bold', px:2, '&:hover': { transform:'scale(1.1)', boxShadow:'0 6px 15px rgba(0,0,0,0.3)' } }} />
                          ))}
                        </Stack>
                        <Typography variant="subtitle1" fontWeight="bold" textAlign="center" mb={3} color="#fff">
                          Total Geral: Kz {totalGeralContribuicoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Typography>
                      </>
                    )}

                    {contribuicoes.length > 0 && (
                      <Table sx={{ borderRadius: 3, overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                        <TableHead sx={{ background: 'linear-gradient(90deg,#1e3c72,#2a5298)' }}>
                          <TableRow>
                            <TableCell sx={{ color: '#ffd200', fontWeight: 'bold' }}>Data</TableCell>
                            <TableCell sx={{ color: '#ffd200', fontWeight: 'bold' }}>Membro</TableCell>
                            <TableCell sx={{ color: '#ffd200', fontWeight: 'bold' }}>Tipo</TableCell>
                            <TableCell sx={{ color: '#ffd200', fontWeight: 'bold' }}>Valor (Kz)</TableCell>
                            <TableCell sx={{ color: '#ffd200', fontWeight: 'bold' }}>Descrição</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {contribuicoes.map((c) => (
                            <TableRow key={c.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', transform: 'scale(1.02)', transition: '0.3s' } }}>
                              <TableCell>{dayjs(c.data).format('DD/MM/YYYY')}</TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Avatar sx={{ bgcolor: '#1e3c72' }}>{c.Membro?.nome?.charAt(0)}</Avatar>
                                  <Typography>{c.Membro?.nome || '-'}</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>{c.TipoContribuicao?.nome || '-'}</TableCell>
                              <TableCell>Kz {parseFloat(c.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                              <TableCell>{c.descricao || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </Box>
                </motion.div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
