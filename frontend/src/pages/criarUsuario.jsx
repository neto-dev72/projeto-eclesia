import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import api from '../api/axiosConfig';

const funcoes = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'pastor', label: 'Pastor' },
  { value: 'tesoureiro', label: 'Tesoureiro' },
  { value: 'secretario', label: 'Secretário' },
  { value: 'membro', label: 'Membro' }
];

export default function CriarUsuarios() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    funcao: 'membro',
    ativo: true, // ativo por padrão
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!formData.nome || !formData.email || !formData.senha) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Aqui você pode adaptar a rota conforme seu backend
      await api.post('/usuarios', formData);

      setSuccess('Usuário criado com sucesso!');
      setFormData({ nome: '', email: '', senha: '', funcao: 'membro', ativo: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 6,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        color="primary"
      >
        Cadastrar Usuário
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Senha"
          name="senha"
          type="password"
          value={formData.senha}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          select
          label="Função"
          name="funcao"
          value={formData.funcao}
          onChange={handleChange}
          margin="normal"
        >
          {funcoes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={
            <Switch
              checked={formData.ativo}
              onChange={handleChange}
              name="ativo"
              color="primary"
            />
          }
          label={formData.ativo ? 'Ativo' : 'Inativo'}
          sx={{ mt: 2 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </Box>
    </Container>
  );
}
