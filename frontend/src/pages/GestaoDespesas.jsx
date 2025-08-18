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
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import api from '../api/axiosConfig';
import FormDespesa from '../components/FormDespesas';

export default function GestaoDespesas() {
  const [despesas, setDespesas] = useState([]);
  const [filteredDespesas, setFilteredDespesas] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingDespesa, setEditingDespesa] = useState(null);
  const [deletingDespesa, setDeletingDespesa] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchDespesas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/despesas');
      setDespesas(res.data);
      setFilteredDespesas(res.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao carregar despesas.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDespesas();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredDespesas(despesas);
    } else {
      const filtered = despesas.filter(d =>
        d.descricao?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredDespesas(filtered);
    }
  }, [search, despesas]);

  const handleDeleteClick = (despesa) => {
    setDeletingDespesa(despesa);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/despesas/${deletingDespesa.id}`);
      setSnackbar({ open: true, message: 'Despesa excluída com sucesso.', severity: 'success' });
      setDeletingDespesa(null);
      fetchDespesas();
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao excluir despesa.', severity: 'error' });
    }
  };

  const cancelDelete = () => {
    setDeletingDespesa(null);
  };

  const handleEdit = (despesa) => {
    setEditingDespesa(despesa);
    setOpenModal(true);
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Gestão de Despesas
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingDespesa(null);
            setOpenModal(true);
          }}
        >
          Nova Despesa
        </Button>
        <TextField
          label="Buscar por descrição"
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
          {filteredDespesas.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
              Nenhuma despesa encontrada.
            </Typography>
          ) : (
            filteredDespesas.map((despesa) => (
              <ListItem
                key={despesa.id}
                divider
                secondaryAction={
                  <Box>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleEdit(despesa)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => handleDeleteClick(despesa)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemText
                  primary={`${despesa.descricao} — Kz ${parseFloat(despesa.valor).toFixed(2)}`}
                  secondary={`Tipo: ${despesa.tipo || '-'} | Categoria: ${despesa.categoria || '-'} | Data: ${new Date(despesa.data).toLocaleDateString()}`}
                />
              </ListItem>
            ))
          )}
        </List>
      )}

      {/* Modal de Cadastro/Edição */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingDespesa ? 'Editar Despesa' : 'Nova Despesa'}</DialogTitle>
        <DialogContent dividers>
          <FormDespesa
            despesa={editingDespesa}
            onSuccess={() => {
              setOpenModal(false);
              fetchDespesas();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmação de Exclusão */}
      <Dialog open={Boolean(deletingDespesa)} onClose={cancelDelete}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir a despesa: <strong>{deletingDespesa?.descricao}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Excluir</Button>
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
    </Container>
  );
}
