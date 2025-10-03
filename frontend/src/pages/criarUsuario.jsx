// pages/CriarUsuarios.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import api from '../api/axiosConfig';

export default function CriarUsuarios() {
  const [formData, setFormData] = useState({
    nome: '',
    senha: '',
    SedeId: '',
    FilhalId: ''
  });

  const [sedes, setSedes] = useState([]);
  const [filhais, setFilhais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [superAdminExiste, setSuperAdminExiste] = useState(null);

  // Buscar Sedes e Filhais
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [resSede, resFilhal] = await Promise.all([
          api.get('/sedes'),
          api.get('/filhais')
        ]);
        setSedes(resSede.data);
        setFilhais(resFilhal.data);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar dados de Sede e Filhal.');
      }
    };
    fetchDados();
  }, []);

  // Verificar se já existe super_admin
  useEffect(() => {
    const verificarSuperAdmin = async () => {
      try {
        const res = await api.get('/verificar-super-admin');
        setSuperAdminExiste(res.data.existe);
      } catch (err) {
        console.error(err);
        setError('Erro ao verificar super_admin.');
        setSuperAdminExiste(false);
      }
    };
    verificarSuperAdmin();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.senha) {
      setError('Por favor, preencha nome e senha.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/usuarios', formData);
      setSuccess('Usuário criado com sucesso!');
      setFormData({ nome: '', senha: '', SedeId: '', FilhalId: '' });
      setSuperAdminExiste(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar usuário.');
    } finally {
      setLoading(false);
    }
  };

  if (superAdminExiste === null) {
    return (
      <Container maxWidth="sm" sx={{ mt: 6, p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2, fontWeight: 'bold', color: '#555' }}>
          Verificando super_admin...
        </Typography>
      </Container>
    );
  }

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
      <Container
        maxWidth="sm"
        sx={{
          mt: 6,
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
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
          sx={{ fontWeight: 'bold', mb: 3, textShadow: '2px 2px 12px rgba(0,0,0,0.15)' }}
        >
          {superAdminExiste ? 'Cadastro de Usuários Desativado' : 'Cadastrar Usuário'}
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

        {!superAdminExiste ? (
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
                  backgroundColor: '#f7f9ff',
                  transition: 'all 0.3s',
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
                  backgroundColor: '#f7f9ff',
                  transition: 'all 0.3s',
                },
                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                  borderColor: '#2575fc',
                  boxShadow: '0 0 10px rgba(37,117,252,0.3)',
                },
              }}
            />
            <TextField
              fullWidth
              select
              label="Sede"
              name="SedeId"
              value={formData.SedeId}
              onChange={handleChange}
              margin="normal"
              sx={{ mb: 2 }}
            >
              {sedes.map(s => (
                <MenuItem key={s.id} value={s.id}>{s.nome}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Filhal"
              name="FilhalId"
              value={formData.FilhalId}
              onChange={handleChange}
              margin="normal"
              sx={{ mb: 2 }}
            >
              {filhais.map(f => (
                <MenuItem key={f.id} value={f.id}>{f.nome}</MenuItem>
              ))}
            </TextField>

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
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', color: '#555' }}>
                Já tens conta?
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
                href="/login"
              >
                Fazer Login
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Alert
              severity="info"
              sx={{
                mb: 2,
                borderRadius: 3,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              }}
            >
              <Typography variant="body1" sx={{ mb: 1 }}>
                O cadastro de novos usuários está temporariamente desativado.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Para obter acesso ou mais informações, entre em contato com o administrador do sistema.
              </Typography>
              <Typography variant="body2">
                Para acessar o sistema, utilize suas credenciais existentes e faça login.
              </Typography>
            </Alert>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Já tens conta?
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                href="/login"
              >
                Fazer Login
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
