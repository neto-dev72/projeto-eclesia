// GestaoIgrejas.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Modal,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Stack,
  CssBaseline,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Slide,
  Fade,
} from "@mui/material";
import {
  Check,
  Block,
  Pause,
  Add,
  ExpandMore,
  Brightness4,
  Brightness7,
  Close,   // ✅ adicionado aqui do icons-material
} from "@mui/icons-material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import api from "../api/axiosConfig";
import CadastrarIgrejaDono from "../components/CadastrarIgrejaDono";


/**
 * Visual premium:
 * - Glassmorphism cards
 * - Dark/Light theme toggle
 * - Gradientes no topo
 * - Animações suaves com Fade/Slide
 * - Snackbars para feedback
 *
 * Substitua diretamente o seu arquivo por este. Mantive os nomes em pt-br.
 */

/* ---------- Styled helpers ---------- */
const GlassCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))"
      : "rgba(255,255,255,0.60)",
  backdropFilter: "blur(8px)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 30px rgba(2,6,23,0.6)"
      : "0 10px 30px rgba(15,23,42,0.08)",
  transition: "transform 250ms ease, box-shadow 250ms ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 14px 45px rgba(2,6,23,0.75)"
        : "0 20px 50px rgba(15,23,42,0.12)",
  },
}));

const GradientHeader = styled(Box)(({ theme }) => ({
  borderRadius: 18,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(90deg, rgba(63,81,181,0.18), rgba(156,39,176,0.12))"
      : "linear-gradient(90deg, rgba(63,81,181,0.12), rgba(33,150,243,0.12))",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

/* ---------- Main component ---------- */
export default function GestaoIgrejas() {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalFilhalOpen, setModalFilhalOpen] = useState(false);
  const [selectedSede, setSelectedSede] = useState(null);

  const [modalSedeOpen, setModalSedeOpen] = useState(false);
  const [novaSede, setNovaSede] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
  });

  // theme mode
  const [mode, setMode] = useState("dark");

  // snackbars
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchSedes();
    // eslint-disable-next-line
  }, []);

  const fetchSedes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sedes-com-filhais");
      setSedes(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar sedes e filiais.");
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

      setSedes((prev) =>
        prev.map((sede) => {
          if (tipo === "sedes" && sede.id === id) return { ...sede, status: novoStatus };

          if (sede.Filhals) {
            return {
              ...sede,
              Filhals: sede.Filhals.map((f) =>
                tipo === "filhais" && f.id === id ? { ...f, status: novoStatus } : f
              ),
            };
          }

          return sede;
        })
      );

      setSnack({ open: true, message: "Status atualizado com sucesso.", severity: "success" });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      setSnack({ open: true, message: "Erro ao atualizar status.", severity: "error" });
    }
  };

  const statusProps = {
    ativo: { label: "Ativo", color: "success", icon: <Check /> },
    pendente: { label: "Pendente", color: "warning", icon: <Pause /> },
    bloqueado: { label: "Bloqueado", color: "error", icon: <Block /> },
  };

  const handleNovaSedeChange = (e) => {
    setNovaSede({ ...novaSede, [e.target.name]: e.target.value });
  };

  const handleNovaSedeSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/sedes", novaSede);
      setSedes((prev) => [...prev, res.data]);
      setNovaSede({ nome: "", endereco: "", telefone: "", email: "" });
      handleCloseSedeModal();
      setSnack({ open: true, message: "Sede cadastrada com sucesso.", severity: "success" });
    } catch (err) {
      console.error("Erro ao cadastrar sede:", err);
      setSnack({ open: true, message: "Erro ao cadastrar sede.", severity: "error" });
    }
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#0f52ba" }, // azul premium
                background: { default: "#f6f9ff", paper: "#ffffff" },
                text: { primary: "#072146" },
              }
            : {
                primary: { main: "#8ab4f8" },
                background: { default: "#0b1020", paper: "#0f1724" },
                text: { primary: "#e6eef8" },
              }),
        },
        typography: {
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          h3: { fontWeight: 800 },
          h5: { fontWeight: 700 },
        },
        components: {
          MuiButton: {
            defaultProps: { disableElevation: true },
          },
        },
      }),
    [mode]
  );

  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  /* ---------- UI ---------- */
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          py: 6,
          px: { xs: 2, sm: 4 },
          background: mode === "dark"
            ? "radial-gradient(1200px 400px at 10% 10%, rgba(63,81,181,0.06), transparent), linear-gradient(180deg, rgba(0,0,0,0.25), transparent)"
            : "radial-gradient(1200px 400px at 90% 20%, rgba(33,150,243,0.06), transparent), linear-gradient(180deg, rgba(255,255,255,0.6), transparent)",
        }}
      >
        <Container maxWidth="lg">
          <GradientHeader>
            <Box>
              <Fade in>
                <Typography variant="h3" sx={{ lineHeight: 1 }}>
                  Gestão de <Box component="span" sx={{ color: "primary.main" }}>Igrejas</Box>
                </Typography>
              </Fade>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Painel premium — gerencie sedes e filiais com rapidez e estilo.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === "dark"}
                    onChange={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
                    icon={<Brightness7 />}
                    checkedIcon={<Brightness4 />}
                  />
                }
                label={mode === "dark" ? "Dark" : "Light"}
                sx={{ mr: 2 }}
              />

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenSedeModal}
                sx={{
                  textTransform: "none",
                  px: 2.5,
                  py: 1.1,
                  borderRadius: 12,
                  fontWeight: "700",
                }}
              >
                Nova Sede
              </Button>
            </Stack>
          </GradientHeader>

          {loading ? (
            <Box sx={{ textAlign: "center", mt: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : (
            <Stack spacing={3}>
              {sedes.length === 0 && (
                <Slide direction="up" in>
                  <Box sx={{ textAlign: "center", py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      Nenhuma sede cadastrada. Crie a primeira sede para começar.
                    </Typography>
                  </Box>
                </Slide>
              )}

              {sedes.map((sede) => (
                <Box key={sede.id}>
                  <GlassCard>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 64,
                              height: 64,
                              fontSize: 24,
                              bgcolor: "primary.main",
                              boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                            }}
                          >
                            {sede.nome ? sede.nome.charAt(0).toUpperCase() : "S"}
                          </Avatar>

                          <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                              {sede.nome}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {sede.endereco || "-"}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip
                            label={statusProps[sede.status]?.label || "—"}
                            color={statusProps[sede.status]?.color || "default"}
                            icon={statusProps[sede.status]?.icon || <></>}
                            sx={{ fontWeight: 700 }}
                          />

                          {/* quick status actions */}
                          {Object.keys(statusProps).map((st) => st !== sede.status && (
                            <Tooltip key={st} title={`Mudar para ${statusProps[st].label}`}>
                              <IconButton
                                onClick={() => atualizarStatus({ tipo: 'sedes', id: sede.id }, st)}
                                color="primary"
                                sx={{
                                  bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                                  "&:hover": { bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }
                                }}
                              >
                                {statusProps[st].icon}
                              </IconButton>
                            </Tooltip>
                          ))}

                          <Button
                            variant="outlined"
                            onClick={() => handleOpenFilhalModal(sede)}
                            startIcon={<Add />}
                            sx={{ ml: 1, borderRadius: 10, textTransform: "none" }}
                          >
                            Adicionar Filial
                          </Button>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Accordion sx={{ borderRadius: 2, background: "transparent", boxShadow: "none" }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography sx={{ fontWeight: 700 }}>Filiais ({sede.Filhals ? sede.Filhals.length : 0})</Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                          {sede.Filhals && sede.Filhals.length > 0 ? (
                            <List disablePadding>
                              {sede.Filhals.map((filhal) => (
                                <React.Fragment key={filhal.id}>
                                  <ListItem
                                    sx={{
                                      borderRadius: 2,
                                      mb: 1,
                                      bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)"),
                                    }}
                                    secondaryAction={
                                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                        <Chip
                                          label={statusProps[filhal.status]?.label || "—"}
                                          color={statusProps[filhal.status]?.color || "default"}
                                          size="small"
                                          icon={statusProps[filhal.status]?.icon || <></>}
                                          sx={{ fontWeight: 700 }}
                                        />
                                        {Object.keys(statusProps).map((st) => st !== filhal.status && (
                                          <Tooltip key={st} title={`Mudar para ${statusProps[st].label}`}>
                                            <IconButton
                                              size="small"
                                              onClick={() => atualizarStatus({ tipo: 'filhais', id: filhal.id }, st)}
                                              sx={{
                                                bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)",
                                                "&:hover": { transform: "scale(1.05)" },
                                              }}
                                            >
                                              {statusProps[st].icon}
                                            </IconButton>
                                          </Tooltip>
                                        ))}
                                      </Box>
                                    }
                                  >
                                    <ListItemText
                                      primary={<Typography sx={{ fontWeight: 700 }}>{filhal.nome}</Typography>}
                                      secondary={`End: ${filhal.endereco || "-"} • Tel: ${filhal.telefone || "-"} • Email: ${filhal.email || "-"}`}
                                    />
                                  </ListItem>
                                <Divider component="li" />
                                </React.Fragment>
                              ))}
                            </List>
                          ) : (
                            <Typography color="text.secondary">Nenhuma filial cadastrada para esta sede.</Typography>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </GlassCard>
                </Box>
              ))}
            </Stack>
          )}

          {/* Modal Filial + Usuario */}
         {/* Modal Filial + Usuario */}
<Modal open={modalFilhalOpen} onClose={handleCloseFilhalModal}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: { xs: "92%", sm: 620 },
      maxHeight: "80vh",
      bgcolor: "background.paper",
      boxShadow: 30,
      p: { xs: 3, sm: 4 },
      borderRadius: 3,
      overflowY: "auto",
    }}
  >
    {/* Cabeçalho com botão de fechar */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        {selectedSede
          ? `Cadastrar Filial e Usuário — ${selectedSede.nome}`
          : "Cadastrar Filial e Usuário"}
      </Typography>
      <IconButton onClick={handleCloseFilhalModal}>
        <Close />
      </IconButton>
    </Box>

    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      Preencha os dados da filial e do usuário responsável.
    </Typography>

    <CadastrarIgrejaDono sedeId={selectedSede?.id} />
  </Box>
</Modal>


          {/* Modal Nova Sede */}
          <Modal open={modalSedeOpen} onClose={handleCloseSedeModal}>
            <Box
              component="form"
              onSubmit={handleNovaSedeSubmit}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "92%", sm: 520 },
                bgcolor: "background.paper",
                boxShadow: 30,
                p: 4,
                borderRadius: 3,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                Cadastrar Nova Sede
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Insira as informações básicas da sede.
              </Typography>

              <TextField required name="nome" label="Nome da Sede" fullWidth margin="normal" value={novaSede.nome} onChange={handleNovaSedeChange} />
              <TextField name="endereco" label="Endereço" fullWidth margin="normal" value={novaSede.endereco} onChange={handleNovaSedeChange} />
              <TextField name="telefone" label="Telefone" fullWidth margin="normal" value={novaSede.telefone} onChange={handleNovaSedeChange} />
              <TextField name="email" label="Email" fullWidth margin="normal" value={novaSede.email} onChange={handleNovaSedeChange} />

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <Button onClick={handleCloseSedeModal} sx={{ textTransform: "none" }}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" sx={{ borderRadius: 2, textTransform: "none" }}>
                  Cadastrar
                </Button>
              </Box>
            </Box>
          </Modal>

          {/* Snackbar para feedback */}
          <Snackbar open={snack.open} autoHideDuration={3500} onClose={closeSnack} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
            <Alert onClose={closeSnack} severity={snack.severity} sx={{ width: "100%" }}>
              {snack.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
