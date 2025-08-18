import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  List,
  ListItem,
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
  ListItemAvatar,
  Avatar,
  Stack,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkIcon from '@mui/icons-material/Work';

import api from '../api/axiosConfig';
import FormCargos from '../components/FormCargos';
import AtribuirCargoMembro from '../components/AtribuirCargoMembro';

export default function GestaoCargos() {
  const [cargos, setCargos] = useState([]);
  const [filteredCargos, setFilteredCargos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [openCargoModal, setOpenCargoModal] = useState(false);
  const [editingCargo, setEditingCargo] = useState(null);
  const [deletingCargo, setDeletingCargo] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchCargos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/lista/cargos');
      setCargos(res.data);
      setFilteredCargos(res.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao carregar cargos.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCargos();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredCargos(cargos);
    } else {
      const filtered = cargos.filter(c =>
        c.nome.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCargos(filtered);
    }
  }, [search, cargos]);

  const handleOpenNewCargo = () => {
    setEditingCargo(null);
    setOpenCargoModal(true);
  };

  const handleEditCargo = (cargo) => {
    setEditingCargo(cargo);
    setOpenCargoModal(true);
  };

  const handleDeleteClick = (cargo) => {
    setDeletingCargo(cargo);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/cargos/${deletingCargo.id}`);
      setSnackbar({ open: true, message: 'Cargo excluído com sucesso.', severity: 'success' });
      setDeletingCargo(null);
      fetchCargos();
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao excluir cargo.', severity: 'error' });
    }
  };

  const cancelDelete = () => {
    setDeletingCargo(null);
  };

  const handleCloseModal = () => {
    setOpenCargoModal(false);
    setEditingCargo(null);
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Gestão de Cargos
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Buscar por nome"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenNewCargo}
        >
          Cadastrar Novo Cargo
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {filteredCargos.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
              Nenhum cargo encontrado.
            </Typography>
          ) : (
            filteredCargos.map((cargo) => (
              <ListItem
                key={cargo.id}
                alignItems="flex-start"
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  mb: 2,
                  boxShadow: 1,
                }}
                secondaryAction={
                  <Box>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleEditCargo(cargo)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => handleDeleteClick(cargo)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <WorkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      {cargo.nome}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      {cargo.descricao && (
                        <Typography variant="body2" gutterBottom>
                          {cargo.descricao}
                        </Typography>
                      )}
                      <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                        <GroupIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {cargo.totalMembros} membro(s) atribuídos
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          Última atribuição:{' '}
                          {cargo.ultimoAtribuido
                            ? new Date(cargo.ultimoAtribuido).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })
                            : 'Nenhuma'}
                        </Typography>
                      </Stack>
                    </Box>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      )}

      {/* Modal de cadastro/edição */}
      <Dialog open={openCargoModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCargo ? 'Editar Cargo' : 'Cadastrar Novo Cargo'}</DialogTitle>
        <DialogContent dividers>
          <FormCargos
            cargo={editingCargo}
            onSuccess={() => {
              handleCloseModal();
              fetchCargos();
              setSnackbar({
                open: true,
                message: `Cargo ${editingCargo ? 'atualizado' : 'cadastrado'} com sucesso!`,
                severity: 'success',
              });
            }}
            onCancel={handleCloseModal}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={Boolean(deletingCargo)} onClose={cancelDelete}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente excluir o cargo <strong>{deletingCargo?.nome}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Atribuir cargo a membro */}
      <AtribuirCargoMembro cargos={cargos} />

      {/* Snackbar de feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
