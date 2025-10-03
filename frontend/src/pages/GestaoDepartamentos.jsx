// src/pages/GestaoDepartamentos.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  LinearProgress,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import api from "../api/axiosConfig";
import FormDepartamento from "../components/FormDepartamento";

export default function GestaoDepartamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [departamentoEditando, setDepartamentoEditando] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchDepartamentos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/departamentos");
      setDepartamentos(res.data);
      setFilteredDepartamentos(res.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar departamentos.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  useEffect(() => {
    if (!search) setFilteredDepartamentos(departamentos);
    else
      setFilteredDepartamentos(
        departamentos.filter((d) =>
          d.nome.toLowerCase().includes(search.toLowerCase())
        )
      );
  }, [search, departamentos]);

  const abrirModalNovo = () => {
    setDepartamentoEditando(null);
    setOpenModal(true);
  };

  const abrirModalEditar = (dep) => {
    setDepartamentoEditando(dep);
    setOpenModal(true);
  };

  const deletarDepartamento = async (id) => {
    try {
      await api.delete(`/departamentos/${id}`);
      fetchDepartamentos();
      setSnackbar({
        open: true,
        message: "Departamento excluído com sucesso.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao excluir departamento.",
        severity: "error",
      });
    }
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      {/* Título Premium com Gradiente */}
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        sx={{
          textAlign: "center",
          mb: 4,
          background: "linear-gradient(90deg, #7c4dff, #00e5ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Gestão de Departamentos
      </Typography>

      {/* Barra de busca e botão */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <TextField
          label="Buscar por departamento"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flexGrow: 1,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 2,
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={abrirModalNovo}
          sx={{
            background: "linear-gradient(90deg, #7c4dff, #00e5ff)",
            color: "#fff",
            fontWeight: "bold",
            px: 4,
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 12px 30px rgba(124,77,255,0.3)",
            },
          }}
        >
          Novo Departamento
        </Button>
      </Box>

      {/* Lista Premium com Cards e Estatísticas */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress size={60} />
        </Box>
      ) : filteredDepartamentos.length === 0 ? (
        <Typography align="center" color="text.secondary" mt={6}>
          Nenhum departamento encontrado.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 3,
          }}
        >
          {filteredDepartamentos.map((dep) => {
            // Calcula % de membros (exemplo)
            const maxMembros = 100; // ajuste conforme seu contexto
            const membrosPercent = Math.min(
              100,
              Math.round((dep.totalMembros / maxMembros) * 100)
            );

            return (
              <motion.div
                key={dep.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                    background: "linear-gradient(135deg,#f0f0ff,#ffffff)",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 18px 40px rgba(124,77,255,0.3)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {dep.nome}
                    </Typography>
                    {dep.descricao && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {dep.descricao}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={2} mt={1} alignItems="center">
                      <LocationOnIcon color="primary" fontSize="small" />
                      <Typography variant="caption" color="text.secondary">
                        {dep.local || "Não informado"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} mt={1} alignItems="center">
                      <PeopleIcon color="primary" fontSize="small" />
                      <Typography variant="caption" color="text.secondary">
                        {dep.totalMembros || 0} membro(s)
                      </Typography>
                    </Stack>

                    {/* Barra de progresso animada */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Preenchimento de membros
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={membrosPercent}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          mt: 0.5,
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            background: "linear-gradient(90deg,#7c4dff,#00e5ff)",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", textAlign: "right" }}
                      >
                        {membrosPercent}%
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => abrirModalEditar(dep)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => deletarDepartamento(dep.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </motion.div>
            );
          })}
        </Box>
      )}

      {/* Modal de Formulário */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {departamentoEditando ? "Editar Departamento" : "Novo Departamento"}
        </DialogTitle>
        <DialogContent dividers>
          <FormDepartamento
            departamento={departamentoEditando}
            onSuccess={() => {
              setOpenModal(false);
              fetchDepartamentos();
              setSnackbar({
                open: true,
                message: `Departamento ${
                  departamentoEditando ? "editado" : "criado"
                } com sucesso!`,
                severity: "success",
              });
            }}
            onCancel={() => setOpenModal(false)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="inherit">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
