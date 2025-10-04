// components/HistoricoMembro.jsx
import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function HistoricoMembro({ historico, onClose }) {
  if (!historico) return null;

  const { status, totalGeral, quantidadeContribuicoes, resumoPorTipo, contribuicoes } = historico;

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

      {/* Resumo por tipo */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#e6eef8" }}>
          Resumo por Tipo de Contribuição
        </Typography>
        <Grid container spacing={2}>
          {resumoPorTipo && resumoPorTipo.length > 0 ? (
            resumoPorTipo.map((r, idx) => (
              <Grid item xs={12} sm={4} key={idx}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.03)",
                    color: "#e6eef8",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#e6eef8" }}>
                    {r.tipo || "-"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e6eef8" }}>
                    Total: {r.total?.toLocaleString() || "0"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e6eef8" }}>
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

      {/* Tabela de contribuições */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, color: "#e6eef8" }}>
          Detalhes das Contribuições
        </Typography>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#e6eef8", fontWeight: 600 }}>Data</TableCell>
              <TableCell sx={{ color: "#e6eef8", fontWeight: 600 }}>Tipo</TableCell>
              <TableCell sx={{ color: "#e6eef8", fontWeight: 600 }}>Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contribuicoes && contribuicoes.length > 0 ? (
              contribuicoes.map((c, idx) => {
                const tipo = c.TipoContribuicao?.nome || "-";
                const valor = c.valor ? parseFloat(c.valor).toLocaleString() : "-";
                const data = c.data ? new Date(c.data).toLocaleDateString() : "-";

                return (
                  <TableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ color: "#e6eef8" }}>{data}</TableCell>
                    <TableCell sx={{ color: "#e6eef8" }}>{tipo}</TableCell>
                    <TableCell sx={{ color: "#e6eef8" }}>{valor}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: "center", color: "rgba(230,238,248,0.7)" }}>
                  Nenhuma contribuição encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
