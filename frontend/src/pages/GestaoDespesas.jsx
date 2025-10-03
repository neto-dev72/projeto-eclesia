// src/pages/Despesas/ListaDespesas.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Stack,
  Modal,
} from "@mui/material";
import { motion } from "framer-motion";
import { Paid, Add, Edit, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import api from "../api/axiosConfig";
import FormDespesas from "../components/FormDespesas";

export default function ListaDespesas() {
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const fetchDespesas = async () => {
    setLoading(true);
    try {
      const res = await api.get("/lista/despesas");
      setDespesas(res.data || []);
    } catch (error) {
      console.error("Erro ao carregar despesas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDespesas();
  }, []);

  const listItemVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.985 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.03, type: "spring", stiffness: 160, damping: 16 },
    }),
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 10,
        px: { xs: 2, md: 4 },
        background: `radial-gradient(600px 300px at 10% 10%, rgba(124,77,255,0.06), transparent),
                     radial-gradient(600px 300px at 90% 85%, rgba(0,229,255,0.04), transparent),
                     linear-gradient(180deg, #050816 0%, #071430 60%, #041029 100%)`,
        color: "#e6eef8",
        fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", pt: 8 }}>
        {/* Cabeçalho premium */}
        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 6 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                lineHeight: 1,
                background: "linear-gradient(90deg,#00e5ff,#7c4dff,#00bcd4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                letterSpacing: 0.6,
                mb: 0.5,
                backgroundSize: "200% auto",
                animation: "gradientFlow 6s ease infinite",
              }}
            >
              <Paid fontSize="large" /> Gestão de Despesas
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>
              Gerencie suas despesas com estilo cinematográfico.
            </Typography>
          </Box>

          <Button
            startIcon={<Add />}
            onClick={() => setOpenModal(true)}
            sx={{
              borderRadius: "999px",
              px: 3,
              py: 1,
              fontWeight: 700,
              background: "linear-gradient(90deg,#7c4dff,#00e5ff)",
              boxShadow: "0 8px 30px rgba(124,77,255,0.18)",
              color: "#e6eef8",
              textTransform: "none",
              "&:hover": {
                transform: "translateY(-3px) scale(1.02)",
                boxShadow: "0 18px 50px rgba(124,77,255,0.28)",
              },
            }}
          >
            Nova Despesa
          </Button>
        </Box>

        {/* Lista de despesas */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}>
            <CircularProgress size={64} thickness={5} sx={{ color: "#00e5ff" }} />
          </Box>
        ) : despesas.length === 0 ? (
          <Typography align="center" sx={{ mt: 8, color: "rgba(230,238,248,0.7)" }}>
            Nenhuma despesa encontrada.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {despesas.map((despesa, idx) => (
              <motion.div key={despesa.id} custom={idx} initial="hidden" animate="show" variants={listItemVariants}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    transition: "transform 220ms ease, box-shadow 220ms ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 60px rgba(2,6,23,0.6), 0 0 30px rgba(0,229,255,0.06)",
                      border: "1px solid rgba(124,77,255,0.18)",
                    },
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#e6eef8" }}>
                      {despesa.descricao || "-"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>
                      Valor: {despesa.valor ? `Kz ${parseFloat(despesa.valor).toFixed(2)}` : "-"} <br />
                      Criada em: {despesa.createdAt ? dayjs(despesa.createdAt).format("DD/MM/YYYY") : "-"}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <IconButton sx={{ color: "#00e5ff", "&:hover": { color: "#7c4dff" } }}>
                      <Edit />
                    </IconButton>
                    <IconButton sx={{ color: "#ff6b6b", "&:hover": { color: "#ff3b3b" } }}>
                      <Delete />
                    </IconButton>
                  </Stack>
                </Paper>
              </motion.div>
            ))}
          </Box>
        )}

        {/* Modal cinematográfico */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 16px 50px rgba(0,0,0,0.6)",
              borderRadius: 4,
              p: 4,
              width: { xs: "90%", md: 500 },
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Typography
              variant="h6"
              mb={2}
              fontWeight="bold"
              sx={{
                background: "linear-gradient(90deg,#00e5ff,#7c4dff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nova Despesa
            </Typography>
            <FormDespesas
              onSuccess={() => {
                setOpenModal(false);
                fetchDespesas();
              }}
              onCancel={() => setOpenModal(false)}
            />
          </Box>
        </Modal>
      </Box>

      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </Box>
  );
}
