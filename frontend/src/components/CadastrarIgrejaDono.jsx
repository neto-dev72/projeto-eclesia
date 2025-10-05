import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../api/axiosConfig';

export default function CadastrarIgrejaDono({ sedeId }) {
  const [formData, setFormData] = useState({
    filhalNome: '',
    filhalEndereco: '',
    filhalTelefone: '',
    filhalEmail: '',
    filhalStatus: 'pendente',

    usuarioNome: '',
    usuarioSenha: '',
    usuarioFuncao: 'admin' // usuário será admin
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sedeId) {
      setError('Sede não informada.');
      return;
    }

    // Agora só valida usuário
    if (!formData.usuarioNome || !formData.usuarioSenha) {
      setError('Por favor, preencha o nome e a senha do usuário.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Monta payload básico (sempre terá usuário e sede)
      const payload = {
        usuarioNome: formData.usuarioNome,
        usuarioSenha: formData.usuarioSenha,
        usuarioFuncao: formData.usuarioFuncao,
        SedeId: sedeId
      };

      // Se a filial tiver nome, inclui no payload
      if (formData.filhalNome.trim() !== '') {
        payload.nome = formData.filhalNome;
        payload.endereco = formData.filhalEndereco;
        payload.telefone = formData.filhalTelefone;
        payload.email = formData.filhalEmail;
        payload.status = formData.filhalStatus;
      }

      const res = await api.post('/filhais', payload);

      setSuccess(
        formData.filhalNome.trim() !== ''
          ? 'Filial e Usuário cadastrados com sucesso!'
          : 'Usuário cadastrado com sucesso (sem filial)!'
      );

      setFormData({
        filhalNome: '',
        filhalEndereco: '',
        filhalTelefone: '',
        filhalEmail: '',
        filhalStatus: 'pendente',
        usuarioNome: '',
        usuarioSenha: '',
        usuarioFuncao: 'admin'
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Typography variant="h6" sx={{ mb: 1 }}>Dados da Filial (opcional)</Typography>
      <TextField
        fullWidth
        label="Nome da Filial"
        name="filhalNome"
        value={formData.filhalNome}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Endereço da Filial"
        name="filhalEndereco"
        value={formData.filhalEndereco}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Telefone da Filial"
        name="filhalTelefone"
        value={formData.filhalTelefone}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email da Filial"
        name="filhalEmail"
        value={formData.filhalEmail}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        select
        fullWidth
        label="Status da Filial"
        name="filhalStatus"
        value={formData.filhalStatus}
        onChange={handleChange}
        margin="normal"
      >
        <MenuItem value="ativo">Ativo</MenuItem>
        <MenuItem value="pendente">Pendente</MenuItem>
        <MenuItem value="bloqueado">Bloqueado</MenuItem>
      </TextField>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Usuário Admin</Typography>
      <TextField
        fullWidth
        label="Nome do Usuário"
        name="usuarioNome"
        value={formData.usuarioNome}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Senha do Usuário"
        name="usuarioSenha"
        type={showPassword ? 'text' : 'password'}
        value={formData.usuarioSenha}
        onChange={handleChange}
        required
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <TextField
        fullWidth
        label="Função"
        name="usuarioFuncao"
        value={formData.usuarioFuncao}
        margin="normal"
        disabled
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </Button>
    </Box>
  );
}
