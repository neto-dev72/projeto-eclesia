import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  PersonAddAlt1 as UserAddIcon,
  CheckCircleOutline as SuccessIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import api from "../api/axiosConfig";

export default function CriarUsuarios() {
  const [formData, setFormData] = useState({
    nome: "",
    senha: "",
    funcao: "nenhuma",
    sedeNome: "",
    sedeEndereco: "",
    sedeTelefone: "",
    sedeEmail: "",
    filhalNome: "",
    filhalEndereco: "",
    filhalTelefone: "",
    filhalEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [superAdminExiste, setSuperAdminExiste] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // ✅ estado para mostrar/ocultar senha

  const todasFuncoes = ["super_admin", "admin", "moderador", "usuario"];

  useEffect(() => {
    const verificarSuperAdmin = async () => {
      try {
        const res = await api.get("/verificar-super-admin");
        setSuperAdminExiste(res.data.existe);
      } catch {
        setError("Erro ao verificar super_admin.");
        setSuperAdminExiste(false);
      }
    };
    verificarSuperAdmin();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.senha || !formData.funcao) {
      setError("Por favor, preencha os campos obrigatórios: Nome, Senha e Função.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/usuarios", formData);
      setFormData({
        nome: "",
        senha: "",
        funcao: "nenhuma",
        sedeNome: "",
        sedeEndereco: "",
        sedeTelefone: "",
        sedeEmail: "",
        filhalNome: "",
        filhalEndereco: "",
        filhalTelefone: "",
        filhalEmail: "",
      });
      setModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar usuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => setModalOpen(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev); // alterna senha

  if (superAdminExiste === null) {
    return (
      <Container maxWidth="sm" sx={{ mt: 6, p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2, fontWeight: "bold", color: "#555" }}>
          Verificando super_admin...
        </Typography>
      </Container>
    );
  }

  const funcoesDisponiveis = superAdminExiste
    ? ["nenhuma", ...todasFuncoes.filter((f) => f !== "super_admin")]
    : ["nenhuma", "super_admin"];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #4f46e5, #6366f1, #312e81)",
        position: "relative",
        overflow: "hidden",
        py: 5,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          width: "1200px",
          height: "1200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)",
          top: "-400px",
          right: "-200px",
          filter: "blur(120px)",
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <Container
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        maxWidth="md"
        sx={{
          p: { xs: 4, sm: 6 },
          borderRadius: 5,
          bgcolor: "white",
          boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 2,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <UserAddIcon sx={{ fontSize: 45, color: "#4f46e5", mr: 1 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(90deg, #4338ca, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "1px",
            }}
          >
            Inscreva a sua Igreja
          </Typography>
        </Box>
        <Box
          sx={{
            width: 140,
            height: "4px",
            mb: 4,
            borderRadius: 10,
            background: "linear-gradient(90deg, #4f46e5, #6366f1)",
          }}
        />

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              fontWeight: "bold",
              bgcolor: "#ffeaea",
              color: "#b71c1c",
              borderRadius: 3,
              boxShadow: "0 5px 15px rgba(183,28,28,0.2)",
            }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }} noValidate>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#4f46e5" }}>
            Dados do Usuário
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome do Usuário"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiInputBase-root": { borderRadius: 6, background: "#f3f4f6", height: 60, fontSize: "1rem" },
                  "& .MuiInputLabel-root": { fontWeight: 600 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Senha"
                name="senha"
                type={showPassword ? "text" : "password"} // ✅ alterna entre mostrar e ocultar
                value={formData.senha}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiInputBase-root": { borderRadius: 6, background: "#f3f4f6", height: 60, fontSize: "1rem" },
                  "& .MuiInputLabel-root": { fontWeight: 600 },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Função"
                name="funcao"
                value={formData.funcao}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiInputBase-root": { borderRadius: 6, background: "#f3f4f6", height: 60, fontSize: "1rem" },
                  "& .MuiInputLabel-root": { fontWeight: 600 },
                }}
              >
                {funcoesDisponiveis.map((f) => (
                  <MenuItem key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* Seções Sede e Filhal permanecem iguais */}
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: "bold", color: "#4f46e5" }}>
            Dados da Sede
          </Typography>
          <Grid container spacing={2}>
            {["Nome", "Endereço", "Telefone", "Email"].map((label, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <TextField
                  fullWidth
                  label={`Sede ${label}`}
                  name={`sede${label}`}
                  value={formData[`sede${label}`]}
                  onChange={handleChange}
                  sx={{
                    "& .MuiInputBase-root": { borderRadius: 6, background: "#f3f4f6", height: 60, fontSize: "1rem" },
                    "& .MuiInputLabel-root": { fontWeight: 600 },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: "bold", color: "#4f46e5" }}>
            Dados da Filhal
          </Typography>
          <Grid container spacing={2}>
            {["Nome", "Endereço", "Telefone", "Email"].map((label, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <TextField
                  fullWidth
                  label={`Filhal ${label}`}
                  name={`filhal${label}`}
                  value={formData[`filhal${label}`]}
                  onChange={handleChange}
                  sx={{
                    "& .MuiInputBase-root": { borderRadius: 6, background: "#f3f4f6", height: 60, fontSize: "1rem" },
                    "& .MuiInputLabel-root": { fontWeight: 600 },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* Botão de envio */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <UserAddIcon />}
            sx={{
              mt: 4,
              py: 1.8,
              fontWeight: "bold",
              fontSize: "1.15rem",
              borderRadius: 6,
              textTransform: "none",
              background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
              boxShadow: "0 10px 30px rgba(79,70,229,0.4)",
              "&:hover": { transform: "scale(1.05)", boxShadow: "0 20px 50px rgba(79,70,229,0.6)" },
            }}
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar Usuário"}
          </Button>

          {/* Link Login */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.95rem", color: "#4f46e5", fontWeight: 500 }}>
              Já possui uma conta?{" "}
              <Link
                href="/login"
                sx={{ fontWeight: "bold", textDecoration: "none", color: "#312e81", "&:hover": { textDecoration: "underline" } }}
              >
                Faça o Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Modal de sucesso */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#4f46e5", fontFamily: "'Poppins', sans-serif" }}>
          <SuccessIcon sx={{ fontSize: 60, color: "#4f46e5", mb: 1 }} />
          Cadastro Realizado!
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: "center", fontSize: "1.15rem", color: "#333", fontFamily: "'Poppins', sans-serif" }}>
            Obrigado por se cadastrar! Aguarde a aprovação ou entre em contato com a empresa <strong>Bernet@</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #4f46e5, #312e81)",
              color: "#fff",
              fontWeight: "bold",
              py: 1.2,
              px: 5,
              borderRadius: 6,
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
