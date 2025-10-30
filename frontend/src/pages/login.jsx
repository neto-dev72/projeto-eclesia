import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Login as LoginIcon, LockOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import api from "../api/axiosConfig";

export default function LoginPage() {
  const [formData, setFormData] = useState({ nome: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/login", formData);
      setSuccess(res.data.message || "Login realizado com sucesso!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at 30% 20%, #4f46e5, #312e81 80%)",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Efeito de fundo luminoso */}
      <motion.div
        style={{
          position: "absolute",
          width: "1300px",
          height: "1300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)",
          top: "-350px",
          left: "-200px",
          filter: "blur(100px)",
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Card de login */}
      <Container
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        maxWidth="sm"
        sx={{
          p: 6,
          borderRadius: 6,
          bgcolor: "white",
          boxShadow: "0 40px 80px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 2,
          backdropFilter: "blur(30px)",
        }}
      >
        {/* Ícone e título */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <LockOutlined
            sx={{
              fontSize: 50,
              color: "#4f46e5",
              mb: 1,
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#1e1b4b",
              mb: 1,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Entrar no Sistema
          </Typography>

          {/* Linha gradiente abaixo do título */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80%" }}
            transition={{ duration: 1 }}
            style={{
              height: "4px",
              background: "linear-gradient(90deg, #4f46e5, #6366f1, #a78bfa)",
              borderRadius: "2px",
              margin: "0 auto",
            }}
          />
        </Box>

        {/* Mensagens de alerta */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(255,0,0,0.2)",
              fontWeight: "bold",
            }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,255,0,0.2)",
              fontWeight: "bold",
            }}
          >
            {success}
          </Alert>
        )}

        {/* Formulário */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }} noValidate>
          <TextField
            fullWidth
            label="Nome de Usuário"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#f9fafb",
                transition: "all 0.3s",
              },
              "& .MuiInputLabel-root": { color: "#4f46e5" },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#4f46e5",
                boxShadow: "0 0 12px rgba(79,70,229,0.4)",
              },
            }}
          />

          <TextField
            fullWidth
            label="Senha"
            name="senha"
            type={showPassword ? "text" : "password"}
            value={formData.senha}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#f9fafb",
                transition: "all 0.3s",
              },
              "& .MuiInputLabel-root": { color: "#4f46e5" },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#4f46e5",
                boxShadow: "0 0 12px rgba(79,70,229,0.4)",
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={
              loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <LoginIcon />
            }
            sx={{
              mt: 3,
              py: 1.6,
              fontWeight: "bold",
              fontSize: "1.1rem",
              borderRadius: 4,
              textTransform: "none",
              background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
              boxShadow: "0 10px 40px rgba(79,70,229,0.4)",
              "&:hover": {
                transform: "translateY(-3px) scale(1.03)",
                boxShadow: "0 20px 60px rgba(79,70,229,0.6)",
              },
            }}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </Box>

        {/* Seção de criar conta */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography
            variant="body1"
            sx={{ mb: 1, fontWeight: 500, color: "#4338ca", fontSize: "0.95rem" }}
          >
            Ainda não tem conta?
          </Typography>
          <Button
            variant="outlined"
            href="/criar-usuarios"
            sx={{
              borderColor: "#4f46e5",
              color: "#4f46e5",
              fontWeight: "bold",
              py: 1,
              px: 3,
              borderRadius: 4,
              textTransform: "none",
              fontSize: "0.95rem",
              "&:hover": {
                backgroundColor: "rgba(79,70,229,0.08)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Criar Conta
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
