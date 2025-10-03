import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";

export default function TabelaCentros() {
  const [centros, setCentros] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCentros = async () => {
      try {
        const { data } = await axios.get("/tabela/centros");

        const todosTipos = new Set();
        data.forEach((c) => {
          if (c.contribuicoes) {
            Object.keys(c.contribuicoes).forEach((t) => todosTipos.add(t));
          }
        });

        setTipos([...todosTipos]);
        setCentros(data);
      } catch (error) {
        console.error("Erro ao buscar centros:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCentros();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress size={60} thickness={5} />
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        p: 4,
        mt: 4,
        borderRadius: 3,
        boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        backgroundColor: "#f9f9f9",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        fontWeight="700"
        sx={{ mb: 3, color: "#1e3c72" }}
      >
        Relatório de Centros do Ministério
      </Typography>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
              <TableCell sx={{ fontWeight: 700, color: "#1e3c72" }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e3c72" }}>Endereço</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e3c72" }}>Telefone</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: "#1e3c72" }}>
                Congregações
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: "#1e3c72" }}>
                Membros
              </TableCell>
              {tipos.map((tipo) => (
                <TableCell
                  key={tipo}
                  align="center"
                  sx={{ fontWeight: 700, color: "#1e3c72" }}
                >
                  {tipo}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {centros.map((centro, index) => (
              <TableRow
                key={centro.id}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#ffffff" },
                  "&:nth-of-type(even)": { backgroundColor: "#f1f8ff" },
                  "&:hover": { backgroundColor: "#d0e4ff", cursor: "pointer" },
                  transition: "0.3s all",
                }}
              >
                <TableCell sx={{ fontWeight: 500, color: "#1e3c72" }}>
                  {centro.nome}
                </TableCell>
                <TableCell sx={{ color: "#1a237e" }}>{centro.endereco || "—"}</TableCell>
                <TableCell sx={{ color: "#1a237e" }}>{centro.telefone || "—"}</TableCell>
                <TableCell align="center" sx={{ fontWeight: 500, color: "#0d47a1" }}>
                  {centro.totalCongregacoes}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 500, color: "#0d47a1" }}>
                  {centro.totalMembros}
                </TableCell>
                {tipos.map((tipo) => {
                  const valor = centro.contribuicoes?.[tipo] || 0;
                  return (
                    <TableCell key={tipo} align="center" sx={{ color: "#0b3d91" }}>
                      {`Kz ${Number(valor).toLocaleString("pt-PT", {
                        minimumFractionDigits: 2,
                      })}`}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
