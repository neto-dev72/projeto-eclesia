// components/FormDepartamento.jsx
import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import api from "../api/axiosConfig";

export default function FormDepartamento({ departamento, onSuccess, onCancel }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [loading, setLoading] = useState(false);

  // Preencher dados se estiver editando
  useEffect(() => {
    if (departamento) {
      setNome(departamento.nome || "");
      setDescricao(departamento.descricao || "");
      setLocal(departamento.local || "");
    }
  }, [departamento]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Montar payload
      const payload = {
        nome,
        descricao,
        local,
      };

      if (departamento && departamento.id) {
        // Edição
        await api.put(`/departamentos/${departamento.id}`, payload);
      } else {
        // Criação
        await api.post("/departamentos", payload);
      }

      onSuccess(); // fechar modal e atualizar lista
    } catch (error) {
      console.error("Erro ao salvar departamento:", error);
      alert("Erro ao salvar departamento. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Nome"
        variant="outlined"
        required
        fullWidth
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <TextField
        label="Descrição"
        variant="outlined"
        multiline
        rows={3}
        fullWidth
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <TextField
        label="Local"
        variant="outlined"
        fullWidth
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
        <Button color="inherit" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : departamento ? "Salvar" : "Cadastrar"}
        </Button>
      </Box>
    </Box>
  );
}
