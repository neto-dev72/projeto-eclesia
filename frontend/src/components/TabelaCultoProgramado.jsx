import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Pagination,
  Button,
  Fade,
  Stack,
  Chip,
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  EventAvailable,
  AccessTime,
  LocationOn,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import api from "../api/axiosConfig";

export default function ListaCultos() {
  const [cultos, setCultos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 6;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchCultos();
  }, []);

  const fetchCultos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tabela-cultos");
      setCultos(res.data.cultos || []);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar cultos.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, novoStatus) => {
    try {
      await api.put(`/cultos/${id}/status`, { status: novoStatus });
      setCultos((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: novoStatus } : c))
      );
      setSucesso("✅ Status atualizado com sucesso!");
      setTimeout(() => setSucesso(""), 2500);
    } catch (err) {
      console.error(err);
      setErro("Erro ao atualizar status.");
    }
  };

  const cultosFiltrados =
    filtroStatus === "Todos"
      ? cultos
      : cultos.filter((c) => c.status === filtroStatus);

  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const cultosPaginados = cultosFiltrados.slice(inicio, fim);

  // Chips Premium
  const statusChip = (status) => {
    const map = {
      programado: {
        label: "Programado",
        color: "#1976d2",
        bg: "linear-gradient(145deg, #e3f2fd, #bbdefb)",
        glow: "rgba(25, 118, 210, 0.3)",
        icon: <EventAvailable fontSize="small" />,
      },
      realizado: {
        label: "Realizado",
        color: "#2e7d32",
        bg: "linear-gradient(145deg, #e8f5e9, #c8e6c9)",
        glow: "rgba(46, 125, 50, 0.3)",
        icon: <CheckCircle fontSize="small" />,
      },
      cancelado: {
        label: "Cancelado",
        color: "#c62828",
        bg: "linear-gradient(145deg, #ffebee, #ffcdd2)",
        glow: "rgba(198, 40, 40, 0.3)",
        icon: <Cancel fontSize="small" />,
      },
    };
    const s = map[status] || map.programado;
    return (
      <Chip
        icon={s.icon}
        label={s.label}
        sx={{
          fontWeight: 700,
          color: s.color,
          background: s.bg,
          borderRadius: "25px",
          px: 1.5,
          py: 0.5,
          boxShadow: `0 0 12px ${s.glow}`,
          "& .MuiChip-icon": { color: s.color },
        }}
      />
    );
  };

  if (loading)
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e3f2fd, #e8f5e9)",
        }}
      >
        <CircularProgress size={70} thickness={5} color="primary" />
      </Box>
    );

  return (
    <Fade in timeout={700}>
      <Box
        sx={{
          mt: 4,
          maxWidth: "96%",
          mx: "auto",
          minHeight: "85vh",
          pb: 8,
          pt: 4,
          px: 3,
          background: "linear-gradient(180deg, #ffffff, #f5f8ff)",
          borderRadius: "24px",
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          backdropFilter: "blur(8px)",
          transition: "all 0.4s ease",
        }}
      >
        {/* TÍTULO */}
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 1,
            fontWeight: 900,
            color: "#0d47a1",
            textShadow: "0 2px 10px rgba(13,71,161,0.25)",
            letterSpacing: 0.5,
          }}
        >
          🌟 Agendamento de Cultos
        </Typography>
        <Typography
          align="center"
          sx={{
            mb: 4,
            color: "#546e7a",
            fontSize: "1.15rem",
          }}
        >
          Gerencie cultos com um visual moderno, fluido e elegante.
        </Typography>

        {erro && (
          <Alert severity="error" sx={{ mb: 2, mx: "auto", width: "85%" }}>
            {erro}
          </Alert>
        )}
        {sucesso && (
          <Alert severity="success" sx={{ mb: 2, mx: "auto", width: "85%" }}>
            {sucesso}
          </Alert>
        )}

        {/* FILTRO */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
          <FormControl sx={{ minWidth: 240 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              label="Status"
              sx={{
                borderRadius: 4,
                backgroundColor: "#f8faff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                "&:hover": { backgroundColor: "#eef3ff" },
              }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="programado">Programado</MenuItem>
              <MenuItem value="realizado">Realizado</MenuItem>
              <MenuItem value="cancelado">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* TABELA / CARDS */}
        {!isMobile ? (
          <TableContainer
            component={Paper}
            sx={{
              width: "100%",
              borderRadius: 5,
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              overflow: "hidden",
              backdropFilter: "blur(10px)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: "linear-gradient(90deg, #0d47a1, #1565c0)",
                  }}
                >
                  {[
                    "Data e Hora",
                    "Local",
                    "Pregador / Responsável",
                    "Tipo de Culto",
                    "Status",
                    "Alterar Status",
                    "Observações",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: h === "Status" ? "center" : "left",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {cultosPaginados.map((c, i) => (
                  <Fade in timeout={300 + i * 100} key={c.id}>
                    <TableRow
                      hover
                      sx={{
                        backgroundColor: i % 2 === 0 ? "#f9fbff" : "#ffffff",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #e3f2fd, #f9f9ff)",
                          transition: "0.3s",
                        },
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AccessTime sx={{ color: "#0d47a1" }} />
                          {new Date(c.dataHora).toLocaleString("pt-PT")}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationOn sx={{ color: "#1976d2" }} />
                          {c.local || "-"}
                        </Stack>
                      </TableCell>
                      <TableCell>{c.responsavel || "-"}</TableCell>
                      <TableCell>{c.TipoCulto?.nome || "-"}</TableCell>
                      <TableCell align="center">{statusChip(c.status)}</TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                          flexWrap="wrap"
                        >
                          {["programado", "realizado", "cancelado"].map((s) => (
                            <Button
                              key={s}
                              variant={c.status === s ? "contained" : "outlined"}
                              size="small"
                              onClick={() => handleStatusChange(c.id, s)}
                              startIcon={
                                s === "programado" ? (
                                  <EventAvailable />
                                ) : s === "realizado" ? (
                                  <CheckCircle />
                                ) : (
                                  <Cancel />
                                )
                              }
                              sx={{
                                borderRadius: "25px",
                                px: 2,
                                fontWeight: 700,
                                textTransform: "none",
                                transition: "0.4s",
                                background:
                                  c.status === s
                                    ? s === "realizado"
                                      ? "linear-gradient(90deg,#43a047,#66bb6a)"
                                      : s === "cancelado"
                                      ? "linear-gradient(90deg,#e53935,#ef5350)"
                                      : "linear-gradient(90deg,#1976d2,#64b5f6)"
                                    : "transparent",
                                color: c.status === s ? "#fff" : "#37474f",
                                boxShadow:
                                  c.status === s
                                    ? "0 3px 15px rgba(0,0,0,0.25)"
                                    : "none",
                                "&:hover": {
                                  transform: "scale(1.07)",
                                  boxShadow:
                                    "0 6px 20px rgba(0,0,0,0.25)",
                                },
                              }}
                            >
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </Button>
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>{c.observacoes || "-"}</TableCell>
                    </TableRow>
                  </Fade>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          // MOBILE: Visual Premium com Cards
          <Stack spacing={3}>
            {cultosPaginados.map((c) => (
              <Card
                key={c.id}
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  background:
                    "linear-gradient(150deg, #ffffff, #f3f6ff, #ffffff)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={700} color="#0d47a1">
                    {new Date(c.dataHora).toLocaleString("pt-PT")}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    📍 {c.local || "-"}
                  </Typography>
                  <Typography variant="body2">🙌 {c.responsavel || "-"}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    ✝️ {c.TipoCulto?.nome || "-"}
                  </Typography>
                  <Box sx={{ mb: 1 }}>{statusChip(c.status)}</Box>
                  <Stack direction="row" spacing={1}>
                    {["programado", "realizado", "cancelado"].map((s) => (
                      <Button
                        key={s}
                        variant={c.status === s ? "contained" : "outlined"}
                        size="small"
                        onClick={() => handleStatusChange(c.id, s)}
                        sx={{
                          borderRadius: "25px",
                          fontWeight: 600,
                          textTransform: "none",
                        }}
                      >
                        {s}
                      </Button>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* PAGINAÇÃO */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={Math.ceil(cultosFiltrados.length / itensPorPagina)}
            page={pagina}
            onChange={(e, val) => setPagina(val)}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "50%",
                fontWeight: 600,
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  transform: "scale(1.1)",
                },
              },
            }}
          />
        </Box>

        {/* RODAPÉ */}
        <Box
          sx={{
            textAlign: "center",
            mt: 6,
            color: "#78909c",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          © {new Date().getFullYear()} Sistema de Cultos —{" "}
          <strong style={{ color: "#0d47a1" }}>Design Premium+</strong> ✨
        </Box>
      </Box>
    </Fade>
  );
}
