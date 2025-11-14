// src/pages/GestaoFuncionarios.jsx
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
  Autocomplete,
} from "@mui/material";
import { PersonAddAlt1 } from "@mui/icons-material";
import { motion } from "framer-motion";
import api from "../api/axiosConfig";

export default function GestaoFuncionarios() {
  const [membros, setMembros] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [membroId, setMembroId] = useState("");
  const [cargoId, setCargoId] = useState("");
  const [salarioBase, setSalarioBase] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [resMembros, resCargos] = await Promise.all([
          api.get("/membros", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/cargos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMembros(resMembros.data);
        setCargos(resCargos.data);
      } catch (error) {
        setMensagem({ tipo: "error", texto: "Erro ao carregar dados." });
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSalvando(true);
      setMensagem({ tipo: "", texto: "" });

      const token = localStorage.getItem("token");

      await api.post(
        "/funcionarios",
        {
          salario_base: salarioBase,
          ativo,
          MembroId: membroId,
          CargoId: cargoId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensagem({
        tipo: "success",
        texto: "Funcionário cadastrado com sucesso!",
      });

      setSalarioBase("");
      setMembroId("");
      setCargoId("");
      setAtivo(true);
    } catch (error) {
      setMensagem({
        tipo: "error",
        texto: "Erro ao cadastrar funcionário.",
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
                <PersonAddAlt1 sx={{ fontSize: 35, mr: 1, color: "white" }} />
                Cadastro de Funcionário
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
                  
                  {/* 🔵 AUTOCOMPLETE COM BUSCA PARA MEMBROS */}
                  <Autocomplete
                    options={membros}
                    getOptionLabel={(m) => m.nome}
                    onChange={(e, value) =>
                      setMembroId(value ? value.id : "")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Selecione o Membro"
                        fullWidth
                        required
                      />
                    )}
                    sx={{ mb: 3 }}
                  />

                  {/* SELECT DE CARGO */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Selecione o Cargo</InputLabel>
                    <Select
                      value={cargoId}
                      onChange={(e) => setCargoId(e.target.value)}
                      required
                    >
                      {cargos.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Salário Base (Kz)"
                    type="number"
                    value={salarioBase}
                    onChange={(e) => setSalarioBase(e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 3 }}
                  />

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={ativo ? 1 : 0}
                      onChange={(e) => setAtivo(e.target.value === 1)}
                    >
                      <MenuItem value={1}>Ativo</MenuItem>
                      <MenuItem value={0}>Inativo</MenuItem>
                    </Select>
                  </FormControl>

                  {mensagem.texto && (
                    <Alert severity={mensagem.tipo} sx={{ mb: 3 }}>
                      {mensagem.texto}
                    </Alert>
                  )}

                  <Button variant="contained" fullWidth type="submit">
                    {salvando ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Cadastrar"
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
