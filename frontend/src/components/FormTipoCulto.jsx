// src/pages/FormTipoCulto.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Fade,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Church, Edit } from "@mui/icons-material";
import { motion } from "framer-motion";
import api from "../api/axiosConfig";

export default function FormTipoCulto({ tipoCulto, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    ativo: true,
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    if (tipoCulto) {
      setFormData({
        nome: tipoCulto.nome || "",
        descricao: tipoCulto.descricao || "",
        ativo: tipoCulto.ativo ?? true,
      });
    }
  }, [tipoCulto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMensagem({ tipo: "", texto: "" });
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, ativo: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: "", texto: "" });

    try {
      let res;
      if (tipoCulto && tipoCulto.id) {
        res = await api.put(`/tipocultos/${tipoCulto.id}`, formData);
      } else {
        res = await api.post("/tipocultos", formData);
      }

      setMensagem({
        tipo: "success",
        texto: tipoCulto
          ? "Tipo de culto atualizado com sucesso!"
          : "Tipo de culto cadastrado com sucesso!",
      });

      if (onSuccess) onSuccess(res.data);
      if (!tipoCulto)
        setFormData({ nome: "", descricao: "", ativo: true });
    } catch (err) {
      console.error(err);
      setMensagem({
        tipo: "error",
        texto:
          err.response?.data?.message || "Erro ao salvar tipo de culto.",
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
                <Church sx={{ fontSize: 35, mr: 1, color: "white" }} />
                {tipoCulto ? "Editar Tipo de Culto" : "Cadastro de Tipo de Culto"}
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

              <form onSubmit={handleSubmit}>
                {/* Nome */}
                <TextField
                  label="Nome do Tipo de Culto"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
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

                {/* Descrição */}
                <TextField
                  label="Descrição"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  multiline
                  rows={3}
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

                {/* Switch */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.ativo}
                      onChange={handleSwitchChange}
                      color="primary"
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 600, color: "#0033cc" }}>
                      Ativo
                    </Typography>
                  }
                  sx={{ mb: 3 }}
                />

                {/* Botões */}
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <Edit />
                    )
                  }
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
                  {loading
                    ? "Salvando..."
                    : tipoCulto
                    ? "Atualizar Tipo"
                    : "Cadastrar Tipo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Fade>
  );
}
