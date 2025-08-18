// src/components/FormTipoContribuicao.jsx

import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';
import api from '../api/axiosConfig';

export default function FormTipoContribuicao({ tipo, onSuccess, onCancel }) {
  const [nome, setNome] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tipo) {
      setNome(tipo.nome);
      setAtivo(tipo.ativo);
    }
  }, [tipo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tipo) {
        await api.put(`/tipos-contribuicao/${tipo.id}`, { nome, ativo });
      } else {
        await api.post('/tipos-contribuicao', { nome, ativo });
      }

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar tipo de contribuição:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Nome do Tipo de Contribuição"
        fullWidth
        required
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            color="primary"
          />
        }
        label="Ativo"
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {tipo ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </Box>
    </Box>
  );
}
