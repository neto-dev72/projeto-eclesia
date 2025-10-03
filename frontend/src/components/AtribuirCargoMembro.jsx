// src/components/AtribuirCargoMembro.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import api from "../api/axiosConfig";

export default function AtribuirCargoMembro({ cargos }) {
  const [membros, setMembros] = useState([]);
  const [membroSelecionado, setMembroSelecionado] = useState("");
  const [cargoSelecionado, setCargoSelecionado] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchMembros = async () => {
      try {
        const res = await api.get("/membros");
        setMembros(res.data);
      } catch {
        setSnackbar({ open: true, message: "Erro ao carregar membros.", severity: "error" });
      }
    };
    fetchMembros();
  }, []);

  const handleAtribuir = async () => {
    if (!membroSelecionado || !cargoSelecionado) {
      setSnackbar({ open: true, message: "Selecione membro e cargo.", severity: "warning" });
      return;
    }
    setLoading(true);
    try {
      await api.post("/atribuir-cargos", { membroId: membroSelecionado, cargoId: cargoSelecionado });
      setSnackbar({ open: true, message: "Cargo atribuído com sucesso!", severity: "success" });
      setMembroSelecionado("");
      setCargoSelecionado("");
    } catch {
      setSnackbar({ open: true, message: "Erro ao atribuir cargo.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Paper
        elevation={8}
        sx={{
          mt: 6,
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: "linear-gradient(135deg, rgba(124,77,255,0.06), rgba(0,229,255,0.06))",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            background: "linear-gradient(90deg,#7c4dff,#00e5ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "1.5rem", md: "1.8rem" },
          }}
        >
          Atribuir Cargo a Membro
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <FormControl
            sx={{
              minWidth: 200,
              flexGrow: 1,
              background: "rgba(255,255,255,0.02)",
              borderRadius: 2,
              "& .MuiInputBase-root": { color: "#e6eef8" },
            }}
          >
            <InputLabel id="label-membro" sx={{ color: "rgba(230,238,248,0.7)" }}>
              Membro
            </InputLabel>
            <Select
              labelId="label-membro"
              value={membroSelecionado}
              label="Membro"
              onChange={(e) => setMembroSelecionado(e.target.value)}
              disabled={loading}
              sx={{ color: "#e6eef8" }}
            >
              {membros.map((membro) => (
                <MenuItem key={membro.id} value={membro.id}>
                  {membro.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            sx={{
              minWidth: 200,
              flexGrow: 1,
              background: "rgba(255,255,255,0.02)",
              borderRadius: 2,
              "& .MuiInputBase-root": { color: "#e6eef8" },
            }}
          >
            <InputLabel id="label-cargo" sx={{ color: "rgba(230,238,248,0.7)" }}>
              Cargo
            </InputLabel>
            <Select
              labelId="label-cargo"
              value={cargoSelecionado}
              label="Cargo"
              onChange={(e) => setCargoSelecionado(e.target.value)}
              disabled={loading}
              sx={{ color: "#e6eef8" }}
            >
              {cargos.map((cargo) => (
                <MenuItem key={cargo.id} value={cargo.id}>
                  {cargo.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleAtribuir}
            disabled={loading}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 700,
              borderRadius: "999px",
              background: "linear-gradient(90deg,#7c4dff,#00e5ff)",
              boxShadow: "0 8px 30px rgba(124,77,255,0.18)",
              color: "#fff",
              textTransform: "none",
              "&:hover": { transform: "translateY(-2px) scale(1.02)", boxShadow: "0 18px 50px rgba(124,77,255,0.28)" },
            }}
          >
            Atribuir Cargo
          </Button>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            sx={{
              width: "100%",
              fontWeight: 700,
              background:
                snackbar.severity === "success"
                  ? "linear-gradient(90deg,#2ecc71,#10ac84)"
                  : snackbar.severity === "error"
                  ? "linear-gradient(90deg,#ff6b6b,#ff4d4d)"
                  : "linear-gradient(90deg,#f1c40f,#f39c12)",
              color: "#fff",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </motion.div>
  );
}
