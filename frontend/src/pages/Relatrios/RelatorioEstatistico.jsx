import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, FormControl, InputLabel,
  Select, MenuItem, Button, CircularProgress, Table, TableBody,
  TableCell, TableHead, TableRow, Chip, Grid, Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../../api/axiosConfig';
import dayjs from 'dayjs';
import GraficoEstatisticaMembro from '../../components/GraficoEstatisticaMembro';

export default function RelatorioMembros() {
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Filtros recebidos da API ---
  const [generos, setGeneros] = useState([]);
  const [estadosCivis, setEstadosCivis] = useState([]);
  const [profissoes, setProfissoes] = useState([]);
  const [grausAcademicos, setGrausAcademicos] = useState([]);
  const [batizados, setBatizados] = useState([]);
  const [bis, setBis] = useState([]);
  const [idades, setIdades] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [trabalha, setTrabalha] = useState([]);
  const [categoriaMinisterial, setCategoriaMinisterial] = useState([]);

  // --- Valores selecionados ---
  const [selectedGeneros, setSelectedGeneros] = useState([]);
  const [selectedEstadosCivis, setSelectedEstadosCivis] = useState([]);
  const [selectedProfissoes, setSelectedProfissoes] = useState([]);
  const [selectedGrausAcademicos, setSelectedGrausAcademicos] = useState([]);
  const [selectedBatizados, setSelectedBatizados] = useState([]);
  const [selectedBis, setSelectedBis] = useState([]);
  const [selectedIdades, setSelectedIdades] = useState([]);
  const [selectedDepartamentos, setSelectedDepartamentos] = useState([]);
  const [selectedCargos, setSelectedCargos] = useState([]);
  const [selectedTrabalha, setSelectedTrabalha] = useState([]);
  const [selectedCategoriaMinisterial, setSelectedCategoriaMinisterial] = useState([]);

  const [campoGrafico, setCampoGrafico] = useState('generos');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/lista/filtros-membros');
        setGeneros(res.data.generos || []);
        setEstadosCivis(res.data.estadosCivis || []);
        setProfissoes(res.data.profissoes || []);
        setGrausAcademicos(res.data.grausAcademicos || []);
        setBatizados(res.data.batizados || []);
        setBis(res.data.bis || []);
        setIdades(res.data.idades || []);
        setDepartamentos(res.data.departamentos || []);
        setCargos(res.data.cargos || []);
        setTrabalha(res.data.trabalha || []);
        setCategoriaMinisterial(res.data.categoriaMinisterial || []);
      } catch (err) {
        console.error('Erro ao carregar filtros', err);
      }
    })();
  }, []);

  const gerarRelatorio = async () => {
    setLoading(true);
    try {
      const res = await api.post('/lista/membros', {
        generos: selectedGeneros,
        estadosCivis: selectedEstadosCivis,
        profissoes: selectedProfissoes,
        grausAcademicos: selectedGrausAcademicos,
        batizados: selectedBatizados,
        bis: selectedBis,
        idades: selectedIdades,
        departamentos: selectedDepartamentos,
        cargos: selectedCargos,
        trabalha: selectedTrabalha,
        categoriaMinisterial: selectedCategoriaMinisterial
      });
      setMembros(res.data.membros || []);
    } catch (err) {
      console.error('Erro ao gerar relatório', err);
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório de Membros', 14, 18);

    const rows = membros.map(m => [
      m.nome,
      m.genero,
      m.estado_civil,
      m.data_nascimento ? dayjs().diff(dayjs(m.data_nascimento), 'year') : '-',
      m.profissao || '-',
      m.grau_academico || '-',
      m.batizado ? 'Sim' : 'Não',
      m.departamentos ? m.departamentos.join(', ') : '-'
    ]);

    autoTable(doc, {
      head: [['Nome','Gênero','Estado Civil','Idade','Profissão','Grau Acadêmico','Batizado','Departamentos']],
      body: rows,
      startY: 28,
      styles: { fontSize: 10 }
    });

    doc.save('relatorio-membros.pdf');
  };

  const dadosParaGrafico = () => {
    switch (campoGrafico) {
      case 'generos': return generos;
      case 'estadosCivis': return estadosCivis;
      case 'profissoes': return profissoes;
      case 'grausAcademicos': return grausAcademicos;
      case 'batizados': return batizados;
      case 'bis': return bis;
      case 'idades': return idades;
      case 'departamentos': return departamentos.map(d => ({ nome: d.nome, total: d.total }));
      case 'cargos': return cargos.map(c => ({ nome: c.nome, total: c.total }));
      case 'trabalha': return trabalha.map(t => ({ nome: t.nome, total: t.total }));
      case 'categoriaMinisterial': return categoriaMinisterial.map(c => ({ nome: c.nome, total: c.total }));
      default: return [];
    }
  };

  const filtros = [
    { label: 'Gênero', value: selectedGeneros, setValue: setSelectedGeneros, data: generos, render: g => g },
    { label: 'Estado Civil', value: selectedEstadosCivis, setValue: setSelectedEstadosCivis, data: estadosCivis, render: s => s },
    { label: 'Profissão', value: selectedProfissoes, setValue: setSelectedProfissoes, data: profissoes, render: p => p },
    { label: 'Grau Acadêmico', value: selectedGrausAcademicos, setValue: setSelectedGrausAcademicos, data: grausAcademicos, render: g => g },
    { label: 'Batizado', value: selectedBatizados, setValue: setSelectedBatizados, data: batizados, render: b => b ? 'Sim' : 'Não' },
    { label: 'Idade', value: selectedIdades, setValue: setSelectedIdades, data: idades, render: i => i },
    {
      label: 'Departamento',
      value: selectedDepartamentos,
      setValue: setSelectedDepartamentos,
      data: departamentos,
      render: d => {
        const dep = departamentos.find(dep => dep.valor === d);
        return dep ? dep.nome : d;
      }
    },
    {
      label: 'Cargo',
      value: selectedCargos,
      setValue: setSelectedCargos,
      data: cargos,
      render: c => {
        const cargo = cargos.find(cg => cg.valor === c);
        return cargo ? cargo.nome : c;
      }
    },
    {
      label: 'Trabalha',
      value: selectedTrabalha,
      setValue: setSelectedTrabalha,
      data: trabalha,
      render: t => t.nome
    },
    {
      label: 'Categoria Ministerial',
      value: selectedCategoriaMinisterial,
      setValue: setSelectedCategoriaMinisterial,
      data: categoriaMinisterial,
      render: c => c.nome
    }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      p: { xs: 2, md: 6 },
      background: 'linear-gradient(135deg,#6b78ff 0%, #ffffff 100%)',
      display: 'flex', justifyContent: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', maxWidth: 1200 }}
      >
        <Card elevation={15} sx={{ borderRadius: 5, overflow: 'hidden', backdropFilter: 'blur(6px)' }}>
          <Box sx={{ p: 4, background: 'linear-gradient(90deg, #2196f3 0%, #9c27b0 100%)' }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="white"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}
            >
              Relatório de Membros
            </Typography>
          </Box>

          <CardContent>
            {/* Filtros e Botões */}
            <Grid container spacing={2} mb={4} justifyContent="center">
              {filtros.map(filtro => (
                <Grid item xs={12} sm={6} md={3} key={filtro.label}>
                  <FormControl fullWidth sx={{ minWidth: 220 }}>
                    <InputLabel shrink={filtro.value.length > 0}>{filtro.label}</InputLabel>
                    <Select
                      multiple
                      displayEmpty
                      value={filtro.value}
                      onChange={e => filtro.setValue(e.target.value)}
                      renderValue={selected =>
                        selected.length === 0 ? '' : (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map(val =>
                              <Chip key={val} label={filtro.render(val)} color="primary" size="small" />
                            )}
                          </Box>
                        )
                      }
                    >
                      {filtro.data.map(d => (
                        <MenuItem key={d.valor} value={d.valor}>
                          {d.nome || d.valor} {d.total !== undefined ? `(${d.total})` : ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))}

              {/* Botões Gerar/Exportar */}
              <Grid item xs={12} sm={6} md={3} display="flex" alignItems="center">
                <Button
                  variant="contained"
                  onClick={gerarRelatorio}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(90deg,#6b78ff,#9c27b0)',
                    color: 'white', fontWeight: 'bold', px: 4,
                    '&:hover': { background: 'linear-gradient(90deg,#5a68e5,#8e24aa)' }
                  }}
                >
                  Gerar Relatório
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={3} display="flex" alignItems="center">
                <Button
                  variant="outlined"
                  onClick={exportarPDF}
                  disabled={!membros.length}
                  fullWidth
                  sx={{
                    borderColor: '#6b78ff', color: '#6b78ff', fontWeight: 'bold', px: 4,
                    '&:hover': { background: 'rgba(107,120,255,0.1)', borderColor: '#5a68e5' }
                  }}
                >
                  Exportar PDF
                </Button>
              </Grid>
            </Grid>

            {/* Loading */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={50} />
              </Box>
            )}

            {/* Tabela de membros (8 colunas) */}
            {!loading && membros.length > 0 && (
              <Box sx={{ mb: 4, background: '#fff', borderRadius: 4, p: 3, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}>
                <Table>
                  <TableHead sx={{ background: 'linear-gradient(90deg,#6b78ff,#9c27b0)' }}>
                    <TableRow>
                      {['Foto','Nome','Gênero','Estado Civil','Idade','Profissão','Grau Acadêmico','Batizado']
                        .map(head => (
                          <TableCell key={head} sx={{ color: '#fff', fontWeight: 'bold' }}>{head}</TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {membros.map(m => (
                      <TableRow
                        key={m.id}
                        sx={{ '&:hover': { backgroundColor: '#f3f3f3', transform: 'scale(1.01)', transition: '0.3s' } }}
                      >
                        <TableCell>
                          {m.foto ? (
                            <Avatar
                              src={m.foto}
                              alt={m.nome}
                              sx={{ width: 80, height: 80, border: '3px solid #6b78ff' }}
                            />
                          ) : '-'}
                        </TableCell>
                        <TableCell>{m.nome}</TableCell>
                        <TableCell>{m.genero}</TableCell>
                        <TableCell>{m.estado_civil}</TableCell>
                        <TableCell>{m.data_nascimento ? dayjs().diff(dayjs(m.data_nascimento), 'year') : '-'}</TableCell>
                        <TableCell>{m.profissao || '-'}</TableCell>
                        <TableCell>{m.grau_academico || '-'}</TableCell>
                        <TableCell>{m.batizado ? 'Sim' : 'Não'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}

            {/* Gráfico */}
            {!loading && membros.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                      <InputLabel shrink={true}>Campo para gráfico</InputLabel>
                      <Select
                        value={campoGrafico}
                        onChange={e => setCampoGrafico(e.target.value)}
                      >
                        <MenuItem value="generos">Gênero</MenuItem>
                        <MenuItem value="estadosCivis">Estado Civil</MenuItem>
                        <MenuItem value="profissoes">Profissão</MenuItem>
                        <MenuItem value="grausAcademicos">Grau Acadêmico</MenuItem>
                        <MenuItem value="batizados">Batizado</MenuItem>
                        <MenuItem value="idades">Idade</MenuItem>
                        <MenuItem value="departamentos">Departamento</MenuItem>
                        <MenuItem value="cargos">Cargo</MenuItem>
                        <MenuItem value="trabalha">Trabalha</MenuItem>
                        <MenuItem value="categoriaMinisterial">Categoria Ministerial</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <GraficoEstatisticaMembro dados={dadosParaGrafico()} campo={campoGrafico} />
              </Box>
            )}

          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
