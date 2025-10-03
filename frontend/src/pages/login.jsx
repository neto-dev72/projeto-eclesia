// pages/Login.jsx
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import api from '../api/axiosConfig';

export default function Login() {
  const [formData, setFormData] = useState({ nome: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/login', formData);
      setSuccess(res.data.message || 'Login realizado com sucesso!');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'linear-gradient(135deg, #6b78ff 0%, #2575fc 100%)',
        p: 2,
      }}
    >
      {/* Card de login centralizado */}
      <Container
        maxWidth="sm"
        sx={{
          p: 6,
          borderRadius: 5,
          bgcolor: 'rgba(255,255,255,0.95)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          transition: 'all 0.4s ease',
          '&:hover': { transform: 'translateY(-5px) scale(1.02)' },
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            textShadow: '2px 2px 12px rgba(0,0,0,0.15)',
            letterSpacing: '1px',
          }}
        >
          Entrar no sistema
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 3,
              boxShadow: '0 4px 15px rgba(255,0,0,0.2)',
              fontWeight: 'bold',
            }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              borderRadius: 3,
              boxShadow: '0 4px 15px rgba(0,255,0,0.2)',
              fontWeight: 'bold',
            }}
          >
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }} noValidate>
          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                transition: 'all 0.3s',
                backgroundColor: '#f7f9ff',
              },
              '& .MuiOutlinedInput-root:hover fieldset': {
                borderColor: '#6b78ff',
              },
              '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                borderColor: '#6b78ff',
                boxShadow: '0 0 10px rgba(107,120,255,0.3)',
              },
            }}
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
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                transition: 'all 0.3s',
                backgroundColor: '#f7f9ff',
              },
              '& .MuiOutlinedInput-root:hover fieldset': {
                borderColor: '#2575fc',
              },
              '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                borderColor: '#2575fc',
                boxShadow: '0 0 10px rgba(37,117,252,0.3)',
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.8,
              background: 'linear-gradient(135deg, #6b78ff 0%, #2575fc 100%)',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '1.15rem',
              borderRadius: 4,
              boxShadow: '0 12px 25px rgba(0,0,0,0.35)',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'scale(1.06)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              },
            }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', color: '#555' }}>
            Ainda não tem conta?
          </Typography>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#6b78ff',
              color: '#6b78ff',
              fontWeight: 'bold',
              py: 1,
              px: 3,
              fontSize: '0.95rem',
              borderRadius: 4,
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: 'rgba(107,120,255,0.1)',
                borderColor: '#6b78ff',
                transform: 'scale(1.05)',
              },
            }}
            href="/criar-usuarios"
          >
            Criar Conta
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
