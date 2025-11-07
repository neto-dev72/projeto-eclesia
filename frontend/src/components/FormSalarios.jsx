// src/pages/FormSalario.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Divider,
  Fade,
} from "@mui/material";
import { Paid } from "@mui/icons-material";
import { motion } from "framer-motion";
import api from "../api/axiosConfig";

export default function FormSalario() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [subsidios, setSubsidios] = useState([]);
  const [descontos, setDescontos] = useState([]);
  const [FuncionarioId, setFuncionarioId] = useState("");
  const [mesAno, setMesAno] = useState("");
  const [subsidiosSelecionados, setSubsidiosSelecionados] = useState([]);
  const [descontosSelecionados, setDescontosSelecionados] = useState([]);
  const [valores, setValores] = useState({
    salario_base: 0,
    total_subsidios: 0,
    total_descontos: 0,
    salario_liquido: 0,
  });
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const [resFunc, resSubs, resDesc] = await Promise.all([
          api.get("/funcionarios", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/subsidios", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/descontos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setFuncionarios(resFunc.data);
        setSubsidios(resSubs.data);
        setDescontos(resDesc.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    fetchData();
  }, []);

  const handleFuncionarioChange = (id) => {
    const funcionario = funcionarios.find((f) => f.id === id);
    setFuncionarioId(id);
    setValores((v) => ({
      ...v,
      salario_base: funcionario ? parseFloat(funcionario.salario_base) : 0,
    }));
  };

  useEffect(() => {
    const totalSubs = subsidios
      .filter((s) => subsidiosSelecionados.includes(s.id))
      .reduce((acc, s) => acc + parseFloat(s.valor), 0);

    const totalDesc = descontos
      .filter((d) => descontosSelecionados.includes(d.id))
      .reduce((acc, d) => acc + parseFloat(d.valor), 0);

    const salario_liquido =
      parseFloat(valores.salario_base || 0) + totalSubs - totalDesc;

    setValores((v) => ({
      ...v,
      total_subsidios: totalSubs,
      total_descontos: totalDesc,
      salario_liquido,
    }));
  }, [subsidiosSelecionados, descontosSelecionados, valores.salario_base]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem({ tipo: "", texto: "" });

    try {
      const token = localStorage.getItem("token");

      const subsidiosAplicados = subsidios
        .filter((s) => subsidiosSelecionados.includes(s.id))
        .map((s) => ({ id: s.id, valor: s.valor }));

      const descontosAplicados = descontos
        .filter((d) => descontosSelecionados.includes(d.id))
        .map((d) => ({ id: d.id, valor: d.valor }));

      await api.post(
        "/salarios",
        {
          FuncionarioId,
          mes_ano: mesAno,
          subsidiosAplicados,
          descontosAplicados,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMensagem({ tipo: "success", texto: "Salário gerado com sucesso!" });
      setFuncionarioId("");
      setMesAno("");
      setSubsidiosSelecionados([]);
      setDescontosSelecionados([]);
      setValores({
        salario_base: 0,
        total_subsidios: 0,
        total_descontos: 0,
        salario_liquido: 0,
      });
    } catch (error) {
      console.error("Erro ao gerar salário:", error);
      setMensagem({ tipo: "error", texto: "Erro ao gerar salário." });
    } finally {
      setSalvando(false);
    }
  };

  const calcularPercentualDesconto = (valorDesconto) =>
    ((valorDesconto / valores.salario_base) * 100).toFixed(2);

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
            "radial-gradient(circle at top left, #eaf3ff 0%, #ffffff 45%, #f3f7ff 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: 800 }}
        >
          <Card
            elevation={14}
            sx={{
              borderRadius: "28px",
              overflow: "hidden",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(235,245,255,0.97))",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(0,100,255,0.25)",
              boxShadow:
                "0 20px 60px rgba(0,90,255,0.25), inset 0 0 60px rgba(255,255,255,0.05)",
            }}
          >
            {/* Header */}
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
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textTransform: "uppercase",
                }}
              >
                <Paid sx={{ fontSize: 35, mr: 1, color: "white" }} />
                Geração de Salário
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

              <form onSubmit={handleSubmit}>
                {/* Mês/Ano */}
                <TextField
                  label="Mês/Ano"
                  type="month"
                  value={mesAno}
                  onChange={(e) => setMesAno(e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 3 }}
                />

                {/* Funcionário */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Funcionário</InputLabel>
                  <Select
                    value={FuncionarioId}
                    onChange={(e) => handleFuncionarioChange(e.target.value)}
                    required
                  >
                    {funcionarios.length === 0 ? (
                      <MenuItem disabled>
                        Nenhum funcionário encontrado
                      </MenuItem>
                    ) : (
                      funcionarios.map((f) => (
                        <MenuItem key={f.id} value={f.id}>
                          {f.Membro?.nome || `Funcionário #${f.id}`}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                {/* Subsídios */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Subsídios</InputLabel>
                  <Select
                    multiple
                    value={subsidiosSelecionados}
                    onChange={(e) => setSubsidiosSelecionados(e.target.value)}
                    input={<OutlinedInput label="Subsídios" />}
                    renderValue={(selected) =>
                      selected
                        .map(
                          (id) =>
                            subsidios.find((s) => s.id === id)?.nome || "—"
                        )
                        .join(", ")
                    }
                  >
                    {subsidios.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        <Checkbox
                          checked={subsidiosSelecionados.includes(s.id)}
                        />
                        <ListItemText
                          primary={`${s.nome} (+${s.valor} Kz)`}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Descontos */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Descontos</InputLabel>
                  <Select
                    multiple
                    value={descontosSelecionados}
                    onChange={(e) => setDescontosSelecionados(e.target.value)}
                    input={<OutlinedInput label="Descontos" />}
                    renderValue={(selected) =>
                      selected
                        .map(
                          (id) =>
                            descontos.find((d) => d.id === id)?.nome || "—"
                        )
                        .join(", ")
                    }
                  >
                    {descontos.map((d) => (
                      <MenuItem key={d.id} value={d.id}>
                        <Checkbox
                          checked={descontosSelecionados.includes(d.id)}
                        />
                        <ListItemText
                          primary={`${d.nome} (-${d.valor} Kz)`}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Resumo */}
                <Box
                  sx={{
                    mb: 3,
                    p: 3,
                    backgroundColor: "rgba(240,248,255,0.6)",
                    borderRadius: 3,
                    border: "1px solid rgba(0,90,255,0.15)",
                  }}
                >
                  <Typography>
                    💰 <b>Salário base:</b> {valores.salario_base.toFixed(2)} Kz
                  </Typography>
                  <Typography color="green">
                    ➕ <b>Subsídios:</b> {valores.total_subsidios.toFixed(2)} Kz
                  </Typography>
                  <Typography color="red">
                    ➖ <b>Descontos:</b> {valores.total_descontos.toFixed(2)} Kz
                  </Typography>
                  <Typography color="primary" sx={{ mt: 1, fontWeight: "bold" }}>
                    🧾 Salário Líquido: {valores.salario_liquido.toFixed(2)} Kz
                  </Typography>
                </Box>

                {/* Tabela */}
                {descontosSelecionados.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Descontos Aplicados
                    </Typography>
                    <TableContainer
                      component={Paper}
                      sx={{
                        mt: 1,
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 8px 25px rgba(0,80,255,0.15)",
                      }}
                    >
                      <Table>
                        <TableHead sx={{ backgroundColor: "rgba(0,90,255,0.1)" }}>
                          <TableRow>
                            <TableCell><b>Desconto</b></TableCell>
                            <TableCell align="right"><b>Valor</b></TableCell>
                            <TableCell align="right"><b>Porcentagem (%)</b></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {descontos
                            .filter((d) =>
                              descontosSelecionados.includes(d.id)
                            )
                            .map((desconto) => (
                              <TableRow key={desconto.id}>
                                <TableCell>{desconto.nome}</TableCell>
                                <TableCell align="right">
                                  {desconto.valor} Kz
                                </TableCell>
                                <TableCell align="right">
                                  {calcularPercentualDesconto(desconto.valor)}%
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Mensagem */}
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

                {/* Botão */}
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={salvando}
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
                  {salvando ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Gerar Salário"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Fade>
  );
}
