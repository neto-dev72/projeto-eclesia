import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Modal,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  TextField
} from '@mui/material';
import { Check, Block, Pause } from '@mui/icons-material';
import api from '../api/axiosConfig';
import CadastrarIgrejaDono from '../components/CadastrarIgrejaDono';

export default function GestaoIgrejas() {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalFilhalOpen, setModalFilhalOpen] = useState(false);
  const [selectedSede, setSelectedSede] = useState(null);

  const [modalSedeOpen, setModalSedeOpen] = useState(false); // Modal para cadastro de sede

  const [novaSede, setNovaSede] = useState({ nome: '', endereco: '', telefone: '', email: '' });

  useEffect(() => {
    fetchSedes();
  }, []);

  const fetchSedes = async () => {
    try {
      const res = await api.get('/sedes-com-filhais');
      setSedes(res.data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar sedes e filhais.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFilhalModal = (sede) => {
    setSelectedSede(sede);
    setModalFilhalOpen(true);
  };
  const handleCloseFilhalModal = () => {
    setSelectedSede(null);
    setModalFilhalOpen(false);
  };

  const handleOpenSedeModal = () => setModalSedeOpen(true);
  const handleCloseSedeModal = () => setModalSedeOpen(false);

  const atualizarStatus = async ({ tipo, id }, novoStatus) => {
    try {
      await api.patch(`/${tipo}/${id}/status`, { status: novoStatus });

      setSedes(prev =>
        prev.map(sede => {
          if (tipo === 'sedes' && sede.id === id) return { ...sede, status: novoStatus };

          if (sede.Filhals) {
            return {
              ...sede,
              Filhals: sede.Filhals.map(f =>
                tipo === 'filhais' && f.id === id ? { ...f, status: novoStatus } : f
              )
            };
          }

          return sede;
        })
      );
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const statusProps = {
    ativo: { label: 'Ativo', color: 'success', icon: <Check /> },
    pendente: { label: 'Pendente', color: 'warning', icon: <Pause /> },
    bloqueado: { label: 'Bloqueado', color: 'error', icon: <Block /> },
  };

  const handleNovaSedeChange = (e) => {
    setNovaSede({ ...novaSede, [e.target.name]: e.target.value });
  };

  const handleNovaSedeSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sedes', novaSede);
      setSedes([...sedes, res.data]);
      setNovaSede({ nome: '', endereco: '', telefone: '', email: '' });
      handleCloseSedeModal();
    } catch (err) {
      console.error('Erro ao cadastrar sede:', err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" gutterBottom color="primary" align="center">
        Gestão de Igrejas
      </Typography>

      {/* Botão para abrir modal de cadastro de Sede */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button variant="contained" color="primary" onClick={handleOpenSedeModal}>
          Cadastrar Nova Sede
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
      {error && <Typography color="error" align="center">{error}</Typography>}

      {!loading && !error && (
        <>
          {sedes.length === 0 ? (
            <Typography align="center" sx={{ mt: 4 }}>
              Nenhuma sede cadastrada.
            </Typography>
          ) : (
            sedes.map((sede) => (
              <Paper key={sede.id} sx={{ mb: 3, p: 2, position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" color="primary">
                    {sede.nome}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Chip
                      label={statusProps[sede.status].label}
                      color={statusProps[sede.status].color}
                      icon={statusProps[sede.status].icon}
                    />
                    {Object.keys(statusProps).map(st => st !== sede.status && (
                      <Tooltip key={st} title={`Mudar para ${statusProps[st].label}`}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => atualizarStatus({ tipo: 'sedes', id: sede.id }, st)}
                        >
                          {statusProps[st].icon}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  Endereço: {sede.endereco || '-'} | Telefone: {sede.telefone || '-'} | Email: {sede.email || '-'}
                </Typography>

                {sede.Filhals && sede.Filhals.length > 0 ? (
                  <List>
                    {sede.Filhals.map((filhal) => (
                      <React.Fragment key={filhal.id}>
                        <ListItem
                          secondaryAction={
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Chip
                                label={statusProps[filhal.status].label}
                                color={statusProps[filhal.status].color}
                                icon={statusProps[filhal.status].icon}
                              />
                              {Object.keys(statusProps).map(st => st !== filhal.status && (
                                <Tooltip key={st} title={`Mudar para ${statusProps[st].label}`}>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => atualizarStatus({ tipo: 'filhais', id: filhal.id }, st)}
                                  >
                                    {statusProps[st].icon}
                                  </IconButton>
                                </Tooltip>
                              ))}
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={filhal.nome}
                            secondary={`Endereço: ${filhal.endereco || '-'} | Telefone: ${filhal.telefone || '-'} | Email: ${filhal.email || '-'}`}
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Nenhuma filhal cadastrada para esta sede.
                  </Typography>
                )}

                <Box sx={{ textAlign: 'right', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenFilhalModal(sede)}
                  >
                    Adicionar Filhal + Usuário
                  </Button>
                </Box>
              </Paper>
            ))
          )}

          {/* Modal de cadastro de Filhal + Usuário */}
          <Modal open={modalFilhalOpen} onClose={handleCloseFilhalModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: 500 },
                maxHeight: '70vh',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                overflowY: 'auto',
              }}
            >
              <Typography variant="h5" gutterBottom>
                {selectedSede ? `Cadastrar Filhal e Usuário para ${selectedSede.nome}` : ''}
              </Typography>
              <CadastrarIgrejaDono sedeId={selectedSede?.id} />
            </Box>
          </Modal>

          {/* Modal de cadastro de Sede */}
          <Modal open={modalSedeOpen} onClose={handleCloseSedeModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: 500 },
                maxHeight: '70vh',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                overflowY: 'auto',
              }}
            >
              <Typography variant="h5" gutterBottom>
                Cadastrar Nova Sede
              </Typography>

              <form onSubmit={handleNovaSedeSubmit}>
                <TextField
                  fullWidth
                  label="Nome da Sede"
                  name="nome"
                  margin="normal"
                  value={novaSede.nome}
                  onChange={handleNovaSedeChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Endereço"
                  name="endereco"
                  margin="normal"
                  value={novaSede.endereco}
                  onChange={handleNovaSedeChange}
                />
                <TextField
                  fullWidth
                  label="Telefone"
                  name="telefone"
                  margin="normal"
                  value={novaSede.telefone}
                  onChange={handleNovaSedeChange}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  margin="normal"
                  value={novaSede.email}
                  onChange={handleNovaSedeChange}
                />
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                  <Button type="submit" variant="contained" color="primary">
                    Cadastrar
                  </Button>
                </Box>
              </form>
            </Box>
          </Modal>
        </>
      )}
    </Container>
  );
}
