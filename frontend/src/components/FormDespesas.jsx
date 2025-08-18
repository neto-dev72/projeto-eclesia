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
        await api.post('/despesas', payload);
      }

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {despesa ? 'Editar Despesa' : 'Nova Despesa'}
      </Typography>

      <TextField
        label="Descrição"
        fullWidth
        required
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        sx={{ mb: 2 }}
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
        label="Tipo"
        fullWidth
        required
        select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="Fixa">Fixa</MenuItem>
        <MenuItem value="Variável">Variável</MenuItem>
      </TextField>

      <TextField
        label="Categoria (opcional)"
        fullWidth
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Observação (opcional)"
        fullWidth
        multiline
        rows={3}
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {despesa ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </Box>
    </Box>
  );
}
