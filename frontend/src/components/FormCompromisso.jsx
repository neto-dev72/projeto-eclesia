// src/pages/AgendarAgendaPastoral.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Divider,
  Fade,
  Grid,
  InputAdornment,
} from "@mui/material";
import {
  EventAvailable,
  Save,
  Person,
  Notes,
  WorkHistory,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import api from "../api/axiosConfig";

export default function AgendarAgendaPastoral() {
  const [pastores, setPastores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [form, setForm] = useState({
    MembroId: "",
    data_hora: "",
    tipo_cumprimento: "",
    nome_pessoa: "",
    responsavel: "",
    status: "Pendente",
    observacao: "",
  });

  useEffect(() => {
    const carregarPastores = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await api.get("/membros/pastores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPastores(res.data.pastores || []);
      } catch {
        setMensagem({ tipo: "error", texto: "Erro ao carregar pastores." });
      } finally {
        setLoading(false);
      }
    };
    carregarPastores();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMensagem({ tipo: "", texto: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem({ tipo: "", texto: "" });

    try {
      const token = localStorage.getItem("token");
      await api.post("/agenda-pastoral", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensagem({
        tipo: "success",
        texto: "Agendamento pastoral registrado com sucesso!",
      });
      setForm({
        MembroId: "",
        data_hora: "",
        tipo_cumprimento: "",
        nome_pessoa: "",
        responsavel: "",
        status: "Pendente",
        observacao: "",
      });
    } catch {
      setMensagem({
        tipo: "error",
        texto: "Erro ao registrar agendamento pastoral.",
      });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          minHeight: "100vh",
          p: { xs: 2, md: 6 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "radial-gradient(circle at top left, #eaf0ff 0%, #ffffff 40%, #f2f6ff 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: 900 }}
        >
          <Card
            elevation={14}
            sx={{
              borderRadius: "30px",
              overflow: "hidden",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(235,240,255,0.97))",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(0,70,255,0.25)",
              boxShadow:
                "0 20px 60px rgba(0,50,150,0.25), inset 0 0 50px rgba(255,255,255,0.05)",
            }}
          >
            <Box
              sx={{
                p: 3,
                background: "linear-gradient(90deg, #0033cc 0%, #0055ff 100%)",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  letterSpacing: "1px",
                  color: "#fff",
                  textTransform: "uppercase",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <WorkHistory sx={{ fontSize: 35, mr: 1, color: "white" }} />
                Agendar Compromisso Pastoral
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Divider
                sx={{
                  mb: 4,
                  borderColor: "rgba(0,70,255,0.2)",
                  boxShadow: "0 1px 10px rgba(0,90,255,0.25)",
                }}
              />

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress sx={{ color: "#0044ff" }} />
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Pastor Responsável */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Pastor Responsável</InputLabel>
                        <Select
                          name="MembroId"
                          value={form.MembroId}
                          onChange={handleChange}
                          sx={{
                            borderRadius: 3,
                            backgroundColor: "rgba(255,255,255,0.97)",
                            "& fieldset": {
                              borderColor: "rgba(0,70,255,0.25)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 15px rgba(0,80,255,0.3)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 25px rgba(0,80,255,0.4)",
                            },
                          }}
                        >
                          <MenuItem value="">Selecione</MenuItem>
                          {pastores.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                              {p.nome}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Data e Hora */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="data_hora"
                        label="Data e Hora"
                        type="datetime-local"
                        value={form.data_hora}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventAvailable sx={{ color: "#0044ff" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            backgroundColor: "rgba(255,255,255,0.97)",
                            "& fieldset": {
                              borderColor: "rgba(0,70,255,0.25)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 15px rgba(0,80,255,0.3)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 25px rgba(0,80,255,0.4)",
                            },
                          },
                        }}
                      />
                    </Grid>

                    {/* Tipo */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="tipo_cumprimento"
                        label="Tipo de Compromisso"
                        placeholder="Visita, Culto, Reunião..."
                        value={form.tipo_cumprimento}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Notes sx={{ color: "#0044ff" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            backgroundColor: "rgba(255,255,255,0.97)",
                            "& fieldset": {
                              borderColor: "rgba(0,70,255,0.25)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 15px rgba(0,80,255,0.3)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 25px rgba(0,80,255,0.4)",
                            },
                          },
                        }}
                      />
                    </Grid>

                    {/* Nome Pessoa */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="nome_pessoa"
                        label="Pessoa / Local"
                        placeholder="Ex: Irmão João, Família Silva..."
                        value={form.nome_pessoa}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: "#0044ff" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            backgroundColor: "rgba(255,255,255,0.97)",
                            "& fieldset": {
                              borderColor: "rgba(0,70,255,0.25)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 15px rgba(0,80,255,0.3)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 25px rgba(0,80,255,0.4)",
                            },
                          },
                        }}
                      />
                    </Grid>

                    {/* Responsável */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="responsavel"
                        label="Responsável"
                        value={form.responsavel}
                        onChange={handleChange}
                        placeholder="Quem irá conduzir"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            backgroundColor: "rgba(255,255,255,0.97)",
                            "& fieldset": {
                              borderColor: "rgba(0,70,255,0.25)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 15px rgba(0,80,255,0.3)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 25px rgba(0,80,255,0.4)",
                            },
                          },
                        }}
                      />
                    </Grid>

                    {/* Status */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="status"
                          value={form.status}
                          onChange={handleChange}
                          sx={{
                            borderRadius: 3,
                            backgroundColor: "rgba(255,255,255,0.97)",
                            "& fieldset": {
                              borderColor: "rgba(0,70,255,0.25)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 15px rgba(0,80,255,0.3)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 25px rgba(0,80,255,0.4)",
                            },
                          }}
                        >
                          <MenuItem value="Pendente">Pendente</MenuItem>
                          <MenuItem value="Concluido">Concluído</MenuItem>
                          <MenuItem value="Cancelado">Cancelado</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Observações */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name="observacao"
                        label="Observações"
                        placeholder="Anotações, detalhes ou comentários..."
                        value={form.observacao}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            backgroundColor: "rgba(255,255,255,0.97)",
                            "& fieldset": {
                              borderColor: "rgba(0,70,255,0.25)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 15px rgba(0,80,255,0.3)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#0044ff",
                              boxShadow: "0 0 25px rgba(0,80,255,0.4)",
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Mensagem */}
                  {mensagem.texto && (
                    <Alert
                      severity={mensagem.tipo}
                      sx={{
                        mt: 3,
                        borderRadius: 3,
                        backgroundColor:
                          mensagem.tipo === "success"
                            ? "rgba(0,80,255,0.08)"
                            : "rgba(255,80,80,0.1)",
                        color:
                          mensagem.tipo === "success"
                            ? "#0033cc"
                            : "rgb(150,0,0)",
                        border: `1px solid ${
                          mensagem.tipo === "success"
                            ? "rgba(0,80,255,0.25)"
                            : "rgba(255,0,0,0.2)"
                        }`,
                        fontWeight: 600,
                      }}
                    >
                      {mensagem.texto}
                    </Alert>
                  )}

                  {/* Botão */}
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={salvando}
                    sx={{
                      mt: 4,
                      py: 1.8,
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      borderRadius: "45px",
                      textTransform: "none",
                      color: "#fff",
                      background:
                        "linear-gradient(90deg, #0033cc 0%, #0055ff 100%)",
                      boxShadow:
                        "0 10px 35px rgba(0,60,255,0.45), inset 0 0 10px rgba(255,255,255,0.3)",
                      transition: "all 0.35s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #0044ff 0%, #0070ff 100%)",
                        transform: "scale(1.045)",
                        boxShadow:
                          "0 12px 45px rgba(0,80,255,0.55), inset 0 0 15px rgba(255,255,255,0.4)",
                      },
                    }}
                  >
                    {salvando ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Registrar Agenda Pastoral"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Fade>
  );
}
