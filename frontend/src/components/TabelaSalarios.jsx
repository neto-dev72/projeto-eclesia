import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import api from "../api/axiosConfig";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function TabelaSalarios() {
  const [salarios, setSalarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM"));
  const [endDate, setEndDate] = useState("");
  const [funcionarios, setFuncionarios] = useState([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState("");

  const fetchSalarios = async (start, end, funcionarioId) => {
    setLoading(true);
    setMensagem("");
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (start) params.startDate = dayjs(start).format("YYYY-MM");
      if (end) params.endDate = dayjs(end).format("YYYY-MM");
      if (funcionarioId) params.FuncionarioId = funcionarioId;

      const response = await api.get("/salarios", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const salariosConvertidos = (response.data.salarios || []).map((s) => ({
        ...s,
        salario_base: Number(s.salario_base),
        total_subsidios: Number(s.total_subsidios),
        salario_liquido: Number(s.salario_liquido),
      }));

      setSalarios(salariosConvertidos);
    } catch (error) {
      console.error("Erro ao buscar salários:", error);
      setMensagem("❌ Erro ao carregar salários.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFuncionarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/funcionarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFuncionarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    }
  };

  useEffect(() => {
    fetchSalarios();
    fetchFuncionarios();
  }, []);

  const handleFiltrar = () => {
    if (!startDate) {
      setMensagem("Selecione pelo menos o mês inicial.");
      return;
    }

    if (endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
      setMensagem("O mês final não pode ser anterior ao mês inicial.");
      return;
    }

    const finalDate = endDate || startDate;
    fetchSalarios(startDate, finalDate, selectedFuncionario);
  };

  const handleReset = () => {
    setStartDate(dayjs().format("YYYY-MM"));
    setEndDate("");
    setSelectedFuncionario("");
    setMensagem("");
    fetchSalarios();
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Relatório de Salários dos Funcionários", 14, 18);
    doc.setFontSize(12);
    doc.text(`Período: ${startDate} a ${endDate || startDate}`, 14, 28);

    const rows = salarios.map((s) => [
      s.Funcionario?.Membro?.nome || "—",
      s.mes_ano,
      `Kz ${s.salario_base.toFixed(2)}`,
      `Kz ${s.total_subsidios.toFixed(2)}`,
      `Kz ${(s.salario_base + s.total_subsidios - s.salario_liquido).toFixed(2)}`,
      `Kz ${s.salario_liquido.toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [
        ["Funcionário", "Mês/Ano", "Salário Base", "Subsídios", "Descontos", "Salário Líquido"],
      ],
      body: rows,
      startY: 40,
      styles: { fontSize: 10 },
    });

    doc.save("relatorio-salarios.pdf");
  };

  const exportarExcel = () => {
    const data = salarios.map((s) => ({
      Funcionário: s.Funcionario?.Membro?.nome || "—",
      "Mês/Ano": s.mes_ano,
      "Salário Base": `Kz ${s.salario_base.toFixed(2)}`,
      Subsídios: `Kz ${s.total_subsidios.toFixed(2)}`,
      Descontos: `Kz ${(s.salario_base + s.total_subsidios - s.salario_liquido).toFixed(2)}`,
      "Salário Líquido": `Kz ${s.salario_liquido.toFixed(2)}`,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salários");
    XLSX.writeFile(wb, "relatorio_salarios.xlsx");
  };

  const buttonStyle = (variant = "contained") => ({
    borderRadius: "50px",
    px: 4,
    py: 1.5,
    fontWeight: 700,
    textTransform: "none",
    fontSize: "0.95rem",
    boxShadow:
      variant === "contained"
        ? "0 6px 20px rgba(21,101,192,0.35)"
        : "0 3px 10px rgba(13,71,161,0.15)",
    background:
      variant === "contained"
        ? "linear-gradient(90deg, #0d47a1 0%, #1976d2 100%)"
        : "transparent",
    border: variant === "outlined" ? "2px solid #1565c0" : "none",
    color: variant === "contained" ? "#fff" : "#0d47a1",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      background:
        variant === "contained"
          ? "linear-gradient(90deg, #1565c0 0%, #0d47a1 100%)"
          : "rgba(21,101,192,0.08)",
    },
  });

  // 📊 Agrupamento por funcionário (sem repetir nomes)
  const chartData = Object.values(
    salarios.reduce((acc, s) => {
      const nome = s.Funcionario?.Membro?.nome || "—";
      if (!acc[nome]) {
        acc[nome] = { nome, Salário: 0, Subsídios: 0 };
      }
      acc[nome].Salário += s.salario_liquido;
      acc[nome].Subsídios += s.total_subsidios;
      return acc;
    }, {})
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 8,
        px: { xs: 2, md: 6 },
        background: "linear-gradient(180deg,#f8fbff 0%, #e3f2fd 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: "100%", maxWidth: 1200 }}
      >
        <Typography
          variant="h4"
          fontWeight={900}
          textAlign="center"
          sx={{
            mb: 4,
            color: "#0d47a1",
            fontFamily: "'Poppins', sans-serif",
            textShadow: "0 3px 8px rgba(13,71,161,0.25)",
          }}
        >
          💼 Painel Premium — Gestão de Salários
        </Typography>

        <Card
          elevation={10}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(13,71,161,0.15)",
          }}
        >
          <CardContent sx={{ backgroundColor: "#fff", p: 4 }}>
            {/* 🔍 Filtros */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 4,
                justifyContent: "center",
              }}
            >
              <TextField
                label="Mês Inicial"
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                sx={{ minWidth: 180 }}
              />
              <TextField
                label="Mês Final (opcional)"
                type="month"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                sx={{ minWidth: 180 }}
              />
              <FormControl sx={{ minWidth: 220 }}>
                <InputLabel>Funcionário</InputLabel>
                <Select
                  value={selectedFuncionario}
                  label="Funcionário"
                  onChange={(e) => setSelectedFuncionario(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  {funcionarios.map((f) => (
                    <MenuItem key={f.id} value={f.id}>
                      {f.Membro.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button onClick={handleFiltrar} sx={buttonStyle("contained")}>
                Filtrar
              </Button>
              <Button onClick={handleReset} sx={buttonStyle("outlined")}>
                Resetar
              </Button>
            </Box>

            {/* 📁 Exportações */}
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Button
                onClick={exportarPDF}
                disabled={salarios.length === 0}
                sx={{ ...buttonStyle("outlined"), mr: 2 }}
              >
                Exportar PDF
              </Button>
              <Button
                onClick={exportarExcel}
                disabled={salarios.length === 0}
                sx={buttonStyle("outlined")}
              >
                Exportar Excel
              </Button>
            </Box>

            {/* 📊 Tabela */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <>
                {mensagem && (
                  <Typography
                    color="error"
                    fontWeight="bold"
                    textAlign="center"
                    mb={2}
                  >
                    {mensagem}
                  </Typography>
                )}

                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 6px 20px rgba(13,71,161,0.1)",
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow
                        sx={{
                          background: "linear-gradient(90deg,#0d47a1,#1565c0)",
                        }}
                      >
                        {[
                          "Funcionário",
                          "Mês/Ano",
                          "Salário Base",
                          "Subsídios",
                          "Descontos",
                          "Salário Líquido",
                        ].map((head) => (
                          <TableCell
                            key={head}
                            sx={{
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: "0.95rem",
                            }}
                            align={head === "Funcionário" ? "left" : "right"}
                          >
                            {head}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salarios.length > 0 ? (
                        salarios.map((s) => (
                          <TableRow
                            key={s.id}
                            hover
                            sx={{
                              "&:hover": {
                                backgroundColor: "#e3f2fd",
                              },
                            }}
                          >
                            <TableCell>
                              {s.Funcionario?.Membro?.nome || "—"}
                            </TableCell>
                            <TableCell>{s.mes_ano}</TableCell>
                            <TableCell align="right">
                              Kz {s.salario_base.toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              Kz {s.total_subsidios.toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              Kz{" "}
                              {(
                                s.salario_base +
                                s.total_subsidios -
                                s.salario_liquido
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: 700, color: "#0d47a1" }}
                            >
                              Kz {s.salario_liquido.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            Nenhum salário encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* 📈 Gráfico agrupado por funcionário */}
                {chartData.length > 0 && (
                  <Box sx={{ mt: 6, height: 400 }}>
                    <Typography
                      variant="h6"
                      textAlign="center"
                      mb={2}
                      sx={{ color: "#0d47a1", fontWeight: 700 }}
                    >
                      Evolução dos Salários Líquidos por Funcionário
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Salário" fill="#1976d2" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Subsídios" fill="#90caf9" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
