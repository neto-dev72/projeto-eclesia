import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import api from '../api/axiosConfig';

export default function CadastrarCargo() {
  const [formData, setFormData] = useState({ nome: '', descricao: '' });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMensagem({ tipo: '', texto: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome) {
      setMensagem({ tipo: 'error', texto: 'O nome do cargo é obrigatório.' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/cadastrar-cargos', formData);
      setMensagem({ tipo: 'success', texto: res.data.message || 'Cargo cadastrado com sucesso!' });
      setFormData({ nome: '', descricao: '' });
    } catch (error) {
      setMensagem({
        tipo: 'error',
        texto: error.response?.data?.message || 'Erro ao cadastrar o cargo.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, p: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
        Cadastrar Novo Cargo
      </Typography>

      {mensagem.texto && (
        <Alert severity={mensagem.tipo} sx={{ mb: 2 }}>
          {mensagem.texto}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nome do Cargo"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Descrição (opcional)"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          multiline
          rows={4}
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Salvando...' : 'Cadastrar Cargo'}
        </Button>
      </Box>
    </Container>
  );
}
