// pages/GestaoContribuicoes.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  useTheme,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import api from "../api/axiosConfig";
import FormTipoContribuicao from "../components/FormTipoContribuicao";

import { motion } from "framer-motion";

export default function GestaoContribuicoes() {
  const theme = useTheme();
  const [tipos, setTipos] = useState([]);
  const [filteredTipos, setFilteredTipos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openTipoModal, setOpenTipoModal] = useState(false);
  const [tipoEditando, setTipoEditando] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchTipos();
  }, []);

  useEffect(() => {
    if (!search) setFilteredTipos(tipos);
    else
      setFilteredTipos(
        tipos.filter((t) => (t.nome || "").toLowerCase().includes(search.toLowerCase()))
      );
  }, [search, tipos]);

  const fetchTipos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/lista/tipos-contribuicao");
      setTipos(res.data || []);
      setFilteredTipos(res.data || []);
    } catch (err) {
      setSnackbar({ open: true, message: "Erro ao carregar tipos de contribuição.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNovoTipo = () => {
    setTipoEditando(null);
    setOpenTipoModal(true);
  };

  const abrirModalEditarTipo = (tipo) => {
    setTipoEditando(tipo);
    setOpenTipoModal(true);
  };

  const deletarTipo = async (id) => {
    try {
      await api.delete(`/tipos-contribuicao/${id}`);
      fetchTipos();
      setSnackbar({ open: true, message: "Tipo de contribuição excluído com sucesso.", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Erro ao excluir tipo.", severity: "error" });
    }
  };

  const formatarValor = (valor) => {
    if (typeof valor !== "number" || isNaN(valor)) return "Kz 0,00";
    return `Kz ${valor.toFixed(2).replace(".", ",")}`;
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.985 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.04, type: "spring", stiffness: 160, damping: 16 },
    }),
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 10,
        fontFamily: "'Poppins', sans-serif",
        background: `radial-gradient(600px 400px at 15% 15%, rgba(124,77,255,0.08), transparent),
                     radial-gradient(600px 400px at 85% 85%, rgba(0,229,255,0.05), transparent),
                     linear-gradient(180deg, #050816 0%, #071430 70%, #041029 100%)`,
        color: "#e6eef8",
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 8 }}>
        {/* Cabeçalho premium */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                background: "linear-gradient(90deg,#00e5ff,#7c4dff,#00bcd4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 0.6,
                mb: 0.5,
                backgroundSize: "200% auto",
                animation: "gradientFlow 6s ease infinite",
              }}
            >
              Gestão de Contribuições
            </Typography>
            <Typography variant="body2" sx={{ color: "#e6eef8" }}>
              Painel premium — controle financeiro de contribuições com estilo cinematográfico.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              placeholder="Buscar tipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                "& .MuiInputLabel-root": { color: "rgba(230,238,248,0.6)" },
              }}
            />
            <Button
              startIcon={<AddIcon />}
              onClick={abrirModalNovoTipo}
              sx={{
                borderRadius: "999px",
                px: 3,
                py: 1.2,
                fontWeight: 700,
                background: "linear-gradient(90deg,#7c4dff,#00e5ff)",
                boxShadow: "0 8px 30px rgba(124,77,255,0.18)",
                color: "#fff",
                textTransform: "none",
                "&:hover": {
                  transform: "translateY(-3px) scale(1.02)",
                  boxShadow: "0 18px 50px rgba(124,77,255,0.28)",
                },
              }}
            >
              Novo Tipo
            </Button>
          </Box>
        </Box>

        {/* Conteúdo */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}>
            <CircularProgress size={64} thickness={5} sx={{ color: "#00e5ff" }} />
          </Box>
        ) : filteredTipos.length === 0 ? (
          <Typography align="center" sx={{ mt: 8, color: "#e6eef8" }}>
            Nenhum tipo de contribuição encontrado.
          </Typography>
        ) : (
          filteredTipos.map((tipo, idx) => (
            <motion.div key={tipo.id} custom={idx} initial="hidden" animate="show" variants={listItemVariants}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(124,77,255,0.1)",
                  transition: "transform 220ms ease, box-shadow 220ms ease",
                  "&:hover": {
                    transform: "translateY(-6px) scale(1.02)",
                    boxShadow: "0 20px 60px rgba(2,6,23,0.6), 0 0 30px rgba(0,229,255,0.08)",
                  },
                  color: "#e6eef8",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: 16, md: 18 }, color: "#e6eef8" }}>
                      {tipo.nome}
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.5,
                        px: 2,
                        py: 0.5,
                        borderRadius: 3,
                        display: "inline-block",
                        background: tipo.ativo ? "linear-gradient(90deg,#00e676,#00bfa5)" : "rgba(244,67,54,0.15)",
                        color: tipo.ativo ? "#fff" : "#ff6b6b",
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {tipo.ativo ? "Ativo" : "Inativo"}
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Ver Histórico">
                      <IconButton sx={{ color: "#60a5fa", "&:hover": { transform: "scale(1.1)" } }}>
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => abrirModalEditarTipo(tipo)} sx={{ color: "#7c4dff", "&:hover": { transform: "scale(1.1)" } }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => deletarTipo(tipo.id)} sx={{ color: "#ff6b6b", "&:hover": { transform: "scale(1.1)" } }}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box sx={{ mt: 1, display: "flex", justifyContent: "space-around", fontWeight: 700 }}>
                  <Typography variant="body2" sx={{ color: "#e6eef8" }}>
                    Receita Total: {formatarValor(tipo.receitaTotal)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e6eef8" }}>
                    Receita Média: {formatarValor(tipo.receitaMedia)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e6eef8" }}>
                    Maior Contribuição: {formatarValor(tipo.maiorContribuicao)}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          ))
        )}

        {/* Modal cadastrar/editar */}
        <Dialog
          open={openTipoModal}
          onClose={() => setOpenTipoModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              color: "#e6eef8",
              background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(124,77,255,0.08)",
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle sx={{ color: "#e6eef8" }}>
            {tipoEditando ? "Editar Tipo de Contribuição" : "Cadastrar Tipo de Contribuição"}
          </DialogTitle>
          <DialogContent dividers>
            <FormTipoContribuicao
              tipo={tipoEditando}
              onSuccess={() => {
                setOpenTipoModal(false);
                fetchTipos();
                setSnackbar({ open: true, message: `Tipo ${tipoEditando ? "editado" : "criado"} com sucesso!`, severity: "success" });
              }}
              onCancel={() => setOpenTipoModal(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4200}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: 2,
              fontWeight: 700,
              boxShadow: "0 8px 30px rgba(2,6,23,0.6)",
              background:
                snackbar.severity === "success"
                  ? "linear-gradient(90deg,#2ecc71,#10ac84)"
                  : snackbar.severity === "error"
                  ? "linear-gradient(90deg,#ff6b6b,#ff4d4d)"
                  : "linear-gradient(90deg,#7c4dff,#00e5ff)",
              color: "#fff",
            }}
          >
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
