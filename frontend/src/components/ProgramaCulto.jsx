// src/pages/RegistrarCulto.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Fade,
  Grid,
  InputAdornment,
} from "@mui/material";
import {
  Church,
  Save,
  Event,
  LocationOn,
  Person,
  Notes,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import api from "../api/axiosConfig";

export default function RegistrarCulto() {
  const [tiposCulto, setTiposCulto] = useState([]);
  const [form, setForm] = useState({
    TipoCultoId: "",
    dataHora: "",
    local: "",
    responsavel: "",
    observacoes: "",
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const carregarTipos = async () => {
      try {
        const res = await api.get("/lista/tipos-culto");
        setTiposCulto(res.data || []);
      } catch {
        setMensagem({ tipo: "error", texto: "Erro ao carregar tipos de culto." });
      }
    };
    carregarTipos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: "", texto: "" });

    try {
      await api.post("/programa-cultos", form);
      setMensagem({
        tipo: "success",
        texto: "Culto registrado com sucesso!",
      });
      setForm({
        TipoCultoId: "",
        dataHora: "",
        local: "",
        responsavel: "",
        observacoes: "",
      });
    } catch {
      setMensagem({
        tipo: "error",
        texto: "Erro ao registrar culto.",
      });
    } finally {
      setLoading(false);
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
          style={{ width: "100%", maxWidth: 850 }}
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
            {/* Cabeçalho */}
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
                <Church sx={{ fontSize: 35, mr: 1, color: "white" }} />
                Agendar Culto
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

              {/* Mensagem */}
              {mensagem.texto && (
                <Alert
                  severity={mensagem.tipo}
                  sx={{
                    mb: 3,
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

              {/* Formulário */}
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Tipo de Culto */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Tipo de Culto</InputLabel>
                      <Select
                        name="TipoCultoId"
                        value={form.TipoCultoId}
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
                        {tiposCulto.map((t) => (
                          <MenuItem key={t.id} value={t.id}>
                            {t.nome}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Data e Hora */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="dataHora"
                      label="Data e Hora"
                      type="datetime-local"
                      value={form.dataHora}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Event sx={{ color: "#0044ff" }} />
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

                  {/* Local */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="local"
                      label="Local do Culto"
                      placeholder="Ex: Sede Central, Filial 2..."
                      value={form.local}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn sx={{ color: "#0044ff" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          backgroundColor: "rgba(255,255,255,0.97)",
                          "& fieldset": { borderColor: "rgba(0,70,255,0.25)" },
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
                      name="responsavel"
                      label="Pregador / Responsável"
                      placeholder="Nome do pastor ou dirigente"
                      value={form.responsavel}
                      onChange={handleChange}
                      fullWidth
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
                          "& fieldset": { borderColor: "rgba(0,70,255,0.25)" },
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

                  {/* Observações */}
                  <Grid item xs={12}>
                    <TextField
                      name="observacoes"
                      label="Observações"
                      multiline
                      rows={3}
                      value={form.observacoes}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Notes sx={{ color: "#0044ff", mt: 1 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          backgroundColor: "rgba(255,255,255,0.97)",
                          "& fieldset": { borderColor: "rgba(0,70,255,0.25)" },
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

                  {/* Botão */}
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      type="submit"
                      disabled={loading}
                      startIcon={
                        loading ? (
                          <CircularProgress size={22} color="inherit" />
                        ) : (
                          <Save />
                        )
                      }
                      sx={{
                        mt: 3,
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
                      {loading ? "Salvando..." : "Agendar Culto"}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              <Divider sx={{ mt: 6, mb: 2 }} />

              <Typography
                align="center"
                variant="body2"
                sx={{
                  color: "#0033cc",
                  fontWeight: 500,
                  opacity: 0.7,
                }}
              >
                Sistema Premium de Agendamento — © {new Date().getFullYear()}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Fade>
  );
}
