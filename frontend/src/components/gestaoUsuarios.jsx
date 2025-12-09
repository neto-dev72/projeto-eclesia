// pages/GestaoUsuarios.jsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import api from '../api/axiosConfig';

export default function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [membrosUser, setMembrosUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ------------------ Usuários ------------------
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await api.get('/gestao-usuarios');
      setUsuarios(res.data.usuarios);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setSnackbar({ open: true, message: 'Erro ao carregar usuários.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeFuncao = async (usuario, novaFuncao) => {
    try {
      await api.put(`/usuarios/${usuario.id}`, { funcao: novaFuncao });
      setSnackbar({ open: true, message: `Função de ${usuario.nome} alterada para ${novaFuncao}!`, severity: 'success' });
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao atualizar função:', error);
      setSnackbar({ open: true, message: 'Erro ao atualizar função.', severity: 'error' });
    }
  };

  const handleDeleteUsuario = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;
    try {
      await api.delete(`/usuarios/${id}`);
      setSnackbar({ open: true, message: 'Usuário deletado com sucesso!', severity: 'success' });
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      setSnackbar({ open: true, message: 'Erro ao deletar usuário.', severity: 'error' });
    }
  };

  // ------------------ MembroUser ------------------
  const fetchMembrosUser = async () => {
    try {
      const res = await api.get('/gestao-membrosuser');
      setMembrosUser(res.data.usuarios);
    } catch (error) {
      console.error('Erro ao buscar MembroUser:', error);
      setSnackbar({ open: true, message: 'Erro ao carregar membros.', severity: 'error' });
    }
  };

  const toggleStatusMembro = async (id, statusAtual) => {
    try {
      const novoStatus = statusAtual === 'pendente' ? 'aprovado' : 'pendente';
      await api.put(`/membroUser/${id}/aprovar`, { status: novoStatus });
      setSnackbar({ open: true, message: `Membro agora está ${novoStatus}!`, severity: 'success' });
      fetchMembrosUser();
    } catch (error) {
      console.error('Erro ao alterar status do membro:', error);
      setSnackbar({ open: true, message: 'Erro ao alterar status do membro.', severity: 'error' });
    }
  };

  const handleDeleteMembro = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este membro?')) return;
    try {
      await api.delete(`/membroUser/${id}`);
      setSnackbar({ open: true, message: 'Membro deletado com sucesso!', severity: 'success' });
      fetchMembrosUser();
    } catch (error) {
      console.error('Erro ao deletar membro:', error);
      setSnackbar({ open: true, message: 'Erro ao deletar membro.', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchMembrosUser();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={70} />
      </Box>
    );
  }

  // Filtra membros pendentes para não mostrar aprovados
  const membrosPendentes = membrosUser.filter((m) => m.status !== 'aprovado');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        px: 2,
        background: 'linear-gradient(to bottom right, #6b78ff, #ffffff)',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          gutterBottom
          color="primary"
          fontWeight="bold"
          align="center"
          sx={{ mb: 6, textShadow: '2px 2px 8px rgba(0,0,0,0.2)' }}
        >
          Gestão de Usuários
        </Typography>

        {/* Lista Usuários */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
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
        </Box>

        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 15px 40px rgba(0,0,0,0.2)', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Função</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Data de Criação</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }} align="center">
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((u) => (
                  <TableRow key={u.id} sx={{ '&:hover': { backgroundColor: 'rgba(101,116,255,0.1)', transform: 'scale(1.01)' }, transition: 'all 0.3s' }}>
                    <TableCell>{u.nome}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {['usuario', 'moderador', 'admin'].map((f) => (
                          <Chip
                            key={f}
                            label={f}
                            clickable
                            color={u.funcao === f ? 'primary' : 'default'}
                            onClick={() => handleChangeFuncao(u, f)}
                            sx={{ fontWeight: u.funcao === f ? 'bold' : 'normal', textTransform: 'capitalize' }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => handleDeleteUsuario(u.id)} sx={{ '&:hover': { transform: 'scale(1.2)' } }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {usuarios.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* ------------------- Lista MembroUser ------------------- */}
        <Typography variant="h4" sx={{ mt: 6, mb: 3, fontWeight: 'bold', color: '#333' }}>
          Gestão de MembroUser
        </Typography>

        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 15px 40px rgba(0,0,0,0.2)', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Data de Criação</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }} align="center">
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {membrosPendentes.map((m) => (
                  <TableRow key={m.id} sx={{
                    '&:hover': { backgroundColor: 'rgba(101,116,255,0.1)', transform: 'scale(1.01)' },
                    transition: 'all 0.3s',
                    backgroundColor: m.status === 'pendente' ? 'rgba(255, 243, 205, 0.3)' : 'rgba(198, 255, 208, 0.3)'
                  }}>
                    <TableCell>{m.nome}</TableCell>
                    <TableCell>
                      <Chip
                        label={m.status}
                        color={m.status === 'aprovado' ? 'success' : 'warning'}
                        sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>{new Date(m.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color={m.status === 'pendente' ? 'success' : 'warning'}
                        onClick={() => toggleStatusMembro(m.id, m.status)}
                        sx={{ '&:hover': { transform: 'scale(1.2)' } }}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteMembro(m.id)} sx={{ '&:hover': { transform: 'scale(1.2)' } }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {membrosPendentes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      Nenhum membro pendente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

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
      </Container>
    </Box>
  );
}
