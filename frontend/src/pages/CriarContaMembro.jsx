// pages/CadastroMembroUser.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, MenuItem, Button, Container, Paper, Stack } from "@mui/material";
import axios from "../api/axiosConfig";

const CadastroMembroUser = () => {
  const [sedes, setSedes] = useState([]);
  const [filhals, setFilhals] = useState([]);
  const [form, setForm] = useState({
    SedeId: "",
    FilhalId: "",
    nome: "",
    senha: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/sedes-com-filhais")
      .then(res => setSedes(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const sedeSelecionada = sedes.find(s => s.id === form.SedeId);
    setFilhals(sedeSelecionada ? sedeSelecionada.Filhals : []);
    setForm(prev => ({ ...prev, FilhalId: "" }));
  }, [form.SedeId, sedes]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/membros/cadastrar-pendente", form);
      setMessage(res.data.message);
      setForm({ SedeId: "", FilhalId: "", nome: "", senha: "" });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Erro ao cadastrar membro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      py: 8,
      bgcolor: 'linear-gradient(160deg, #e3f2fd 0%, #ffffff 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <Container maxWidth="sm">
        <Paper sx={{
          p: 6,
          borderRadius: 4,
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          background: 'linear-gradient(145deg, #ffffff 0%, #e1f5fe 100%)',
          transition: 'all 0.4s ease',
          '&:hover': {
            boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
            transform: 'translateY(-4px)'
          }
        }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: 'center', color: '#0288d1' }}>
            Criar Conta de Membro
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
            
            {/* Sede */}
            <TextField
              select
              label="Sede"
              name="SedeId"
              value={form.SedeId}
              onChange={handleChange}
              required
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: 3,
                  background: '#f1f8fe',
                  transition: 'all 0.3s ease',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)'
                },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#81d4fa' },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0288d1', borderWidth: 2 }
              }}
            >
              {sedes.map(sede => (
                <MenuItem key={sede.id} value={sede.id}>
                  {sede.nome} ({sede.quantidadeMembros} membros)
                </MenuItem>
              ))}
            </TextField>

            {/* Filhal */}
            <TextField
              select
              label="Filhal"
              name="FilhalId"
              value={form.FilhalId}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: 3,
                  background: '#f1f8fe',
                  transition: 'all 0.3s ease',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)'
                },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#81d4fa' },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0288d1', borderWidth: 2 }
              }}
            >
              <MenuItem value="">Nenhuma</MenuItem>
              {filhals.map(filhal => (
                <MenuItem key={filhal.id} value={filhal.id}>
                  {filhal.nome} ({filhal.quantidadeMembros} membros)
                </MenuItem>
              ))}
            </TextField>

            {/* Nome */}
            <TextField
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: 3,
                  background: '#f1f8fe',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease'
                },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#81d4fa' },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0288d1', borderWidth: 2 }
              }}
            />

            {/* Senha */}
            <TextField
              label="Senha"
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              required
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: 3,
                  background: '#f1f8fe',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease'
                },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#81d4fa' },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0288d1', borderWidth: 2 }
              }}
            />

            {/* Botão premium */}
            <Button
              type="submit"
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #5CC8FF, #4A90E2)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 6,
                py: 1.8,
                textTransform: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'all 0.4s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4A90E2, #5CC8FF)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
                },
              }}
            >
              {loading ? "Cadastrando..." : "Criar Conta de Membro"}
            </Button>

            {/* Mensagem de retorno */}
            {message && (
              <Typography sx={{
                mt: 2,
                textAlign: 'center',
                fontWeight: 600,
                color: '#0288d1',
                background: '#e1f5fe',
                py: 1,
                borderRadius: 2,
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)'
              }}>
                {message}
              </Typography>
            )}

          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CadastroMembroUser;
