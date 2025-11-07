// src/pages/AgendarAtendimento.jsx
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { EventAvailable } from "@mui/icons-material";
import { motion } from "framer-motion";
import api from "../api/axiosConfig";

export default function AgendarAtendimento() {
  const [pastores, setPastores] = useState([]);
  const [formData, setFormData] = useState({
    MembroId: "",
    data_hora: "",
    observacoes: "",
  });
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const carregarPastores = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await api.get("/membros/pastores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPastores(res.data.pastores || []);
      } catch (error) {
        setMensagem({ tipo: "error", texto: "Erro ao carregar pastores." });
      } finally {
        setLoading(false);
      }
    };
    carregarPastores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMensagem({ tipo: "", texto: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.MembroId || !formData.data_hora) {
      setMensagem({
        tipo: "error",
        texto: "Selecione o pastor e informe a data/hora.",
      });
      return;
    }

    try {
      setSalvando(true);
      setMensagem({ tipo: "", texto: "" });
      const token = localStorage.getItem("token");

      await api.post("/atendimentos", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensagem({
        tipo: "success",
        texto: "Atendimento agendado com sucesso!",
      });
      setFormData({ MembroId: "", data_hora: "", observacoes: "" });
    } catch (error) {
      console.error("Erro ao agendar atendimento:", error);
      setMensagem({
        tipo: "error",
        texto: "Erro ao agendar atendimento pastoral.",
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
          style={{ width: "100%", maxWidth: 680 }}
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
                background:
                  "linear-gradient(90deg, #0033cc 0%, #0055ff 100%)",
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
                <EventAvailable
                  sx={{ fontSize: 35, mr: 1, color: "white" }}
                />
                Agendar Atendimento Pastoral
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
                  {/* Pastor */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Selecione o Pastor</InputLabel>
                    <Select
                      name="MembroId"
                      value={formData.MembroId}
                      onChange={handleChange}
                      required
                      sx={{
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
                      }}
                    >
                      <MenuItem value="">Nenhum</MenuItem>
                      {pastores.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.nome} {p.telefone ? `(${p.telefone})` : ""}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Data e Hora */}
                  <TextField
                    label="Data e Hora"
                    type="datetime-local"
                    name="data_hora"
                    value={formData.data_hora}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      mb: 3,
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

                  {/* Observações */}
                  <TextField
                    label="Observações"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    sx={{
                      mb: 3,
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

                  {/* Botão */}
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={salvando}
                    sx={{
                      mt: 2,
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
                      "Agendar Atendimento"
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
