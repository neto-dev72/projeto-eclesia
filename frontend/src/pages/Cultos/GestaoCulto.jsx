import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Button,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import { Event, Edit, Delete, Add, Church } from "@mui/icons-material";

// Importando componentes
import FormCultos from "../../components/FormTipoCulto";
import FormAgendarCulto from "../../components/ProgramaCulto";

// 🔷 Fundo geral com luzes flutuantes
const Background = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100%",
  background: "linear-gradient(135deg, #f8fbff 0%, #eef4ff 50%, #ffffff 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: theme.spacing(10, 3),
  position: "relative",
  overflow: "hidden",
}));

const FloatingLights = styled("div")({
  position: "absolute",
  inset: 0,
  zIndex: 0,
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(160px)",
    animation: "float 12s ease-in-out infinite alternate",
  },
  "&::before": {
    top: "10%",
    left: "-15%",
    width: "500px",
    height: "500px",
    background: "rgba(63,81,181,0.25)",
  },
  "&::after": {
    bottom: "-15%",
    right: "-10%",
    width: "600px",
    height: "600px",
    background: "rgba(123,31,162,0.25)",
  },
  "@keyframes float": {
    "0%": { transform: "translateY(0)" },
    "100%": { transform: "translateY(25px)" },
  },
});

// 🔹 Títulos e tipografia premium
const Title = styled(Typography)(({ theme }) => ({
  fontFamily: "'Raleway', sans-serif",
  fontWeight: 900,
  fontSize: "3.2rem",
  background: "linear-gradient(90deg, #3f51b5, #7e57c2)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textAlign: "center",
  textShadow: "0px 4px 25px rgba(63,81,181,0.25)",
  marginBottom: theme.spacing(1),
  letterSpacing: "1px",
  zIndex: 2,
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Inter', sans-serif",
  fontSize: "1.15rem",
  color: "#283593",
  textAlign: "center",
  opacity: 0.85,
  marginBottom: theme.spacing(6),
  zIndex: 2,
}));

// 🔸 Card estilizado para lista de cultos
const TipoCultoCard = styled(motion.div)(({ theme }) => ({
  width: "100%",
  maxWidth: "950px",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,245,255,0.85))",
  borderRadius: "28px",
  backdropFilter: "blur(25px)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  transition: "transform 0.5s ease, box-shadow 0.5s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 30px 90px rgba(63,81,181,0.25)",
  },
}));

const TipoCultoText = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  color: "#1a237e",
}));

const TipoCultoTitle = styled(Typography)(() => ({
  fontWeight: 900,
  fontSize: "2rem",
  fontFamily: "'Raleway', sans-serif",
  background: "linear-gradient(90deg, #3f51b5, #7e57c2)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0px 5px 25px rgba(63,81,181,0.25)",
  letterSpacing: "0.8px",
}));

const Message = styled(Typography)(() => ({
  fontSize: "1.05rem",
  color: "#2c387e",
  opacity: 0.9,
  marginTop: 8,
  lineHeight: 1.6,
  fontFamily: "'Inter', sans-serif",
}));

const ActionsBox = styled(Box)(() => ({
  display: "flex",
  gap: "10px",
  alignItems: "center",
}));

// 🕊️ Página principal
const NotificacoesCultos = () => {
  const [tiposCultos, setTiposCultos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedTipoCulto, setSelectedTipoCulto] = useState(null);
  const [error, setError] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [tipoToDelete, setTipoToDelete] = useState(null);

  useEffect(() => {
    const fetchTiposCultos = async () => {
      try {
        const response = await axios.get("/tabela-cultos1");
        setTiposCultos(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar tipos de cultos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTiposCultos();
  }, []);

  const handleEdit = (tipo) => {
    setSelectedTipoCulto(tipo);
    setModalType(1);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    if (!tipoToDelete) return;
    try {
      await axios.delete(`/tipocultos/${tipoToDelete.id}`);
      setTiposCultos((prev) => prev.filter((t) => t.id !== tipoToDelete.id));
      setError(null);
      setOpenConfirmDelete(false);
    } catch (error) {
      setError("Erro ao excluir o tipo de culto.");
    }
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setSelectedTipoCulto(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTipoCulto(null);
  };

  const handleConfirmDelete = (tipo) => {
    setTipoToDelete(tipo);
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setTipoToDelete(null);
  };

  const handleNewTipoCultoAdded = (newTipoCulto) => {
    setTiposCultos((prev) => {
      const exists = prev.find((t) => t.id === newTipoCulto.id);
      return exists
        ? prev.map((t) => (t.id === newTipoCulto.id ? newTipoCulto : t))
        : [newTipoCulto, ...prev];
    });
    setOpenModal(false);
    setSelectedTipoCulto(null);
  };

  return (
    <Background>
      <FloatingLights />
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ zIndex: 2 }}
      >
        <Title>Tipos de Cultos</Title>
        <Subtitle>Gerencie e agende seus eventos espirituais com estilo celestial ✨</Subtitle>
      </motion.div>

      {/* Botões principais */}
      <Box display="flex" justifyContent="center" gap={2} mb={5} zIndex={2}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal(1)}
          sx={{
            borderRadius: "30px",
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
            background:
              "linear-gradient(100deg, #3949ab 0%, #5c6bc0 50%, #7986cb 100%)",
            boxShadow: "0 10px 30px rgba(92,107,192,0.4)",
            "&:hover": {
              background:
                "linear-gradient(100deg, #283593 0%, #3f51b5 50%, #5c6bc0 100%)",
              transform: "scale(1.05)",
              boxShadow: "0 12px 40px rgba(63,81,181,0.5)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Criar Novo Tipo de Culto
        </Button>

        <Button
          variant="contained"
          startIcon={<Church />}
          onClick={() => handleOpenModal(2)}
          sx={{
            borderRadius: "30px",
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
            background:
              "linear-gradient(100deg, #6a1b9a 0%, #8e24aa 50%, #ab47bc 100%)",
            boxShadow: "0 10px 30px rgba(142,36,170,0.35)",
            "&:hover": {
              background:
                "linear-gradient(100deg, #4a148c 0%, #6a1b9a 50%, #8e24aa 100%)",
              transform: "scale(1.05)",
              boxShadow: "0 12px 40px rgba(123,31,162,0.45)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Agendar Culto
        </Button>
      </Box>

      {/* MODAL REFINADO */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "850px",
            maxHeight: "90vh",
            bgcolor: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
            p: 4,
            overflowY: "auto",
            backdropFilter: "blur(20px)",
            "&::-webkit-scrollbar": {
              width: 8,
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(63,81,181,0.3)",
              borderRadius: 10,
            },
          }}
        >
          {modalType === 1 ? (
            <FormCultos
              tipoCulto={selectedTipoCulto}
              onSuccess={handleNewTipoCultoAdded}
              onCancel={handleCloseModal}
            />
          ) : modalType === 2 ? (
            <FormAgendarCulto />
          ) : null}
        </Box>
      </Modal>

      {/* LISTA */}
      {loading ? (
        <Box display="flex" justifyContent="center" height="50vh">
          <CircularProgress sx={{ color: "#3f51b5" }} />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" zIndex={2}>
          {tiposCultos.length === 0 ? (
            <Typography variant="h6" sx={{ color: "#1a237e", mt: 6 }}>
              Nenhum tipo de culto disponível ⛪
            </Typography>
          ) : (
            tiposCultos.map((tipo, index) => (
              <TipoCultoCard
                key={tipo.id || index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TipoCultoText>
                  <Box display="flex" justifyContent="space-between">
                    <TipoCultoTitle>{tipo.nome}</TipoCultoTitle>
                    <ActionsBox>
                      <IconButton onClick={() => handleEdit(tipo)}>
                        <Edit sx={{ color: "#3949ab" }} />
                      </IconButton>
                      <IconButton onClick={() => handleConfirmDelete(tipo)}>
                        <Delete sx={{ color: "#d32f2f" }} />
                      </IconButton>
                    </ActionsBox>
                  </Box>
                  <Divider
                    sx={{
                      width: "70px",
                      borderColor: "#5c6bc0",
                      borderWidth: "2px",
                      my: 1.5,
                      borderRadius: "10px",
                    }}
                  />
                  <Message>{tipo.descricao || "Sem descrição disponível"}</Message>
                </TipoCultoText>
              </TipoCultoCard>
            ))
          )}
        </Box>
      )}

      {/* ERRO */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          {error}
        </Alert>
      )}

      {/* CONFIRMAR EXCLUSÃO */}
      <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete}>
        <DialogTitle>Tem certeza que deseja excluir?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Essa ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete}>Cancelar</Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Background>
  );
};

export default NotificacoesCultos;
