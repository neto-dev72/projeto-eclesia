// components/FormTipoCulto.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from "@mui/material";
import api from "../api/axiosConfig";

export default function FormTipoCulto({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    ativo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, ativo: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      setError("O campo 'Nome' é obrigatório.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/tipocultos", formData);
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao cadastrar tipo de culto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Nome"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Descrição"
        name="descricao"
        value={formData.descricao}
        onChange={handleChange}
        multiline
        rows={3}
        fullWidth
      />

      <FormControlLabel
        control={<Switch checked={formData.ativo} onChange={handleSwitchChange} color="primary" />}
        label="Ativo"
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
        <Button onClick={onCancel} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading} startIcon={loading && <CircularProgress size={20} />}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </Box>
    </Box>
  );
}
