// pages/GestaoMembros.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  List,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Paper,
  useTheme,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CloseIcon from "@mui/icons-material/Close";

import { motion } from "framer-motion";
import api from "../api/axiosConfig";
import FormMembros from "../components/FormMembros";
import CartaoMembros from "../components/CartaoMembros";
import PerfilMembros from "../components/PerfilMembro";
import HistoricoMembro from "../components/HistoricoMembro";

export default function GestaoMembros() {
  const theme = useTheme();
  const [membros, setMembros] = useState([]);
  const [filteredMembros, setFilteredMembros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingMembro, setDeletingMembro] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [openMembroModal, setOpenMembroModal] = useState(false);
  const [openCartaoModal, setOpenCartaoModal] = useState(false);
  const [openPerfilModal, setOpenPerfilModal] = useState(false);
  const [openHistoricoModal, setOpenHistoricoModal] = useState(false);
  const [membroSelecionado, setMembroSelecionado] = useState(null);
  const [perfilMembro, setPerfilMembro] = useState(null);
  const [historicoMembro, setHistoricoMembro] = useState(null);
  const [membroEditar, setMembroEditar] = useState(null); // Para edição

  useEffect(() => {
    if (!document.getElementById("gf-poppins")) {
      const l = document.createElement("link");
      l.id = "gf-poppins";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  const fetchMembros = async () => {
    setLoading(true);
    try {
      const res = await api.get("/membros");
      setMembros(res.data || []);
      setFilteredMembros(res.data || []);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Erro ao carregar membros.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembros();
  }, []);

  useEffect(() => {
    if (!search) setFilteredMembros(membros);
    else {
      const q = search.toLowerCase();
      setFilteredMembros(membros.filter((m) => (m.nome || "").toLowerCase().includes(q)));
    }
  }, [search, membros]);

  const handleDeleteClick = (membro) => setDeletingMembro(membro);
  const cancelDelete = () => setDeletingMembro(null);

  const confirmDelete = async () => {
    try {
      await api.delete(`/membros/${deletingMembro.id}`);
      setSnackbar({ open: true, message: "Membro excluído com sucesso.", severity: "success" });
      setDeletingMembro(null);
      await fetchMembros();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Erro ao excluir membro.", severity: "error" });
    }
  };

  const handleEditarMembro = (membro) => {
    setMembroEditar(membro);
    setOpenMembroModal(true);
  };

  const handleVerHistorico = async (membro) => {
    try {
      const res = await api.get(`/membros/${membro.id}/historico`);
      setHistoricoMembro(res.data);
      setOpenHistoricoModal(true);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Erro ao carregar histórico do membro.", severity: "error" });
    }
  };

  const handleVerPerfil = async (membro) => {
    try {
      const res = await api.get(`/perfil-membros/${membro.id}`);
      setPerfilMembro(res.data);
      setOpenPerfilModal(true);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Erro ao carregar perfil do membro.", severity: "error" });
    }
  };

  const handleExtrairCartao = (membro) => {
    setMembroSelecionado(membro);
    setOpenCartaoModal(true);
  };

  const closeCartaoModal = () => {
    setOpenCartaoModal(false);
    setMembroSelecionado(null);
  };

  const closePerfilModal = () => {
    setOpenPerfilModal(false);
    setPerfilMembro(null);
  };

  const closeHistoricoModal = () => {
    setOpenHistoricoModal(false);
    setHistoricoMembro(null);
  };

  const closeSnack = () => setSnackbar((s) => ({ ...s, open: false }));

  const listItemVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.985 },
    show: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.04, type: "spring", stiffness: 160, damping: 16 } }),
  };

  const modalPaperSx = {
    borderRadius: 3,
    overflow: "hidden",
    background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(124,77,255,0.08)",
    color: "#e6eef8",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 10,
        background: `radial-gradient(600px 300px at 10% 10%, rgba(124,77,255,0.06), transparent),
                     radial-gradient(600px 300px at 90% 85%, rgba(0,229,255,0.04), transparent),
                     linear-gradient(180deg, #050816 0%, #071430 60%, #041029 100%)`,
        color: "#e6eef8",
        fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 8 }}>
        {/* Cabeçalho */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 6, flexWrap: "wrap" }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                lineHeight: 1,
                background: "linear-gradient(90deg,#00e5ff,#7c4dff,#00bcd4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                letterSpacing: 0.6,
                mb: 0.5,
                backgroundSize: "200% auto",
                animation: "gradientFlow 6s ease infinite",
              }}
            >
              Gestão de Membros
            </Typography>
            <Typography variant="body2" sx={{ color: "#e6eef8" }}>
              Painel premium — gerencie membros, cartões e históricos com estilo.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => { setMembroEditar(null); setOpenMembroModal(true); }}
              sx={{
                borderRadius: "999px",
                px: 3,
                py: 1,
                fontWeight: 700,
                background: "linear-gradient(90deg,#7c4dff,#00e5ff)",
                boxShadow: "0 8px 30px rgba(124,77,255,0.18)",
                color: "white",
                textTransform: "none",
                "&:hover": {
                  transform: "translateY(-3px) scale(1.02)",
                  boxShadow: "0 18px 50px rgba(124,77,255,0.28)",
                },
              }}
            >
              Novo membro
            </Button>

            <TextField
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                minWidth: 280,
                borderRadius: "999px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.02)",
                  backdropFilter: "blur(6px)",
                  color: "inherit",
                },
                "& .MuiInputBase-input": { color: "#e6eef8", pl: 1.2 },
                "& .MuiInputLabel-root": { color: "rgba(230,238,248,0.6)" },
              }}
            />
          </Box>
        </Box>

        {/* Conteúdo */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}>
            <CircularProgress size={64} thickness={5} sx={{ color: "#00e5ff" }} />
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredMembros.length === 0 ? (
              <Typography align="center" sx={{ mt: 8, color: "#e6eef8" }}>
                Nenhum membro encontrado.
              </Typography>
            ) : (
              filteredMembros.map((membro, idx) => (
                <motion.div
                  custom={idx}
                  initial="hidden"
                  animate="show"
                  variants={listItemVariants}
                  key={membro.id}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: { xs: 2, md: 3 },
                      mb: 3,
                      borderRadius: 3,
                      background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      transition: "transform 220ms ease, box-shadow 220ms ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 20px 60px rgba(2,6,23,0.6), 0 0 30px rgba(0,229,255,0.06)",
                        border: "1px solid rgba(124,77,255,0.18)",
                      },
                      color: "#e6eef8",
                    }}
                  >
                    <ListItemAvatar>
                      <Box
                        sx={{
                          width: { xs: 72, md: 96 },
                          height: { xs: 72, md: 96 },
                          borderRadius: "50%",
                          p: "4px",
                          background: "linear-gradient(135deg,#00e5ff22,#7c4dff44)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 6px 22px rgba(0,0,0,0.45)",
                        }}
                      >
                        <Avatar
                          src={membro.foto || undefined}
                          sx={{
                            width: { xs: 64, md: 88 },
                            height: { xs: 64, md: 88 },
                            borderRadius: "50%",
                            border: "3px solid rgba(255,255,255,0.06)",
                            boxShadow: "inset 0 -6px 18px rgba(0,0,0,0.35)",
                            fontSize: 22,
                            color: "#e6eef8",
                          }}
                        >
                          {membro.nome ? membro.nome.charAt(0).toUpperCase() : "M"}
                        </Avatar>
                      </Box>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 16, md: 18 }, color: "#e6eef8" }}>
                          {membro.nome}
                        </Typography>
                      }
                      secondary={
                        <Typography sx={{ color: "rgba(230,238,248,0.7)" }}>
                          {membro.profissao || "-"} &nbsp; • &nbsp; {membro.email || "-"}
                        </Typography>
                      }
                      sx={{ flex: 1, ml: 1 }}
                    />

                    {/* Ações */}
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Tooltip title="Extrair cartão" arrow>
                        <IconButton
                          onClick={() => handleExtrairCartao(membro)}
                          sx={{
                            bgcolor: "rgba(0,229,255,0.04)",
                            color: "#00e5ff",
                            "&:hover": { transform: "scale(1.06)", bgcolor: "rgba(0,229,255,0.08)" },
                          }}
                        >
                          <AssignmentIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Ver perfil" arrow>
                        <IconButton
                          onClick={() => handleVerPerfil(membro)}
                          sx={{
                            bgcolor: "rgba(255,255,255,0.02)",
                            color: "#e6eef8",
                            "&:hover": { transform: "scale(1.06)", bgcolor: "rgba(255,255,255,0.04)" },
                          }}
                          size="large"
                        >
                          <AccountCircleRoundedIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Histórico" arrow>
                        <IconButton
                          onClick={() => handleVerHistorico(membro)}
                          sx={{
                            bgcolor: "rgba(59,130,246,0.04)",
                            color: "#60a5fa",
                            "&:hover": { transform: "scale(1.06)", bgcolor: "rgba(59,130,246,0.08)" },
                          }}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Editar" arrow>
                        <IconButton
                          onClick={() => handleEditarMembro(membro)}
                          sx={{
                            bgcolor: "rgba(124,77,255,0.06)",
                            color: "#7c4dff",
                            "&:hover": { transform: "scale(1.06)", bgcolor: "rgba(124,77,255,0.12)" },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Excluir" arrow>
                        <IconButton
                          onClick={() => handleDeleteClick(membro)}
                          sx={{
                            bgcolor: "rgba(244,67,54,0.04)",
                            color: "#ff6b6b",
                            "&:hover": { transform: "scale(1.06)", bgcolor: "rgba(244,67,54,0.08)" },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                </motion.div>
              ))
            )}
          </List>
        )}

      </Container>

      {/* ================== MODAIS ================== */}

      {/* Modal Cadastro / Edição */}
      <Dialog
        open={openMembroModal}
        onClose={() => { setOpenMembroModal(false); setMembroEditar(null); }}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: modalPaperSx }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, py: 1 }}>
          <DialogTitle sx={{ m: 0, fontWeight: 800, color: "#e6eef8" }}>
            {membroEditar ? "Editar Membro" : "Cadastrar Novo Membro"}
          </DialogTitle>
          <IconButton onClick={() => { setOpenMembroModal(false); setMembroEditar(null); }} sx={{ color: "#e6eef8" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent dividers>
          <FormMembros
            membroData={membroEditar}
            onSuccess={async () => {
              setOpenMembroModal(false);
              setMembroEditar(null);
              await fetchMembros();
              setSnackbar({ open: true, message: membroEditar ? "Membro atualizado com sucesso." : "Membro cadastrado com sucesso.", severity: "success" });
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => { setOpenMembroModal(false); setMembroEditar(null); }} sx={{ textTransform: "none", color: "#e6eef8" }}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Cartão */}
      <Dialog
        open={openCartaoModal}
        onClose={closeCartaoModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { backgroundColor: "transparent", boxShadow: "none" } }}
        BackdropProps={{ sx: { backgroundColor: "rgba(255,255,255,0.85)" } }}
      >
        {membroSelecionado && (
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            <CartaoMembros membro={membroSelecionado} onClose={closeCartaoModal} />
          </Box>
        )}
      </Dialog>

      {/* Modal Perfil */}
      <Dialog
        open={openPerfilModal}
        onClose={closePerfilModal}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: modalPaperSx }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, py: 1 }}>
          <DialogTitle sx={{ m: 0, fontWeight: 800, color: "#e6eef8" }}>Perfil do Membro</DialogTitle>
          <IconButton onClick={closePerfilModal} sx={{ color: "#e6eef8" }}><CloseIcon /></IconButton>
        </Box>
        <DialogContent dividers>
          {perfilMembro && <PerfilMembros membro={perfilMembro} onClose={closePerfilModal} />}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closePerfilModal} sx={{ textTransform: "none", color: "#e6eef8" }}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Histórico */}
      <Dialog
        open={openHistoricoModal}
        onClose={closeHistoricoModal}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: modalPaperSx }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, py: 1 }}>
          <DialogTitle sx={{ m: 0, fontWeight: 800, color: "#e6eef8" }}>Histórico do Membro</DialogTitle>
          <IconButton onClick={closeHistoricoModal} sx={{ color: "#e6eef8" }}><CloseIcon /></IconButton>
        </Box>
        <DialogContent dividers>
          {historicoMembro && <HistoricoMembro historico={historicoMembro} onClose={closeHistoricoModal} />}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeHistoricoModal} sx={{ textTransform: "none", color: "#e6eef8" }}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmar Exclusão */}
      <Dialog open={!!deletingMembro} onClose={cancelDelete}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o membro "{deletingMembro?.nome}"? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error">Excluir</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnack} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={closeSnack} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
