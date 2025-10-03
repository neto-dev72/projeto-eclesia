// src/components/FormularioCentro.jsx
import React, { useState, useEffect } from "react";
import { TextField, Button, Paper, Typography, Box, MenuItem } from "@mui/material";
import axios from "../api/axiosConfig";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";

export default function FormularioCentro() {
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
    MinisterioId: "",
  });
  const [ministerios, setMinisterios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMinisterios = async () => {
      try {
        const res = await axios.get("/ministerios");
        setMinisterios(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMinisterios();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    try {
      await axios.post("/cadastrar/centros", formData);
      setSuccess("Centro cadastrado com sucesso!");
      setFormData({ nome: "", endereco: "", telefone: "", email: "", MinisterioId: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 12px 30px rgba(0,0,0,0.2)", mb: 6 }}>
      <Typography variant="h5" fontWeight="700" gutterBottom>
        Cadastrar Centro
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
          value={formData.email}
          onChange={handleChange}
          type="email"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          select
          label="Ministério"
          name="MinisterioId"
          value={formData.MinisterioId}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 3 }}
        >
          {ministerios.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.nome}
            </MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ fontWeight: 700 }}
        >
          {loading ? "Salvando..." : "Cadastrar Centro"}
        </Button>
        {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
      </Box>
    </Paper>
  );
}
