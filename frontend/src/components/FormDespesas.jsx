// src/components/FormDespesa.jsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  InputAdornment,
  Typography
} from '@mui/material';
import api from '../api/axiosConfig';

export default function FormDespesa({ despesa = null, onSuccess, onCancel }) {
  const [descricao, setDescricao] = useState(despesa?.descricao || '');
  const [valor, setValor] = useState(despesa?.valor || '');
  const [data, setData] = useState(despesa?.data || '');
  const [categoria, setCategoria] = useState(despesa?.categoria || '');
  const [tipo, setTipo] = useState(despesa?.tipo || '');
  const [observacao, setObservacao] = useState(despesa?.observacao || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      descricao,
      valor,
      data,
      tipo,
      categoria: categoria || null,
      observacao: observacao || null,
    };

    try {
      if (despesa) {
        await api.put(`/despesas/${despesa.id}`, payload);
      } else {
        await api.post('/cadastro/despesas', payload);
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 1,
        maxWidth: 400,
        mx: 'auto',
        color: '#e6eef8', // texto principal claro
        '& .MuiInputLabel-root': { color: 'rgba(230,238,248,0.7)' }, // labels claros
        '& .MuiOutlinedInput-root': {
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(6px)',
          color: '#e6eef8',
        },
        '& .MuiInputBase-input': { color: '#e6eef8' },
        '& .MuiSelect-icon': { color: '#e6eef8' },
        '& .MuiMenuItem-root': { color: '#e6eef8' },
      }}
    >
      <Typography variant="h6" gutterBottom align="center" sx={{ color: '#e6eef8' }}>
        {despesa ? 'Editar Despesa' : 'Nova Despesa'}
      </Typography>

      <TextField
        label="Descrição"
        fullWidth
        required
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        sx={{ mb: 1.5 }}
      />

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
        sx={{ mb: 1.5 }}
      />

      <TextField
        label="Data"
        fullWidth
        required
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 1.5 }}
      />

      <TextField
        label="Tipo"
        fullWidth
        required
        select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        sx={{ mb: 1.5 }}
      >
        <MenuItem value="Fixa">Fixa</MenuItem>
        <MenuItem value="Variável">Variável</MenuItem>
      </TextField>

      <TextField
        label="Categoria (opcional)"
        fullWidth
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        sx={{ mb: 1.5 }}
      />

      <TextField
        label="Observação (opcional)"
        fullWidth
        multiline
        rows={2}
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} size="small" sx={{ color: '#e6eef8' }}>Cancelar</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          size="small"
          sx={{
            background: 'linear-gradient(90deg,#7c4dff,#00e5ff)',
            color: '#fff',
            '&:hover': {
              transform: 'translateY(-2px) scale(1.02)',
              boxShadow: '0 10px 30px rgba(124,77,255,0.25)',
            },
          }}
        >
          {despesa ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </Box>
    </Box>
  );
}
