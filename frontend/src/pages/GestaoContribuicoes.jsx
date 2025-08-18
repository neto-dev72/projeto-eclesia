import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentsIcon from '@mui/icons-material/Payments';

import api from '../api/axiosConfig';
import FormTipoContribuicao from '../components/FormTipoContribuicao';
import FormLancarContribuicao from '../components/FormLancarContribuicao';

export default function GestaoContribuicoes() {
  const [tipos, setTipos] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredTipos, setFilteredTipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openTipoModal, setOpenTipoModal] = useState(false);
  const [openLancamentoModal, setOpenLancamentoModal] = useState(false);
  const [tipoEditando, setTipoEditando] = useState(null);
  const [tipoSelecionadoParaLancamento, setTipoSelecionadoParaLancamento] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchTipos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/lista/tipos-contribuicao');
      setTipos(res.data);
      setFilteredTipos(res.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao carregar tipos de contribuição.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredTipos(tipos);
    } else {
      setFilteredTipos(
        tipos.filter((t) => t.nome.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }, [search, tipos]);

  const abrirModalNovoTipo = () => {
    setTipoEditando(null);
    setOpenTipoModal(true);
  };

  const abrirModalLancamento = (tipo) => {
    setTipoSelecionadoParaLancamento(tipo);
    setOpenLancamentoModal(true);
  };

  const abrirModalEditarTipo = (tipo) => {
    setTipoEditando(tipo);
    setOpenTipoModal(true);
  };

  const deletarTipo = async (id) => {
    try {
      await api.delete(`/tipos-contribuicao/${id}`);
      fetchTipos();
      setSnackbar({ open: true, message: 'Tipo de contribuição excluído com sucesso.', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao excluir tipo.', severity: 'error' });
    }
  };

  // Função para formatar valores financeiros com tratamento de undefined/null
  const formatarValor = (valor) => {
    if (typeof valor !== 'number' || isNaN(valor)) {
      return 'Kz 0,00';
    }
    return `Kz ${valor.toFixed(2).replace('.', ',')}`;
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Gestão de Contribuições
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Buscar tipo de contribuição"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={abrirModalNovoTipo}>
          Novo Tipo
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {filteredTipos.length === 0 ? (
            <Typography align="center" color="text.secondary">Nenhum tipo encontrado.</Typography>
          ) : (
            filteredTipos.map((tipo) => (
              <ListItem key={tipo.id} sx={{ bgcolor: '#f5f5f5', borderRadius: 1, mb: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ListItemText
                    primary={tipo.nome}
                    secondary={tipo.ativo ? 'Ativo' : 'Inativo'}
                  />
                  <Box>
                    <Tooltip title="Lançar Contribuição">
                      <IconButton onClick={() => abrirModalLancamento(tipo)}>
                        <PaymentsIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver Histórico">
                      <IconButton onClick={() => console.log('Ver histórico', tipo)}>
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => abrirModalEditarTipo(tipo)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => deletarTipo(tipo.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Mostra os dados financeiros abaixo do nome */}
                <Box sx={{ mt: 1, width: '100%', display: 'flex', justifyContent: 'space-around', fontWeight: 'bold' }}>
                  <Typography variant="body2" color="text.secondary">
                    Receita Total: {formatarValor(tipo.receitaTotal)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receita Média: {formatarValor(tipo.receitaMedia)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Maior Contribuição: {formatarValor(tipo.maiorContribuicao)}
                  </Typography>
                </Box>
              </ListItem>
            ))
          )}
        </List>
      )}

      {/* Modal para cadastrar ou editar tipo */}
      <Dialog open={openTipoModal} onClose={() => setOpenTipoModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{tipoEditando ? 'Editar Tipo de Contribuição' : 'Cadastrar Tipo de Contribuição'}</DialogTitle>
        <DialogContent dividers>
          <FormTipoContribuicao
            tipo={tipoEditando}
            onSuccess={() => {
              setOpenTipoModal(false);
              fetchTipos();
              setSnackbar({
                open: true,
                message: `Tipo ${tipoEditando ? 'editado' : 'criado'} com sucesso!`,
                severity: 'success',
              });
            }}
            onCancel={() => setOpenTipoModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal para lançar contribuição */}
      <Dialog open={openLancamentoModal} onClose={() => setOpenLancamentoModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Lançar Contribuição</DialogTitle>
        <DialogContent dividers>
          <FormLancarContribuicao
            tipo={tipoSelecionadoParaLancamento}
            onSuccess={() => {
              setOpenLancamentoModal(false);
              setSnackbar({
                open: true,
                message: 'Contribuição lançada com sucesso!',
                severity: 'success',
              });
            }}
            onCancel={() => setOpenLancamentoModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Snackbar para mensagens */}
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
