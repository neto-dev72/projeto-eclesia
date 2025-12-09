import React, { useEffect, useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  Button,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import api from '../api/axiosConfig';

export default function PerfilMembro() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/perfil/do/membro');
      setData(res.data);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError(err.response?.data?.message || 'Erro ao carregar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await carregarPerfil();
    setRefreshing(false);
  };

  const gerarDadosMeses = () => {
    const meses = Array.from({ length: 12 }, (_, i) => ({ mes: i + 1, total: 0 }));
    if (data?.contribuicoes?.length) {
      data.contribuicoes.forEach((c) => {
        const m = new Date(c.data).getMonth();
        meses[m].total += Number(c.valor || 0);
      });
    }
    const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    return meses.map(m => ({ name: labels[m.mes - 1], total: m.total }));
  };

  const exportCsv = () => {
    if (!data?.contribuicoes) return;
    const header = ['Data', 'Tipo', 'Valor'];
    const rows = data.contribuicoes.map(c => [
      new Date(c.data).toLocaleDateString(),
      c.TipoContribuicao?.nome || '—',
      c.valor
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contribuicoes_${data.perfil?.id || 'perfil'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f7fa' }}>
      <CircularProgress color="primary" />
    </Box>
  );

  if (error) return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3, bgcolor: '#f5f7fa', borderRadius: 3 }}>
      <Alert severity="error">{error}</Alert>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={carregarPerfil}>Tentar novamente</Button>
    </Box>
  );

  const mesesDados = gerarDadosMeses();
  const mesesLabels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, bgcolor: '#f5f7fa' }}>
      {/* Alertas */}
      {data?.alertas?.length > 0 && (
        <Stack spacing={1} sx={{ mb: 3 }}>
          {data.alertas.map((a, idx) => (
            <Alert key={idx} severity="warning" sx={{ bgcolor: '#fff8e1', color: '#ff6f00' }}>{a}</Alert>
          ))}
        </Stack>
      )}

      {/* Card Perfil */}
      <Paper sx={{
        p: 4,
        mb: 5,
        bgcolor: 'linear-gradient(to right, #ffffff, #e1f5fe)',
        borderRadius: 16,
        boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
        <Avatar src={data?.perfil?.foto || ''} sx={{
          width: 120,
          height: 120,
          border: '4px solid #81d4fa',
          boxShadow: '0 6px 24px rgba(0,0,0,0.2)'
        }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e1e2f' }}>{data.perfil.nome}</Typography>
          <Typography variant="body1" sx={{ mt: 1, color: '#333' }}>Telefone: {data.perfil.telefone || '—'}</Typography>
          <Typography variant="body1" sx={{ color: '#333' }}>Gênero: {data.perfil.genero || '—'}</Typography>
          <Typography variant="body1" sx={{ color: '#333' }}>Estado civil: {data.perfil.estado_civil || '—'}</Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" sx={{
              background: 'linear-gradient(135deg, #81d4fa 0%, #0288d1 100%)',
              color: '#fff',
              fontWeight: 600,
              '&:hover': { background: 'linear-gradient(135deg, #4fc3f7 0%, #0277bd 100%)', boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }
            }} onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <Button variant="outlined" sx={{
              border: '2px solid #0288d1',
              color: '#0288d1',
              fontWeight: 600,
              '&:hover': { background: '#e1f5fe' }
            }} onClick={exportCsv}>Exportar CSV</Button>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Coluna esquerda */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, mb: 4, bgcolor: '#ffffff', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#0288d1', fontWeight: 600 }}>Desempenho (Ano)</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>Total no ano: <strong>{Number(data.desempenho.totalAno || 0).toLocaleString()}</strong></Typography>
            <Typography>Total de contribuições: <strong>{data.desempenho.totalContribuicoes || 0}</strong></Typography>
            <Typography>Maior contribuição: <strong>{Number(data.desempenho.maiorContribuicao || 0).toLocaleString()}</strong></Typography>
            <Typography>Média mensal (até agora): <strong>{Number(data.desempenho.mediaMensal || 0).toLocaleString()}</strong></Typography>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ color: '#0288d1', fontWeight: 600 }}>Indicadores</Typography>
            <Typography>Tipo mais frequente: <strong>{data.indicadores.tipoMaisFrequente || '—'}</strong></Typography>
            <Typography>Mês mais generoso: <strong>{data.indicadores.mesMaisGeneroso || '—'}</strong></Typography>
            <Typography>Contribuições no ano: <strong>{data.indicadores.quantidadeAno || 0}</strong></Typography>
          </Paper>

          <Paper sx={{ p: 3, bgcolor: '#ffffff', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#0288d1', fontWeight: 600 }}>Meses sem contribuição</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.mesesNaoContribuiu?.length ? data.mesesNaoContribuiu.map(m => (
                <Chip key={m} label={mesesLabels[m-1]} sx={{
                  background: 'linear-gradient(135deg, #81d4fa 0%, #0288d1 100%)',
                  color: '#fff',
                  fontWeight: 600
                }} />
              )) : <Typography>Nenhum mês sem contribuição</Typography>}
            </Box>
          </Paper>
        </Grid>

        {/* Coluna direita */}
        <Grid item xs={12} md={7}>
          {/* Card exclusivo para gráfico */}
          <Paper sx={{ p: 3, mb: 4, bgcolor: '#ffffff', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#0288d1', fontWeight: 600 }}>Gráfico Mensal</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ width: '100%', height: 320 }}>
              <BarChart width={600} height={320} data={mesesDados} margin={{ top: 10, right: 0, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0f2f1" />
                <XAxis dataKey="name" tick={{ fill: '#0288d1', fontWeight: 600 }} />
                <YAxis tick={{ fill: '#0288d1', fontWeight: 600 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }} />
                <Bar dataKey="total" fill="url(#grad1)" radius={[6,6,0,0]} />
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#81d4fa" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#0288d1" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </Box>
          </Paper>

          {/* Contribuições Detalhadas */}
          <Paper sx={{ p: 3, bgcolor: '#ffffff', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#0288d1', fontWeight: 600 }}>Contribuições Detalhadas</Typography>
            <TableContainer component={Paper} sx={{ mt: 1, bgcolor: '#f1f8fe', borderRadius: 12 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#0288d1', fontWeight: 600 }}>Data</TableCell>
                    <TableCell sx={{ color: '#0288d1', fontWeight: 600 }}>Tipo</TableCell>
                    <TableCell align="right" sx={{ color: '#0288d1', fontWeight: 600 }}>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.contribuicoes?.length ? data.contribuicoes.map(c => (
                    <TableRow key={c.id} sx={{ '&:hover': { backgroundColor: '#e1f5fe' } }}>
                      <TableCell>{new Date(c.data).toLocaleDateString()}</TableCell>
                      <TableCell>{c.TipoContribuicao?.nome || '—'}</TableCell>
                      <TableCell align="right">{Number(c.valor || 0).toLocaleString()}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3}>Nenhuma contribuição registrada.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
