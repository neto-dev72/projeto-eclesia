// src/components/FormularioMinisterio.jsx
import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import axios from "../api/axiosConfig";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";

export default function FormularioMinisterio() {
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    try {
      await axios.post("/cadastrar/ministerios", formData);
      setSuccess("Ministério cadastrado com sucesso!");
      setFormData({ nome: "", endereco: "", telefone: "", email: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
        fontFamily: "'Poppins', sans-serif",
        mb: 6,
      }}
    >
      <Typography variant="h5" fontWeight="700" gutterBottom>
        Cadastrar Ministério
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Endereço"
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ fontWeight: 700 }}
        >
          {loading ? "Salvando..." : "Cadastrar Ministério"}
        </Button>
        {success && (
          <Typography color="success.main" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
