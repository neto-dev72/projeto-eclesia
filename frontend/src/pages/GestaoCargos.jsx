// src/pages/GestaoCargos.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  List,
  Paper,
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
  Avatar,
  Stack,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkIcon from "@mui/icons-material/Work";

import { motion } from "framer-motion";

import api from "../api/axiosConfig";
import FormCargos from "../components/FormCargos";
import AtribuirCargoMembro from "../components/AtribuirCargoMembro";

export default function GestaoCargos() {
  const [cargos, setCargos] = useState([]);
  const [filteredCargos, setFilteredCargos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openCargoModal, setOpenCargoModal] = useState(false);
  const [editingCargo, setEditingCargo] = useState(null);
  const [deletingCargo, setDeletingCargo] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const listItemVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.985 },
    show: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.03, type: "spring", stiffness: 160, damping: 16 } }),
  };

  const fetchCargos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/lista/cargos");
      setCargos(res.data);
      setFilteredCargos(res.data);
    } catch {
      setSnackbar({ open: true, message: "Erro ao carregar cargos.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCargos(); }, []);
  useEffect(() => {
    setFilteredCargos(!search ? cargos : cargos.filter(c => c.nome.toLowerCase().includes(search.toLowerCase())));
  }, [search, cargos]);

  const handleOpenNewCargo = () => { setEditingCargo(null); setOpenCargoModal(true); };
  const handleEditCargo = (cargo) => { setEditingCargo(cargo); setOpenCargoModal(true); };
  const handleDeleteClick = (cargo) => setDeletingCargo(cargo);
  const confirmDelete = async () => {
    try {
      await api.delete(`/cargos/${deletingCargo.id}`);
      setSnackbar({ open: true, message: "Cargo excluído com sucesso.", severity: "success" });
      setDeletingCargo(null);
      fetchCargos();
    } catch {
      setSnackbar({ open: true, message: "Erro ao excluir cargo.", severity: "error" });
    }
  };
  const cancelDelete = () => setDeletingCargo(null);
  const handleCloseModal = () => { setOpenCargoModal(false); setEditingCargo(null); };
  const closeSnack = () => setSnackbar(s => ({ ...s, open: false }));

  return (
    <Box sx={{
      minHeight: "100vh",
      pb: 10,
      px: { xs: 2, md: 4 },
      background: `radial-gradient(600px 300px at 10% 10%, rgba(124,77,255,0.06), transparent),
                   radial-gradient(600px 300px at 90% 85%, rgba(0,229,255,0.04), transparent),
                   linear-gradient(180deg, #050816 0%, #071430 60%, #041029 100%)`,
      color: "#e6eef8",
      fontFamily: "'Poppins', sans-serif",
    }}>
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
              Gestão de Cargos
            </Typography>
            <Typography sx={{ color: "rgba(230,238,248,0.8)" }}>
              Gerencie cargos e atribua membros com estilo premium.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <Button
              startIcon={<AddIcon />}
              onClick={handleOpenNewCargo}
              sx={{
                borderRadius: "999px",
                px: 3,
                py: 1,
                fontWeight: 700,
                background: "linear-gradient(90deg,#7c4dff,#00e5ff)",
                boxShadow: "0 8px 30px rgba(124,77,255,0.18)",
                color: "white",
                textTransform: "none",
                "&:hover": { transform: "translateY(-3px) scale(1.02)", boxShadow: "0 18px 50px rgba(124,77,255,0.28)" },
              }}
            >
              Novo Cargo
            </Button>
            <TextField
              placeholder="Buscar cargo..."
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
                  color: "#e6eef8",
                },
                "& .MuiInputBase-input": { color: "#e6eef8", pl: 1.2 },
              }}
            />
          </Box>
        </Box>

        {/* Lista de cargos */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}>
            <CircularProgress size={64} thickness={5} sx={{ color: "#00e5ff" }} />
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredCargos.length === 0 ? (
              <Typography align="center" sx={{ mt: 8, color: "rgba(230,238,248,0.7)" }}>
                Nenhum cargo encontrado.
              </Typography>
            ) : filteredCargos.map((cargo, idx) => (
              <motion.div key={cargo.id} custom={idx} initial="hidden" animate="show" variants={listItemVariants}>
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
                  }}
                >
                  <Avatar sx={{ bgcolor: "#7c4dff", width: { xs: 64, md: 80 }, height: { xs: 64, md: 80 } }}>
                    <WorkIcon fontSize="large" />
                  </Avatar>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: 16, md: 20 }, color: "#e6eef8" }}>
                      {cargo.nome}
                    </Typography>
                    {cargo.descricao && (
                      <Typography variant="body2" sx={{ mt: 0.5, color: "rgba(230,238,248,0.8)" }}>
                        {cargo.descricao}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                      <GroupIcon fontSize="small" sx={{ color: "rgba(230,238,248,0.7)" }} />
                      <Typography variant="caption" sx={{ color: "rgba(230,238,248,0.7)" }}>
                        {cargo.totalMembros || 0} membro(s) atribuídos
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                      <AccessTimeIcon fontSize="small" sx={{ color: "rgba(230,238,248,0.7)" }} />
                      <Typography variant="caption" sx={{ color: "rgba(230,238,248,0.7)" }}>
                        Última atribuição: {cargo.ultimoAtribuido ? new Date(cargo.ultimoAtribuido).toLocaleDateString("pt-BR") : "Nenhuma"}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleEditCargo(cargo)} sx={{ color: "#00e5ff" }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => handleDeleteClick(cargo)} sx={{ color: "#ff1744" }}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </List>
        )}

        {/* Modal cadastro/edição */}
        <Dialog open={openCargoModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: "#e6eef8" }}>{editingCargo ? "Editar Cargo" : "Cadastrar Novo Cargo"}</DialogTitle>
          <DialogContent dividers>
            <FormCargos
              cargo={editingCargo}
              onSuccess={() => { handleCloseModal(); fetchCargos(); setSnackbar({ open: true, message: `Cargo ${editingCargo ? "atualizado" : "cadastrado"} com sucesso!`, severity: "success" }); }}
              onCancel={handleCloseModal}
            />
          </DialogContent>
        </Dialog>

        {/* Modal confirmação exclusão */}
        <Dialog open={Boolean(deletingCargo)} onClose={cancelDelete}>
          <DialogTitle sx={{ color: "#e6eef8" }}>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "rgba(230,238,248,0.8)" }}>
              Deseja realmente excluir o cargo <strong>{deletingCargo?.nome}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete}>Cancelar</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">Excluir</Button>
          </DialogActions>
        </Dialog>

        <AtribuirCargoMembro cargos={cargos} />

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnack} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert severity={snackbar.severity} sx={{ width: "100%", fontWeight: 700, background: snackbar.severity === "success" ? "linear-gradient(90deg,#2ecc71,#10ac84)" : "linear-gradient(90deg,#ff6b6b,#ff4d4d)", color: "#fff" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Container>

      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </Box>
  );
}
