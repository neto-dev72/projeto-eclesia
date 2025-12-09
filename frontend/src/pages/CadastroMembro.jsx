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
  Divider,
  ListItemText,
  Card,
  Grid,
  Avatar
} from '@mui/material';
import api from '../api/axiosConfig';

export default function MeuMembro() {
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
  const [membroId, setMembroId] = useState(null);
  const [cargosOpen, setCargosOpen] = useState(false);
  const [departamentosOpen, setDepartamentosOpen] = useState(false);

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
    'Pastor Presidente',
    'Evangelista',
    'Diácono',
    'Diaconiza',
    'Presbítero',
    'Missionário',
    'Ancião',
    'Outro',
  ];

  const selectStyles = {
    MenuProps: { PaperProps: { sx: { bgcolor: '#263238', color: 'black', minWidth: 250 } } },
    sx: { color: 'white', minWidth: 250 },
  };

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const res = await api.get('/cargos');
        setCargos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchDepartamentos = async () => {
      try {
        const res = await api.get('/departamentos');
        setDepartamentos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCargos();
    fetchDepartamentos();
  }, []);

  useEffect(() => {
    const fetchMeuMembro = async () => {
      try {
        const res = await api.get('/meu-membro-detalhado');
        if (res.data.existe) {
          const { membro } = res.data;
          setMembroId(membro.id);
          const dadosAcademicos = membro.dadosAcademicos?.[0] || {};
          const dadosCristaos = membro.dadosCristaos?.[0] || {};
          const diversos = membro.diversos?.[0] || {};

          setFormData((prev) => ({
            ...prev,
            nome: membro.nome || '',
            genero: membro.genero || '',
            data_nascimento: membro.data_nascimento || '',
            estado_civil: membro.estado_civil || '',
            bi: membro.bi || '',
            telefone: membro.telefone || '',
            email: membro.email || '',
            endereco_rua: membro.endereco_rua || '',
            endereco_bairro: membro.endereco_bairro || '',
            endereco_cidade: membro.endereco_cidade || '',
            endereco_provincia: membro.endereco_provincia || '',
            ativo: membro.ativo ?? true,
            habilitacoes: dadosAcademicos.habilitacoes || '',
            especialidades: dadosAcademicos.especialidades || '',
            estudo_teologico: dadosAcademicos.estudo_teologico || '',
            local_formacao: dadosAcademicos.local_formacao || '',
            profissao: membro.profissao || '',
            batizado: membro.batizado || false,
            data_batismo: membro.data_batismo || '',
            consagrado: dadosCristaos.consagrado || false,
            data_consagracao: dadosCristaos.data_consagracao || '',
            categoria_ministerial: dadosCristaos.categoria_ministerial || '',
            trabalha: diversos.trabalha || false,
            conta_outrem: diversos.conta_outrem || false,
            conta_propria: diversos.conta_propria || false,
            CargosIds: membro.cargos?.map(c => c.id) || [],
            DepartamentosIds: membro.departamentos?.map(d => d.id) || [],
          }));

          if (membro.foto) setPreviewFoto(membro.foto);
        }
      } catch (err) {
        console.error(err);
        setMensagem({ tipo: 'error', texto: 'Erro ao carregar seus dados.' });
      }
    };
    fetchMeuMembro();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let finalValue;
    if (type === 'checkbox') finalValue = checked;
    else if (name === 'foto') {
      finalValue = files[0] || null;
      if (files[0]) setPreviewFoto(URL.createObjectURL(files[0]));
    } else if (name === 'CargosIds' || name === 'DepartamentosIds') {
      finalValue = typeof value === 'string' ? value.split(',').map(Number) : value.map(Number);
    } else finalValue = value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    setMensagem({ tipo: '', texto: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === 'foto' && formData.foto) data.append('foto', formData.foto);
          else if (key === 'DepartamentosIds' || key === 'CargosIds')
            formData[key].forEach(id => data.append(`${key}[]`, id));
          else data.append(key, formData[key]);
        }
      });

      let res;
      if (membroId) {
        res = await api.put(`/membros/${membroId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        res = await api.post('/membros2', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setMensagem({ tipo: 'success', texto: res.data.message || 'Dados salvos com sucesso!' });
    } catch (err) {
      console.error(err);
      setMensagem({ tipo: 'error', texto: err.response?.data?.message || 'Erro ao salvar dados.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 950, mx: 'auto', my: 5 }}>
      {mensagem.texto && <Alert severity={mensagem.tipo} sx={{ mb: 3, borderRadius: 2 }}>{mensagem.texto}</Alert>}

      <form onSubmit={handleSubmit}>
        {/* Foto e Nome */}
        <Card sx={{
          mb: 4,
          p: 4,
          background: 'linear-gradient(145deg,#1b2630,#1f2c3a)',
          color: 'white',
          borderRadius: 4,
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Avatar src={previewFoto} alt="Foto do Membro" sx={{ width: 120, height: 120, border: '3px solid #4fc3f7' }} />
            <Box sx={{ flex: 1 }}>
              <TextField fullWidth label="Nome *" name="nome" value={formData.nome} onChange={handleChange} required
                InputLabelProps={{ style: { color: '#4fc3f7' } }} inputProps={{ style: { color: 'white' } }}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" component="label" sx={{ color: 'white', backgroundColor: '#4fc3f7', '&:hover': { backgroundColor: '#29b6f6' } }}>
                {previewFoto ? 'Alterar Foto' : 'Selecionar Foto'}
                <input type="file" name="foto" accept="image/*" hidden onChange={handleChange} />
              </Button>
            </Box>
          </Box>
        </Card>

        <Grid container spacing={4}>

          {/* Dados Pessoais */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 4, background: '#1b2630', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' }}>
              <Typography variant="h6" sx={{ color: '#4fc3f7', mb: 2 }}>Dados Pessoais</Typography>
              <Divider sx={{ mb: 2, borderColor: '#4fc3f7' }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Gênero *" select name="genero" value={formData.genero} onChange={handleChange}
                    InputLabelProps={{ style: { color: '#4fc3f7' } }} inputProps={{ style: { color: 'white' } }} SelectProps={{
                      ...selectStyles,
                      renderValue: selected => selected || 'Selecione...'
                    }} required
                  >
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="Feminino">Feminino</MenuItem>
                    <MenuItem value="Outro">Outro</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Data de Nascimento" type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange}
                    InputLabelProps={{ shrink: true, style: { color: '#4fc3f7' } }} inputProps={{ style: { color: 'white' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Estado Civil" select name="estado_civil" value={formData.estado_civil} onChange={handleChange}
                    InputLabelProps={{ style: { color: '#4fc3f7' } }} inputProps={{ style: { color: 'white' } }} SelectProps={{
                      ...selectStyles,
                      renderValue: selected => selected || 'Selecione...'
                    }}
                  >
                    <MenuItem value="Solteiro">Solteiro</MenuItem>
                    <MenuItem value="Casado">Casado</MenuItem>
                    <MenuItem value="Divorciado">Divorciado</MenuItem>
                    <MenuItem value="Viúvo">Viúvo</MenuItem>
                  </TextField>
                </Grid>

                {['bi', 'telefone', 'email', 'endereco_rua', 'endereco_bairro', 'endereco_cidade', 'endereco_provincia'].map(campo => (
                  <Grid item xs={12} md={6} key={campo}>
                    <TextField fullWidth label={campo.charAt(0).toUpperCase() + campo.slice(1).replace('_', ' ')} name={campo} value={formData[campo]} onChange={handleChange}
                      InputLabelProps={{ style: { color: '#4fc3f7' } }} inputProps={{ style: { color: 'white' } }}
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <FormControlLabel control={<Checkbox name="ativo" checked={formData.ativo} onChange={handleChange} sx={{ color: '#4fc3f7' }} />}
                    label={<Typography sx={{ color: '#4fc3f7' }}>Ativo</Typography>} />
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Dados Cristãos */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 4, background: '#1b2630', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' }}>
              <Typography variant="h6" sx={{ color: '#4fc3f7', mb: 2 }}>Dados Cristãos</Typography>
              <Divider sx={{ mb: 2, borderColor: '#4fc3f7' }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel control={<Checkbox name="batizado" checked={formData.batizado} onChange={handleChange} sx={{ color: '#4fc3f7' }} />}
                    label={<Typography sx={{ color: '#4fc3f7' }}>Batizado</Typography>} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Data do Batismo" type="date" name="data_batismo" value={formData.data_batismo} onChange={handleChange}
                    InputLabelProps={{ shrink: true, style: { color: '#4fc3f7' } }} inputProps={{ style: { color: 'white' } }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel control={<Checkbox name="consagrado" checked={formData.consagrado} onChange={handleChange} sx={{ color: '#4fc3f7' }} />}
                    label={<Typography sx={{ color: '#4fc3f7' }}>Consagrado</Typography>} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Data de Consagração" type="date" name="data_consagracao" value={formData.data_consagracao} onChange={handleChange}
                    InputLabelProps={{ shrink: true, style: { color: '#4fc3f7' } }} inputProps={{ style: { color: 'white' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField select fullWidth label="Categoria Ministerial" name="categoria_ministerial" value={formData.categoria_ministerial} onChange={handleChange}
                    InputLabelProps={{ style: { color: '#4fc3f7' } }} inputProps={{ style: { color: 'white' } }} SelectProps={{
                      ...selectStyles,
                      renderValue: selected => selected || 'Selecione...'
                    }}
                  >
                    {categoriaMinisterialOptions.map((opt, idx) => <MenuItem key={idx} value={opt}>{opt}</MenuItem>)}
                  </TextField>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Dados Acadêmicos */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 4, background: '#1b2630', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' }}>
              <Typography variant="h6" sx={{ color: '#4fc3f7', mb: 2 }}>Dados Acadêmicos</Typography>
              <Divider sx={{ mb: 2, borderColor: '#4fc3f7' }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField select fullWidth label="Habilitação" name="habilitacoes" value={formData.habilitacoes} onChange={handleChange}
                    InputLabelProps={{ style: { color: '#4fc3f7' } }} inputProps={{ style: { color: 'white' } }} SelectProps={{
                      ...selectStyles,
                      renderValue: selected => selected || 'Selecione...'
                    }}
                  >
                    {habilitacoesOptions.map((opt, idx) => <MenuItem key={idx} value={opt}>{opt}</MenuItem>)}
                  </TextField>
                </Grid>
                {['especialidades', 'estudo_teologico', 'local_formacao', 'profissao'].map(campo => (
                  <Grid item xs={12} md={6} key={campo}>
                    <TextField fullWidth label={campo.charAt(0).toUpperCase() + campo.slice(1).replace('_', ' ')} name={campo} value={formData[campo]} onChange={handleChange}
                      InputLabelProps={{ style: { color: '#4fc3f7' } }} inputProps={{ style: { color: 'white' } }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>

          {/* Cargos e Departamentos */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 4, background: '#1b2630', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' }}>
              <Typography variant="h6" sx={{ color: '#4fc3f7', mb: 2 }}>Cargos e Departamentos</Typography>
              <Divider sx={{ mb: 2, borderColor: '#4fc3f7' }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField select fullWidth label="Cargos" name="CargosIds" value={formData.CargosIds} onChange={handleChange} margin="normal"
                    SelectProps={{
                      multiple: true,
                      ...selectStyles,
                      open: cargosOpen,
                      onOpen: () => setCargosOpen(true),
                      onClose: () => setCargosOpen(false),
                      renderValue: selected => selected.length > 0 ? selected.map(id => cargos.find(c => c.id === id)?.nome).join(', ') : 'Selecione...',
                      MenuProps: { PaperProps: { sx: { bgcolor: '#263238', color: 'black', minWidth: 250 } } }
                    }}
                  >
                    {cargos.map(c => <MenuItem key={c.id} value={c.id}><ListItemText primary={c.nome} /></MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField select fullWidth label="Departamentos" name="DepartamentosIds" value={formData.DepartamentosIds} onChange={handleChange} margin="normal"
                    SelectProps={{
                      multiple: true,
                      ...selectStyles,
                      open: departamentosOpen,
                      onOpen: () => setDepartamentosOpen(true),
                      onClose: () => setDepartamentosOpen(false),
                      renderValue: selected => selected.length > 0 ? selected.map(id => departamentos.find(d => d.id === id)?.nome).join(', ') : 'Selecione...',
                      MenuProps: { PaperProps: { sx: { bgcolor: '#263238', color: 'black', minWidth: 250 } } }
                    }}
                  >
                    {departamentos.map(d => <MenuItem key={d.id} value={d.id}><ListItemText primary={d.nome} /></MenuItem>)}
                  </TextField>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Diversos */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 4, background: '#1b2630', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' }}>
              <Typography variant="h6" sx={{ color: '#4fc3f7', mb: 2 }}>Diversos</Typography>
              <Divider sx={{ mb: 2, borderColor: '#4fc3f7' }} />
              <Grid container spacing={2}>
                {['trabalha', 'conta_outrem', 'conta_propria'].map(campo => (
                  <Grid item xs={12} md={4} key={campo}>
                    <FormControlLabel control={<Checkbox name={campo} checked={formData[campo]} onChange={handleChange} sx={{ color: '#4fc3f7' }} />}
                      label={<Typography sx={{ color: '#4fc3f7' }}>{campo.replace('_', ' ')}</Typography>} />
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        </Grid>

        {/* Botão */}
        <Box sx={{ mt: 5 }}>
          <Button type="submit" variant="contained" fullWidth sx={{
            py: 1.5,
            fontSize: '1.1rem',
            backgroundColor: '#4fc3f7',
            '&:hover': { backgroundColor: '#29b6f6' },
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            borderRadius: 3
          }} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : null}>
            {loading ? 'Salvando...' : membroId ? 'Atualizar Dados' : 'Cadastrar Dados'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
