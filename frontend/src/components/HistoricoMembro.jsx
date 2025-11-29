// components/HistoricoMembro.jsx
import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Divider,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function HistoricoMembro({ historico, onClose }) {
  if (!historico) return null;

  const { status, totalGeral, quantidadeContribuicoes, resumoPorTipoGeral, historicoPorMes } = historico;

  return (
    <Box sx={{ position: "relative", p: { xs: 3, md: 4 }, color: "#e6eef8" }}>
      {/* Botão Fechar */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          color: "#e6eef8",
          bgcolor: "rgba(0,0,0,0.2)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.3)" },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Cabeçalho */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1,
            background: "linear-gradient(90deg,#00e5ff,#7c4dff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Histórico de Contribuições
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(230,238,248,0.7)" }}>
          Status: {status || "-"} • Total Geral: {totalGeral?.toLocaleString() || "0"} • Contribuições: {quantidadeContribuicoes || 0}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

      {/* Resumo Geral por Tipo */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#e6eef8" }}>
          Resumo Geral por Tipo de Contribuição
        </Typography>
        <Grid container spacing={2}>
          {resumoPorTipoGeral && resumoPorTipoGeral.length > 0 ? (
            resumoPorTipoGeral.map((r, idx) => (
              <Grid item xs={12} sm={4} key={idx}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.03)",
                    color: "#e6eef8",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    {r.tipo || "-"}
                  </Typography>
                  <Typography variant="body2">
                    Total: {r.total?.toLocaleString() || "0"}
                  </Typography>
                  <Typography variant="body2">
                    Percentual: {r.percentual || "0%"}
                  </Typography>
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography sx={{ color: "rgba(230,238,248,0.7)" }}>Nenhum registro encontrado.</Typography>
          )}
        </Grid>
      </Box>

      {/* Histórico por Ano/Mês */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, color: "#e6eef8" }}>
          Histórico por Mês
        </Typography>
        {historicoPorMes && historicoPorMes.length > 0 ? (
          historicoPorMes.map((mesItem, idx) => (
            <Box key={idx} sx={{ mb: 3, p: 2, borderRadius: 2, background: "rgba(255,255,255,0.03)" }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                {new Date(mesItem.mes + "-01").toLocaleString("pt-BR", { month: "long", year: "numeric" })} • Total Mensal: {mesItem.totalMensal.toLocaleString()}
              </Typography>

              {/* Tabela por Tipo dentro do mês */}
              <Table size="small" sx={{ mb: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#e6eef8", fontWeight: 600 }}>Tipo</TableCell>
                    <TableCell sx={{ color: "#e6eef8", fontWeight: 600 }}>Total</TableCell>
                    <TableCell sx={{ color: "#e6eef8", fontWeight: 600 }}>Percentual</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mesItem.tipos.map((t, tidx) => (
                    <TableRow key={tidx}>
                      <TableCell sx={{ color: "#e6eef8" }}>{t.tipo}</TableCell>
                      <TableCell sx={{ color: "#e6eef8" }}>{t.total.toLocaleString()}</TableCell>
                      <TableCell sx={{ color: "#e6eef8" }}>{t.percentual}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ))
        ) : (
          <Typography sx={{ color: "rgba(230,238,248,0.7)" }}>Nenhuma contribuição encontrada.</Typography>
        )}
      </Box>
    </Box>
  );
}
