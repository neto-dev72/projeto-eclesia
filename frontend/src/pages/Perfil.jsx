// pages/Perfil.jsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Grid,
  Paper,
  CircularProgress,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import api from '../api/axiosConfig';
import GestaoUsuarios from '../components/gestaoUsuarios';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formUsuario, setFormUsuario] = useState({
    nome: '',
    senha: '',
    funcao: 'usuario',
  });

  // Busca dados do perfil
  const fetchPerfil = async () => {
    try {
      const res = await api.get('/meu-perfil');
      setUsuario(res.data.usuario);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verifica função do usuário
  const checkUsuarioStatus = async () => {
    try {
      const res = await api.get('/usuario/status');
      setIsAdmin(res.data.usuario.funcao === 'admin');
    } catch (error) {
      console.error('Erro ao verificar status do usuário:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
    checkUsuarioStatus();
  }, []);

  const handleOpenModal = (edit = false) => {
    if (edit && usuario) {
      setFormUsuario({ nome: usuario.nome, senha: '', funcao: usuario.funcao });
      setIsEditMode(true);
    } else {
      setFormUsuario({ nome: '', senha: '', funcao: 'usuario' });
      setIsEditMode(false);
    }
    setOpenFormModal(true);
  };

  const handleCloseModal = () => setOpenFormModal(false);

  const handleChange = (e) => setFormUsuario({ ...formUsuario, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put('/meu-perfil', formUsuario);
        setSnackbar({ open: true, message: 'Perfil atualizado com sucesso!', severity: 'success' });
      } else {
        await api.post('/novo-usuarios', formUsuario);
        setSnackbar({ open: true, message: 'Usuário criado com sucesso!', severity: 'success' });
      }
      setOpenFormModal(false);
      fetchPerfil();
    } catch (error) {
      console.error('Erro:', error);
      setSnackbar({ open: true, message: 'Erro ao salvar os dados.', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={70} />
      </Box>
    );
  }

  if (!usuario) {
    return (
      <Typography align="center" color="error" sx={{ mt: 10, fontSize: '1.2rem' }}>
        Não foi possível carregar os dados do perfil.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        px: 2,
        background: 'linear-gradient(to bottom right, #6b78ff, #ffffff)',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          gutterBottom
          color="primary"
          fontWeight="bold"
          align="center"
          sx={{
            mb: 6,
            textShadow: '2px 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          Meu Perfil
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal(false)}
              sx={{
                mr: 2,
                background: 'linear-gradient(to right, #6a11cb, #2575fc)',
                color: 'white',
                px: 3,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 'bold',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                },
              }}
            >
              + Novo Usuário
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => handleOpenModal(true)}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 'bold',
              borderColor: '#6b78ff',
              color: '#6b78ff',
              '&:hover': {
                borderColor: '#2575fc',
                backgroundColor: 'rgba(101,116,255,0.1)',
              },
            }}
          >
            Editar Perfil
          </Button>
        </Box>

        <Paper
          sx={{
            p: 5,
            borderRadius: 4,
            boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s',
            '&:hover': { transform: 'translateY(-5px)' },
          }}
        >
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Avatar
                src={usuario.foto || ''}
                alt={usuario.nome}
                sx={{
                  width: 170,
                  height: 170,
                  mx: 'auto',
                  mb: 3,
                  border: '5px solid',
                  borderImage: 'linear-gradient(to right, #6a11cb, #2575fc) 1',
                }}
              />
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                {usuario.nome}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {usuario.funcao.toUpperCase()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    Sede:
                  </Typography>
                  <Typography variant="body1">{usuario.Sede ? usuario.Sede.nome : 'N/D'}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    Filhal:
                  </Typography>
                  <Typography variant="body1">{usuario.Filhal ? usuario.Filhal.nome : 'N/D'}</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Modal de edição/criação */}
        <Dialog open={openFormModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold', background: '#6b78ff', color: 'white' }}>
            {isEditMode ? 'Editar Perfil' : 'Cadastrar Novo Usuário'}
          </DialogTitle>
          <DialogContent dividers>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={formUsuario.nome}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Senha"
                type="password"
                name="senha"
                value={formUsuario.senha}
                onChange={handleChange}
                margin="normal"
                placeholder={isEditMode ? 'Preencha somente se quiser alterar a senha' : ''}
                required={!isEditMode}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="funcao-label">Função</InputLabel>
                <Select
                  labelId="funcao-label"
                  name="funcao"
                  value={formUsuario.funcao}
                  onChange={handleChange}
                  label="Função"
                >
                  <MenuItem value="usuario">Usuário</MenuItem>
                  <MenuItem value="moderador">Moderador</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="inherit">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              {isEditMode ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Componente de Gestão de Usuários somente se for admin */}
        {isAdmin && <GestaoUsuarios />}
      </Container>
    </Box>
  );
}
