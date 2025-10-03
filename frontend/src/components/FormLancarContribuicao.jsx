import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  MenuItem,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import dayjs from 'dayjs';
import api from '../api/axiosConfig';

export default function FormLansarContribuicao({ tipo, onSuccess, onCancel }) {
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');
  const [membroId, setMembroId] = useState('');
  const [tipoId, setTipoId] = useState(tipo?.id || '');
  const [cultoId, setCultoId] = useState('');
  const [loading, setLoading] = useState(false);

  const [membros, setMembros] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [cultos, setCultos] = useState([]);
  const [loadingMembros, setLoadingMembros] = useState(true);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [loadingCultos, setLoadingCultos] = useState(true);

  // Buscar membros
  useEffect(() => {
    async function fetchMembros() {
      try {
        const res = await api.get('/membros');
        setMembros(res.data);
      } catch (error) {
        console.error('Erro ao buscar membros:', error);
      } finally {
        setLoadingMembros(false);
      }
    }
    fetchMembros();
  }, []);

  // Buscar tipos de contribuição
  useEffect(() => {
    async function fetchTipos() {
      try {
        const res = await api.get('/tipos-contribuicao');
        setTipos(res.data);
      } catch (error) {
        console.error('Erro ao buscar tipos de contribuição:', error);
      } finally {
        setLoadingTipos(false);
      }
    }
    fetchTipos();
  }, []);

  // Buscar cultos ativos
  useEffect(() => {
    async function fetchCultos() {
      try {
        const res = await api.get('/buscar-cultos');
        setCultos(res.data);
      } catch (error) {
        console.error('Erro ao buscar cultos:', error);
      } finally {
        setLoadingCultos(false);
      }
    }
    fetchCultos();
  }, []);

  // Atualizar tipo caso venha via props
  useEffect(() => {
    if (tipo?.id) {
      setTipoId(tipo.id);
    }
  }, [tipo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/contribuicoes', {
        valor,
        data,
        descricao,
        MembroId: membroId || null,
        TipoContribuicaoId: tipoId,
        CultoId: cultoId || null, // envia o culto selecionado ou null
      });

      onSuccess();
    } catch (error) {
      console.error('Erro ao lançar contribuição:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingMembros || loadingTipos || loadingCultos) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Valor"
        fullWidth
        required
        type="number"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start">Kz</InputAdornment>,
        }}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Data"
        fullWidth
        required
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Descrição (opcional)"
        fullWidth
        multiline
        rows={3}
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Membro"
        fullWidth
        select
        value={membroId}
        onChange={(e) => setMembroId(e.target.value)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="">
          <em>Selecione um membro</em>
        </MenuItem>
        {membros.map((m) => (
          <MenuItem key={m.id} value={m.id}>
            {m.nome}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Tipo de Contribuição"
        fullWidth
        required
        select
        value={tipoId}
        onChange={(e) => setTipoId(e.target.value)}
        sx={{ mb: 2 }}
        disabled={!!(tipo && tipo.id)}
      >
        {!tipo && <MenuItem value=""><em>Selecione o tipo</em></MenuItem>}
        {tipo ? (
          <MenuItem value={tipo.id}>{tipo.nome}</MenuItem>
        ) : (
          tipos.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.nome}
            </MenuItem>
          ))
        )}
      </TextField>

      {/* Select para Cultos (não obrigatório) */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Culto</InputLabel>
        <Select
          value={cultoId}
          onChange={(e) => setCultoId(e.target.value)}
        >
          <MenuItem value="">
            <em>Nenhum culto selecionado</em>
          </MenuItem>
          {cultos.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.TipoCulto?.nome} - {dayjs(c.dataHora).format('DD/MM/YYYY HH:mm')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          Lançar Contribuição
        </Button>
      </Box>
    </Box>
  );
}
