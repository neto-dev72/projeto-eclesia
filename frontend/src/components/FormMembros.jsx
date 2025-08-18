import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material';
import api from '../api/axiosConfig';

export default function FormMembros({ onSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    foto: '',
    genero: '',
    data_nascimento: '',
    estado_civil: '',
    bi: '',
    telefone: '',
    email: '',
    endereco_rua: '',
    endereco_bairro: '',
    endereco_cidade: '',
    endereco_provincia: '',
    grau_academico: '',
    profissao: '',
    batizado: false,
    data_batismo: '',
    ativo: true,
    CargoId: '', // <- Agora com o nome atualizado
  });

  const [cargos, setCargos] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const res = await api.get('/cargos');
        setCargos(res.data);
      } catch (err) {
        console.error('Erro ao carregar cargos:', err);
        setMensagem({ tipo: 'error', texto: 'Erro ao carregar os cargos.' });
      }
    };
    fetchCargos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let finalValue;
    if (type === 'checkbox') {
      finalValue = checked;
    } else if (name === 'CargoId') {
      finalValue = parseInt(value, 10); // Garante que seja um número
    } else {
      finalValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    setMensagem({ tipo: '', texto: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.genero || !formData.CargoId) {
      setMensagem({
        tipo: 'error',
        texto: 'Por favor, preencha os campos obrigatórios: nome, gênero e cargo.',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Enviando dados do membro:', formData); // DEBUG
      const res = await api.post('/membros', formData);

      setMensagem({
        tipo: 'success',
        texto: res.data.message || 'Membro cadastrado com sucesso!',
      });

      setFormData({
        nome: '',
        foto: '',
        genero: '',
        data_nascimento: '',
        estado_civil: '',
        bi: '',
        telefone: '',
        email: '',
        endereco_rua: '',
        endereco_bairro: '',
        endereco_cidade: '',
        endereco_provincia: '',
        grau_academico: '',
        profissao: '',
        batizado: false,
        data_batismo: '',
        ativo: true,
        CargoId: '',
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Erro ao cadastrar membro:', err.response?.data || err.message);
      setMensagem({
        tipo: 'error',
        texto: err.response?.data?.message || 'Erro ao cadastrar membro.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {mensagem.texto && (
        <Alert severity={mensagem.tipo} sx={{ mb: 2 }}>
          {mensagem.texto}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Nome *"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        required
        margin="normal"
      />

      <TextField
        fullWidth
        label="Foto (URL)"
        name="foto"
        value={formData.foto}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        select
        fullWidth
        label="Gênero *"
        name="genero"
        value={formData.genero}
        onChange={handleChange}
        required
        margin="normal"
      >
        <MenuItem value="Masculino">Masculino</MenuItem>
        <MenuItem value="Feminino">Feminino</MenuItem>
        <MenuItem value="Outro">Outro</MenuItem>
      </TextField>

      <TextField
        fullWidth
        label="Data de Nascimento"
        name="data_nascimento"
        type="date"
        value={formData.data_nascimento}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        margin="normal"
      />

      <TextField
        select
        fullWidth
        label="Estado Civil"
        name="estado_civil"
        value={formData.estado_civil}
        onChange={handleChange}
        margin="normal"
      >
        <MenuItem value="Solteiro">Solteiro</MenuItem>
        <MenuItem value="Casado">Casado</MenuItem>
        <MenuItem value="Divorciado">Divorciado</MenuItem>
        <MenuItem value="Viúvo">Viúvo</MenuItem>
      </TextField>

      <TextField fullWidth label="BI" name="bi" value={formData.bi} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Rua" name="endereco_rua" value={formData.endereco_rua} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Bairro" name="endereco_bairro" value={formData.endereco_bairro} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Cidade" name="endereco_cidade" value={formData.endereco_cidade} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Província" name="endereco_provincia" value={formData.endereco_provincia} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Grau Acadêmico" name="grau_academico" value={formData.grau_academico} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Profissão" name="profissao" value={formData.profissao} onChange={handleChange} margin="normal" />

      <FormControlLabel
        control={
          <Checkbox
            name="batizado"
            checked={formData.batizado}
            onChange={handleChange}
          />
        }
        label="Batizado"
      />

      <TextField
        fullWidth
        label="Data do Batismo"
        name="data_batismo"
        type="date"
        value={formData.data_batismo}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        margin="normal"
      />

      <FormControlLabel
        control={
          <Checkbox
            name="ativo"
            checked={formData.ativo}
            onChange={handleChange}
          />
        }
        label="Ativo"
      />

      <TextField
        select
        fullWidth
        label="Cargo *"
        name="CargoId"
        value={formData.CargoId}
        onChange={handleChange}
        required
        margin="normal"
      >
        {cargos.map((cargo) => (
          <MenuItem key={cargo.id} value={cargo.id}>
            {cargo.nome}
          </MenuItem>
        ))}
      </TextField>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Salvando...' : 'Cadastrar Membro'}
      </Button>
    </Box>
  );
}
