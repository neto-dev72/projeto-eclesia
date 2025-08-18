import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Alert,
} from '@mui/material';
import api from '../../api/axiosConfig';

const periodos = [
  { value: 'dia', label: 'Dia' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mês' },
  { value: 'trimestre', label: 'Trimestre' },
  { value: 'semestre', label: 'Semestre' },
  { value: 'ano', label: 'Ano' },
];

export default function RelatorioContribuicoes() {
  const [tipos, setTipos] = useState([]);
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // filtros
  const [periodo, setPeriodo] = useState('mes');
  const [tipoContribuicaoId, setTipoContribuicaoId] = useState('');
  const [membroId, setMembroId] = useState('');

  // resultado do relatório
  const [relatorio, setRelatorio] = useState(null);

  // buscar tipos de contribuição
  useEffect(() => {
    async function fetchTipos() {
      try {
        const res = await api.get('/lista/tipos-contribuicao');
        setTipos(res.data);
      } catch (err) {
        console.error('Erro ao carregar tipos de contribuição', err);
      }
    }
    fetchTipos();
  }, []);

  // buscar membros
  useEffect(() => {
    async function fetchMembros() {
      try {
        const res = await api.get('/membros');
        setMembros(res.data);
      } catch (err) {
        console.error('Erro ao carregar membros', err);
      }
    }
    fetchMembros();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('periodo', periodo);
      if (tipoContribuicaoId) params.append('tipo', tipoContribuicaoId);
      if (membroId) params.append('membro', membroId);

      const res = await api.get(`/relatorios/contribuicoes?${params.toString()}`);

      // Transformar datas em Date válidas
      const dataTransformada = res.data.detalhes?.map(item => {
        const dataObj = new Date(item.data);
        return {
          ...item,
          data: isNaN(dataObj.getTime()) ? null : dataObj // se data inválida, usar null
        };
      });

      setRelatorio({
        totalArrecadado: res.data.totalArrecadado,
        detalhes: dataTransformada || []
      });
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar relatório');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Relatório de Contribuições
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}
      >
        <TextField
          select
          label="Período"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          {periodos.map((p) => (
            <MenuItem key={p.value} value={p.value}>
              {p.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Tipo de contribuição"
          value={tipoContribuicaoId}
          onChange={(e) => setTipoContribuicaoId(e.target.value)}
          sx={{ minWidth: 250 }}
          SelectProps={{ displayEmpty: true }}
          helperText="Opcional"
        >
          <MenuItem value="">Todos</MenuItem>
          {tipos.map((tipo) => (
            <MenuItem key={tipo.id} value={tipo.id}>
              {tipo.nome}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Membro"
          value={membroId}
          onChange={(e) => setMembroId(e.target.value)}
          sx={{ minWidth: 250 }}
          SelectProps={{ displayEmpty: true }}
          helperText="Opcional"
        >
          <MenuItem value="">Todos</MenuItem>
          {membros.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.nome}
            </MenuItem>
          ))}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ alignSelf: 'center' }}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Gerar Relatório'}
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {relatorio && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Total Arrecadado: Kz {relatorio.totalArrecadado?.toFixed(2) ?? '0.00'}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Lista Detalhada:
          </Typography>

          <Box component="ul" sx={{ pl: 3 }}>
            {relatorio.detalhes && relatorio.detalhes.length > 0 ? (
              relatorio.detalhes.map((item) => (
                <li key={item.id}>
                  {item.data ? item.data.toLocaleDateString() : 'Data inválida'} — {item.descricao || 'Sem descrição'} — Kz{' '}
                  {item.valor.toFixed(2)} — Membro: {item.Membro?.nome || 'N/A'}
                </li>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhuma contribuição encontrada para os filtros selecionados.
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
}
