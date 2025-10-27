// pages/GestaoCultos.jsx
import React, { useEffect, useMemo, useState } from "react";
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
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Divider,
  Chip,
  Zoom,
  Fade,
  Slide,
  CssBaseline,
  Switch,
  FormControlLabel,
  Stack,
  useTheme,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";

import { motion } from "framer-motion";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

import api from "../../api/axiosConfig";
import FormCultos from "../../components/FormCultos";
import FormTipoCulto from "../../components/FormTipoCulto";

/* ===========================
   Styled / Helpers
   =========================== */

const GlassAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: 16,
  overflow: "hidden",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))"
      : "linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.55))",
  backdropFilter: "blur(10px)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 10px 40px rgba(2,6,23,0.6)"
      : "0 12px 40px rgba(15,23,42,0.06)",
  transition: "transform 300ms ease, box-shadow 300ms ease",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 20px 60px rgba(2,6,23,0.75)"
        : "0 20px 60px rgba(15,23,42,0.12)",
  },
  "&:before": { display: "none" }, // remove default divider
}));

const NeonTimelineDot = styled(TimelineDot)(({ theme, colorindex }) => {
  const colors = [
    "linear-gradient(135deg,#6a11cb,#2575fc)",
    "linear-gradient(135deg,#00d4ff,#5b86e5)",
    "linear-gradient(135deg,#ff6a88,#ff99ac)",
  ];
  const bg = colors[colorindex % colors.length];
  return {
    boxShadow: "0 6px 26px rgba(0,0,0,0.45), 0 0 18px rgba(90,72,234,0.2)",
    background: bg,
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.06)",
  };
});

/* ===========================
   Main Component
   =========================== */

export default function GestaoCultos() {
  // data
  const [cultos, setCultos] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCultos, setFilteredCultos] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI controls
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openFormTipoModal, setOpenFormTipoModal] = useState(false);
  const [cultoEditando, setCultoEditando] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // theme mode
  const [mode, setMode] = useState("dark");

  // load Google font (Poppins) dynamically once
  useEffect(() => {
    if (!document.getElementById("gf-poppins")) {
      const link = document.createElement("link");
      link.id = "gf-poppins";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // Theme (premium palette)
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                primary: { main: "#7c4dff" }, // roxo neon
                secondary: { main: "#00d4ff" }, // ciano
                background: { default: "#080913", paper: "#0c1117" },
                text: { primary: "#e6eef8", secondary: "rgba(230,238,248,0.7)" },
              }
            : {
                primary: { main: "#0f52ba" }, // premium blue for light
                secondary: { main: "#7b61ff" },
                background: { default: "#f5f8ff", paper: "#ffffff" },
                text: { primary: "#072146", secondary: "rgba(7,33,70,0.7)" },
              }),
        },
        typography: {
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          h4: { fontWeight: 800 },
          h6: { fontWeight: 700 },
        },
        components: {
          MuiButton: {
            defaultProps: { disableElevation: true },
          },
        },
      }),
    [mode]
  );

  // fetch
  useEffect(() => {
    fetchCultos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCultos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cultos");
      setCultos(res.data || []);
      setFilteredCultos(res.data || []);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Erro ao carregar cultos.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // search filter
  useEffect(() => {
    if (!search) setFilteredCultos(cultos);
    else {
      const q = search.toLowerCase();
      setFilteredCultos(cultos.filter((c) => (c.tipoCulto || "").toLowerCase().includes(q)));
    }
  }, [search, cultos]);

  // open modals
  const abrirModalNovoCulto = () => {
    setCultoEditando(null);
    setOpenFormModal(true);
  };
  const abrirModalEditarCulto = async (culto) => {
  try {
    const res = await api.get(`/detalhes-cultos/${culto.id}`);
    setCultoEditando(res.data);
    setOpenFormModal(true);
  } catch (err) {
    console.error("Erro ao buscar detalhes do culto:", err);
    setSnackbar({ open: true, message: "Erro ao carregar detalhes do culto.", severity: "error" });
  }
};
;
  const abrirModalNovoTipoCulto = () => setOpenFormTipoModal(true);

  // delete
  const deletarCulto = async (id) => {
    try {
      await api.delete(`/detalhes-cultos/${id}`);
      await fetchCultos();
      setSnackbar({ open: true, message: "Culto excluído com sucesso.", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Erro ao excluir culto.", severity: "error" });
    }
  };

  // close snackbar
  const closeSnack = () => setSnackbar((s) => ({ ...s, open: false }));

  // motion variants
  const containerVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
  };
  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          py: 8,
          px: { xs: 2, md: 6 },
          background:
            mode === "dark"
              ? "radial-gradient(800px 300px at 10% 10%, rgba(124,77,255,0.06), transparent), linear-gradient(180deg, rgba(0,0,0,0.6), rgba(6,10,20,0.6))"
              : "radial-gradient(800px 300px at 90% 10%, rgba(15,82,186,0.06), transparent), linear-gradient(180deg, rgba(245,248,255,0.9), rgba(255,255,255,0.9))",
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box
            sx={{
              mb: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <Typography variant="h4" sx={{ mb: 0.5 }}>
                  <Box component="span" sx={{ color: "text.primary", fontWeight: 800 }}>
                    Gestão
                  </Box>{" "}
                  <Box component="span" sx={{ background: "linear-gradient(90deg,#7c4dff,#00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 900 }}>
                    de Cultos
                  </Box>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Painel premium — controle tipos, horários, presenças e histórico de cultos.
                </Typography>
              </motion.div>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === "dark"}
                    onChange={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
                    icon={<Brightness7Icon />}
                    checkedIcon={<Brightness4Icon />}
                    color="secondary"
                  />
                }
                label={mode === "dark" ? "Dark" : "Light"}
                sx={{ mr: 0 }}
              />

              <motion.div whileHover={{ scale: 1.03 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={abrirModalNovoCulto}
                  sx={{
                    borderRadius: 12,
                    textTransform: "none",
                    px: 3,
                    py: 1.05,
                    fontWeight: 700,
                    boxShadow: mode === "dark" ? "0 8px 28px rgba(124,77,255,0.18)" : "0 8px 28px rgba(15,82,186,0.12)",
                    background: mode === "dark" ? "linear-gradient(90deg,#7c4dff,#00d4ff)" : "linear-gradient(90deg,#0f52ba,#7b61ff)",
                  }}
                >
                  Novo Culto
                </Button>
              </motion.div>
            </Stack>
          </Box>

          {/* Controls */}
          <Slide in direction="down" timeout={600}>
            <Box sx={{ display: "flex", gap: 2, mb: 4, alignItems: "center" }}>
              <TextField
                placeholder="Buscar por tipo de culto..."
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ sx: { borderRadius: 12 } }}
                sx={{
                  background: mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)",
                  "& .MuiInputBase-input": { color: "text.primary" },
                }}
              />
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={abrirModalNovoTipoCulto}
                sx={{
                  borderRadius: 12,
                  px: 2.5,
                  textTransform: "none",
                  borderWidth: 2,
                  color: "text.primary",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: mode === "dark" ? "0 8px 24px rgba(0,212,255,0.08)" : "0 8px 24px rgba(15,82,186,0.06)",
                  },
                }}
              >
                Novo Tipo
              </Button>
            </Box>
          </Slide>

          {/* Content */}
          {loading ? (
            <Box sx={{ textAlign: "center", py: 12 }}>
              <CircularProgress size={68} thickness={5} />
            </Box>
          ) : filteredCultos.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography variant="h6" color="text.secondary">
                Nenhum culto encontrado.
              </Typography>
            </Box>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              {filteredCultos.map((grupo, index) => (
                <motion.div key={grupo.tipoCulto || index} variants={itemVariant}>
                  <Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
                    <GlassAccordion sx={{ mb: 3 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.mode === "dark" ? "#e6eef8" : "#072146" }} />}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              {grupo.tipoCulto || "Culto sem tipo"}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
                              <Chip
                                label={`Total Contribuições: ${Number(grupo.totalContribuicoes || 0).toFixed(2)} Kz`}
                                size="small"
                                sx={{
                                  fontWeight: 700,
                                  background: mode === "dark" ? "rgba(46,204,113,0.08)" : "rgba(46,204,113,0.12)",
                                  color: mode === "dark" ? "#2ecc71" : "#1b6b3a",
                                  borderRadius: 8,
                                }}
                              />
                            </Box>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Tooltip title="Detalhes do Grupo">
                              <IconButton sx={{ color: "primary.main" }}>
                                <InfoIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails>
                        {/* estatísticas */}
                        <Typography variant="body2" color="text.secondary">
                          Presença Máxima:{" "}
                          <b style={{ color: "#2ecc71" }}>{grupo.presencaMax || "N/D"}</b>{" "}
                          | Presença Mínima: <b style={{ color: "#ff6b6b" }}>{grupo.presencaMin || "N/D"}</b>
                        </Typography>

                        <Box sx={{ my: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                            Perfil de Presenças (%)
                          </Typography>

                          <Typography variant="caption">Homens {grupo.percentuaisPresencas?.homens || 0}%</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={parseFloat(grupo.percentuaisPresencas?.homens) || 0}
                            sx={{ height: 10, borderRadius: 6, my: 1 }}
                            color="primary"
                          />

                          <Typography variant="caption">Mulheres {grupo.percentuaisPresencas?.mulheres || 0}%</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={parseFloat(grupo.percentuaisPresencas?.mulheres) || 0}
                            sx={{ height: 10, borderRadius: 6, my: 1 }}
                            color="secondary"
                          />

                          <Typography variant="caption">Crianças {grupo.percentuaisPresencas?.criancas || 0}%</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={parseFloat(grupo.percentuaisPresencas?.criancas) || 0}
                            sx={{ height: 10, borderRadius: 6, my: 1 }}
                            color="success"
                          />
                        </Box>

                        <Divider sx={{ my: 2, borderColor: mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)" }} />

                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
                          Cultos Realizados
                        </Typography>

                        <Timeline position="alternate">
                          {Array.isArray(grupo.cultos) && grupo.cultos.map((c, i) => (
                            <TimelineItem key={c.id || i}>
                              <TimelineOppositeContent color="text.secondary" sx={{ m: "auto 0" }}>
                                {new Date(c.dataHora).toLocaleDateString()}
                              </TimelineOppositeContent>

                              <TimelineSeparator>
                                <NeonTimelineDot colorindex={i}>
                                  <EventIcon sx={{ fontSize: 16 }} />
                                </NeonTimelineDot>
                                {i < (grupo.cultos.length - 1) && <TimelineConnector sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />}
                              </TimelineSeparator>

                              <TimelineContent sx={{ py: "12px", px: 2 }}>
                                <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    background: mode === "dark" ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))" : "rgba(255,255,255,0.9)",
                                    boxShadow: mode === "dark" ? "0 8px 30px rgba(2,6,23,0.6)" : "0 6px 20px rgba(15,23,42,0.06)",
                                    transition: "transform 220ms ease",
                                    "&:hover": { transform: "translateY(-4px)" },
                                  }}
                                >
                                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{new Date(c.dataHora).toLocaleTimeString()}</Typography>
                                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
                                    <PlaceIcon fontSize="small" /> {c.local || "Não informado"}
                                  </Typography>
                                  <Typography variant="caption" display="block" color="text.secondary">
                                    <PersonIcon fontSize="small" /> {c.responsavel || "N/D"}
                                  </Typography>

                                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                                    <Tooltip title="Editar">
                                      <IconButton size="small" onClick={() => abrirModalEditarCulto(c)}>
                                        <EditIcon color="primary" fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                      <IconButton size="small" onClick={() => deletarCulto(c.id)}>
                                        <DeleteIcon color="error" fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Box>
                              </TimelineContent>
                            </TimelineItem>
                          ))}
                        </Timeline>
                      </AccordionDetails>
                    </GlassAccordion>
                  </Zoom>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Dialog - Form Culto */}
          <Dialog open={openFormModal} onClose={() => setOpenFormModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 800, background: mode === "dark" ? "linear-gradient(90deg,#0f1724,#0b1020)" : undefined }}>
              {cultoEditando ? "Editar Culto" : "Cadastrar Culto"}
            </DialogTitle>
            <DialogContent dividers>
              <FormCultos
                culto={cultoEditando}
                onSuccess={() => {
                  setOpenFormModal(false);
                  fetchCultos();
                  setSnackbar({ open: true, message: `Culto ${cultoEditando ? "editado" : "criado"} com sucesso!`, severity: "success" });
                }}
                onCancel={() => setOpenFormModal(false)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenFormModal(false)} color="inherit">Cancelar</Button>
            </DialogActions>
          </Dialog>

          {/* Dialog - Tipo Culto */}
          <Dialog open={openFormTipoModal} onClose={() => setOpenFormTipoModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Cadastrar Novo Tipo de Culto</DialogTitle>
            <DialogContent dividers>
              <FormTipoCulto
                onSuccess={() => {
                  setOpenFormTipoModal(false);
                  fetchCultos();
                  setSnackbar({ open: true, message: "Tipo de culto cadastrado com sucesso!", severity: "success" });
                }}
                onCancel={() => setOpenFormTipoModal(false)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenFormTipoModal(false)} color="inherit">Cancelar</Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar open={snackbar.open} autoHideDuration={4200} onClose={closeSnack} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
            <Alert onClose={closeSnack} severity={snackbar.severity} sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
