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
  Typography,
  Divider
} from '@mui/material';
import api from '../api/axiosConfig';

export default function FormMembros({ onSuccess, membroData }) {
  const [formData, setFormData] = useState({
    nome: '',
    foto: null,
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
    batizado: false,
    data_batismo: '',
    ativo: true,
    CargosIds: [],
    DepartamentosIds: [],
    habilitacoes: '',
    especialidades: '',
    estudo_teologico: '',
    local_formacao: '',
    profissao: '',
    consagrado: false,
    data_consagracao: '',
    categoria_ministerial: '',
    trabalha: false,
    conta_outrem: false,
    conta_propria: false,
  });

  const [previewFoto, setPreviewFoto] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (membroData) {
      setFormData({
        ...formData,
        ...membroData,
        CargosIds: membroData.CargosIds || [],
        DepartamentosIds: membroData.DepartamentosIds || [],
        foto: null
      });
      if (membroData.foto) setPreviewFoto(membroData.foto);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membroData]);

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

    const fetchDepartamentos = async () => {
      try {
        const res = await api.get('/departamentos');
        setDepartamentos(res.data);
      } catch (err) {
        console.error('Erro ao carregar departamentos:', err);
        setMensagem({ tipo: 'error', texto: 'Erro ao carregar os departamentos.' });
      }
    };

    fetchCargos();
    fetchDepartamentos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let finalValue;

    if (type === 'checkbox') {
      finalValue = checked;
    } else if (name === 'foto') {
      finalValue = files[0] || null;
      if (files[0]) setPreviewFoto(URL.createObjectURL(files[0]));
    } else if (name === 'CargosIds' || name === 'DepartamentosIds') {
      finalValue = typeof value === 'string' ? value.split(',').map(Number) : value.map(Number);
    } else {
      finalValue = value;
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    setMensagem({ tipo: '', texto: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação mínima
    if (!formData.nome || !formData.genero) {
      setMensagem({
        tipo: 'error',
        texto: 'Por favor, preencha os campos obrigatórios: nome e gênero.',
      });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === 'foto' && formData.foto) {
            data.append('foto', formData.foto);
          } else if (key === 'DepartamentosIds' || key === 'CargosIds') {
            formData[key].forEach((id) => data.append(`${key}[]`, id));
          } else {
            data.append(key, formData[key]);
          }
        }
      });

      let res;
      if (membroData && membroData.id) {
        res = await api.put(`/membros/${membroData.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await api.post('/membros', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setMensagem({
        tipo: 'success',
        texto: res.data.message || (membroData ? 'Membro atualizado com sucesso!' : 'Membro cadastrado com sucesso!'),
      });

      if (!membroData) {
        setFormData({
          nome: '',
          foto: null,
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
          batizado: false,
          data_batismo: '',
          ativo: true,
          CargosIds: [],
          DepartamentosIds: [],
          habilitacoes: '',
          especialidades: '',
          estudo_teologico: '',
          local_formacao: '',
          profissao: '',
          consagrado: false,
          data_consagracao: '',
          categoria_ministerial: '',
          trabalha: false,
          conta_outrem: false,
          conta_propria: false,
        });
        setPreviewFoto(null);
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Erro ao salvar membro:', err.response?.data || err.message);
      setMensagem({
        tipo: 'error',
        texto: err.response?.data?.message || 'Erro ao salvar membro.',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectStyles = {
    MenuProps: { PaperProps: { sx: { bgcolor: '#263238', color: 'white' } } },
    sx: { color: 'white' },
  };

  const habilitacoesOptions = [
    'Ensino Primário',
    'Ensino Secundário / Médio',
    'Técnico Profissional',
    'Licenciatura / Universitário',
    'Mestrado',
    'Doutorado',
    'Não sabe',
  ];

  const categoriaMinisterialOptions = [
    'Pastor',
    'Evangelista',
    'Diácono',
    'Presbítero',
    'Missionário',
    'Ancião',
    'Líder de Jovens',
    'Líder de Crianças',
    'Ministro de Louvor',
    'Outro',
  ];

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      sx={{ maxWidth: 800, mx: 'auto', color: 'white' }}
    >
      {mensagem.texto && <Alert severity={mensagem.tipo} sx={{ mb: 2 }}>{mensagem.texto}</Alert>}

      {/* DADOS PESSOAIS */}
      <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#b3e5fc' }}>Dados Pessoais</Typography>
      <Divider sx={{ mb: 2, borderColor: '#b3e5fc' }} />

      <TextField
        fullWidth
        label="Nome *"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        margin="normal"
        required
        InputLabelProps={{ style: { color: '#b3e5fc' } }}
        inputProps={{ style: { color: 'white' } }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          variant="contained"
          component="label"
          sx={{ mr: 2, color: 'white', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
        >
          {formData.foto || previewFoto ? 'Alterar Foto' : 'Selecionar Foto'}
          <input type="file" name="foto" accept="image/*" hidden onChange={handleChange} />
        </Button>
        {previewFoto && (
          <Box
            component="img"
            src={previewFoto}
            alt="Preview da foto"
            sx={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #b3e5fc' }}
          />
        )}
      </Box>

      <TextField
        select
        fullWidth
        label="Gênero *"
        name="genero"
        value={formData.genero}
        onChange={handleChange}
        margin="normal"
        required
        InputLabelProps={{ style: { color: '#b3e5fc' } }}
        inputProps={{ style: { color: 'white' } }}
        SelectProps={selectStyles}
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
        InputLabelProps={{ shrink: true, style: { color: '#b3e5fc' } }}
        inputProps={{ style: { color: 'white' } }}
        margin="normal"
        sx={{ '& .MuiSvgIcon-root': { color: 'white' } }}
      />

      <TextField
        select
        fullWidth
        label="Estado Civil"
        name="estado_civil"
        value={formData.estado_civil}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ style: { color: '#b3e5fc' } }}
        inputProps={{ style: { color: 'white' } }}
        SelectProps={selectStyles}
      >
        <MenuItem value="Solteiro">Solteiro</MenuItem>
        <MenuItem value="Casado">Casado</MenuItem>
        <MenuItem value="Divorciado">Divorciado</MenuItem>
        <MenuItem value="Viúvo">Viúvo</MenuItem>
      </TextField>

      {['bi', 'telefone', 'email', 'endereco_rua', 'endereco_bairro', 'endereco_cidade', 'endereco_provincia'].map((campo) => (
        <TextField
          key={campo}
          fullWidth
          label={campo.charAt(0).toUpperCase() + campo.slice(1).replace('_', ' ')}
          name={campo}
          value={formData[campo]}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ style: { color: '#b3e5fc' } }}
          inputProps={{ style: { color: 'white' } }}
        />
      ))}

      <FormControlLabel
        control={<Checkbox name="ativo" checked={formData.ativo} onChange={handleChange} sx={{ color: 'white' }} />}
        label={<Typography sx={{ color: '#b3e5fc' }}>Ativo</Typography>}
      />

      <TextField
        select
        fullWidth
        label="Cargos"
        name="CargosIds"
        value={formData.CargosIds}
        onChange={handleChange}
        margin="normal"
        SelectProps={{ multiple: true, ...selectStyles }}
        InputLabelProps={{ style: { color: '#b3e5fc' } }}
        inputProps={{ style: { color: 'white' } }}
      >
        {cargos.map((cargo) => (
          <MenuItem key={cargo.id} value={cargo.id}>{cargo.nome}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Departamentos"
        name="DepartamentosIds"
        value={formData.DepartamentosIds}
        onChange={handleChange}
        margin="normal"
        SelectProps={{ multiple: true, ...selectStyles }}
        InputLabelProps={{ style: { color: '#b3e5fc' } }}
        inputProps={{ style: { color: 'white' } }}
      >
        {departamentos.map((dep) => <MenuItem key={dep.id} value={dep.id}>{dep.nome}</MenuItem>)}
      </TextField>

      {/* DADOS CRISTÃOS */}
      <Typography variant="h6" sx={{ mt: 4, mb: 1, color: '#b3e5fc' }}>Dados Cristãos</Typography>
      <Divider sx={{ mb: 2, borderColor: '#b3e5fc' }} />

      <FormControlLabel
        control={<Checkbox name="batizado" checked={formData.batizado} onChange={handleChange} sx={{ color: 'white' }} />}
        label={<Typography sx={{ color: '#b3e5fc' }}>Batizado</Typography>}
      />

      <TextField
        fullWidth
        label="Data do Batismo"
        name="data_batismo"
        type="date"
        value={formData.data_batismo}
        onChange={handleChange}
        InputLabelProps={{ shrink: true, style: { color: '#b3e5fc' } }}
        inputProps={{ style: { color: 'white' } }}
        margin="normal"
        sx={{ '& .MuiSvgIcon-root': { color: 'white' } }}
      />

      <FormControlLabel
        control={<Checkbox name="consagrado" checked={formData.consagrado} onChange={handleChange} sx={{ color: 'white' }} />}
        label={<Typography sx={{ color: '#b3e5fc' }}>Consagrado</Typography>}
      />

      <TextField
        fullWidth
        label="Data de Consagração"
        name="data_consagracao"
        type="date"
        value={formData.data_consagracao}
        onChange={handleChange}
        InputLabelProps={{ shrink: true, style: { color: '#b3e5fc' } }}
        inputProps={{ style: { color: 'white' } }}
        margin="normal"
        sx={{ '& .MuiSvgIcon-root': { color: 'white' } }}
      />

      <TextField
        select
        fullWidth
        label="Categoria Ministerial"
        name="categoria_ministerial"
        value={formData.categoria_ministerial}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ style: { color: '#b3e5fc' } }}
        inputProps={{ style: { color: 'white' } }}
        SelectProps={selectStyles}
      >
        {categoriaMinisterialOptions.map((opt, idx) => (
          <MenuItem key={idx} value={opt}>{opt}</MenuItem>
        ))}
      </TextField>

      {/* DADOS ACADÊMICOS */}
      <Typography variant="h6" sx={{ mt: 4, mb: 1, color: '#b3e5fc' }}>Dados Acadêmicos</Typography>
      <Divider sx={{ mb: 2, borderColor: '#b3e5fc' }} />

      <TextField
        select
        fullWidth
        label="Habilitação"
        name="habilitacoes"
        value={formData.habilitacoes}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ style: { color: '#b3e5fc' } }}
        inputProps={{ style: { color: 'white' } }}
        SelectProps={selectStyles}
      >
        {habilitacoesOptions.map((opt, idx) => (
          <MenuItem key={idx} value={opt}>{opt}</MenuItem>
        ))}
      </TextField>

      {['especialidades', 'estudo_teologico', 'local_formacao', 'profissao'].map((campo) => (
        <TextField
          key={campo}
          fullWidth
          label={campo.charAt(0).toUpperCase() + campo.slice(1).replace('_', ' ')}
          name={campo}
          value={formData[campo]}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ style: { color: '#b3e5fc' } }}
          inputProps={{ style: { color: 'white' } }}
        />
      ))}

      {/* DIVERSOS */}
      <Typography variant="h6" sx={{ mt: 4, mb: 1, color: '#b3e5fc' }}>Diversos</Typography>
      <Divider sx={{ mb: 2, borderColor: '#b3e5fc' }} />

      {['trabalha', 'conta_outrem', 'conta_propria'].map((campo) => (
        <FormControlLabel
          key={campo}
          control={<Checkbox name={campo} checked={formData[campo]} onChange={handleChange} sx={{ color: 'white' }} />}
          label={<Typography sx={{ color: '#b3e5fc' }}>{campo.charAt(0).toUpperCase() + campo.slice(1).replace('_', ' ')}</Typography>}
        />
      ))}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Salvando...' : membroData ? 'Atualizar Membro' : 'Cadastrar Membro'}
      </Button>
    </Box>
  );
}
