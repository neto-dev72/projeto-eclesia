import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

import api from '../api/axiosConfig';
import FormMembros from '../components/FormMembros';

export default function GestaoMembros() {
  const [membros, setMembros] = useState([]);
  const [filteredMembros, setFilteredMembros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [deletingMembro, setDeletingMembro] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openMembroModal, setOpenMembroModal] = useState(false);

  const fetchMembros = async () => {
    setLoading(true);
    try {
      const res = await api.get('/membros');
      setMembros(res.data);
      setFilteredMembros(res.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao carregar membros.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembros();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredMembros(membros);
    } else {
      const filtered = membros.filter(m =>
        m.nome.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMembros(filtered);
    }
  }, [search, membros]);

  const handleDeleteClick = (membro) => {
    setDeletingMembro(membro);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/membros/${deletingMembro.id}`);
      setSnackbar({ open: true, message: 'Membro excluído com sucesso.', severity: 'success' });
      setDeletingMembro(null);
      fetchMembros();
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao excluir membro.', severity: 'error' });
    }
  };

  const cancelDelete = () => {
    setDeletingMembro(null);
  };

  const handleEditarMembro = (id) => {
    alert(`Editar membro com ID ${id} (implementar)`);
  };

  const handleVerHistorico = (id) => {
    alert(`Ver histórico do membro com ID ${id} (implementar)`);
  };

  const handleVerPerfil = (membro) => {
    alert(`Ver perfil do membro: ${membro.nome} (implementar modal ou página)`);
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Gestão de Membros
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenMembroModal(true)}
        >
          Cadastrar Novo Membro
        </Button>
        <TextField
          label="Buscar por nome"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {filteredMembros.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
              Nenhum membro encontrado.
            </Typography>
          ) : (
            filteredMembros.map((membro) => (
              <ListItem
                key={membro.id}
                secondaryAction={
                  <Box>
                    <Tooltip title="Ver Perfil">
                      <IconButton onClick={() => handleVerPerfil(membro)} size="large">
                        <AccountCircleRoundedIcon color="action" fontSize="large" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver Histórico">
                      <IconButton onClick={() => handleVerHistorico(membro.id)}>
                        <HistoryIcon color="info" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleEditarMembro(membro.id)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => handleDeleteClick(membro)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar src={membro.foto || undefined}>
                    {membro.nome.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={membro.nome}
                  secondary={`${membro.profissao || '-'} — ${membro.email || '-'}`}
                />
              </ListItem>
            ))
          )}
        </List>
      )}

      {/* Modal para cadastro de membro */}
      <Dialog
        open={openMembroModal}
        onClose={() => setOpenMembroModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Cadastrar Novo Membro</DialogTitle>
        <DialogContent dividers>
          <FormMembros onSuccess={() => {
            setOpenMembroModal(false);
            fetchMembros();
          }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMembroModal(false)} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmar exclusão */}
      <Dialog open={Boolean(deletingMembro)} onClose={cancelDelete}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente excluir o membro <strong>{deletingMembro?.nome}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens */}
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
  );
}
