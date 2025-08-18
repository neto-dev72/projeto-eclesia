// src/components/AtribuirCargoMembro.jsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import api from '../api/axiosConfig';

export default function AtribuirCargoMembro({ cargos }) {
  const [membros, setMembros] = useState([]);
  const [membroSelecionado, setMembroSelecionado] = useState('');
  const [cargoSelecionado, setCargoSelecionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Busca membros ao montar componente
  useEffect(() => {
    const fetchMembros = async () => {
      try {
        const res = await api.get('/membros');
        setMembros(res.data);
      } catch (error) {
        setSnackbar({ open: true, message: 'Erro ao carregar membros.', severity: 'error' });
      }
    };
    fetchMembros();
  }, []);

  // Função para atribuir cargo ao membro
  const handleAtribuir = async () => {
    if (!membroSelecionado || !cargoSelecionado) {
      setSnackbar({ open: true, message: 'Selecione membro e cargo.', severity: 'warning' });
      return;
    }
    setLoading(true);
    try {
      // Supondo que essa seja a rota para atribuir cargo a membro
      await api.post('/atribuir-cargos', {
        membroId: membroSelecionado,
        cargoId: cargoSelecionado,
      });
      setSnackbar({ open: true, message: 'Cargo atribuído com sucesso!', severity: 'success' });
      setMembroSelecionado('');
      setCargoSelecionado('');
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao atribuir cargo.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 6, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Atribuir Cargo a Membro
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="label-membro">Membro</InputLabel>
          <Select
            labelId="label-membro"
            value={membroSelecionado}
            label="Membro"
            onChange={(e) => setMembroSelecionado(e.target.value)}
            disabled={loading}
          >
            {membros.map((membro) => (
              <MenuItem key={membro.id} value={membro.id}>
                {membro.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="label-cargo">Cargo</InputLabel>
          <Select
            labelId="label-cargo"
            value={cargoSelecionado}
            label="Cargo"
            onChange={(e) => setCargoSelecionado(e.target.value)}
            disabled={loading}
          >
            {cargos.map((cargo) => (
              <MenuItem key={cargo.id} value={cargo.id}>
                {cargo.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleAtribuir}
          disabled={loading}
          sx={{ alignSelf: 'center', height: 40 }}
        >
          Atribuir Cargo
        </Button>
      </Box>

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
    </Box>
  );
}
