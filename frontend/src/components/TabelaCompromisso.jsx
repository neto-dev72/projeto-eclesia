// src/components/ListaAgendaPastoral.js
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
  MenuItem,
  Select,
  FormControl,
  Pagination,
  Fade,
  Button,
  Stack,
  InputLabel,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  CheckCircle,
  Cancel,
  Schedule,
  Event,
  Person,
  InfoOutlined,
  WorkOutline,
} from "@mui/icons-material";
import api from "../api/axiosConfig";

export default function ListaAgendaPastoral() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 6;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    document.body.style.fontFamily = "'Poppins', sans-serif";
    fetchAgendamentos();
  }, []);

  const fetchAgendamentos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tabela-comprimisso");
      setAgendamentos(res.data.agendamentos || []);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar a agenda pastoral.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, novoStatus) => {
    try {
      await api.put(`/agenda-pastoral/${id}/status`, { status: novoStatus });
      setAgendamentos((prev) =>
        prev.map((ag) => (ag.id === id ? { ...ag, status: novoStatus } : ag))
      );
      setSucesso("✅ Status atualizado com sucesso!");
      setTimeout(() => setSucesso(""), 2500);
    } catch (err) {
      console.error(err);
      setErro("Erro ao atualizar status.");
    }
  };

  const handleFiltroChange = (e) => {
    setFiltroStatus(e.target.value);
    setPagina(1);
  };

  const agendamentosFiltrados =
    filtroStatus === "Todos"
      ? agendamentos
      : agendamentos.filter((a) => a.status === filtroStatus);

  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const agendamentosPaginados = agendamentosFiltrados.slice(inicio, fim);

  const statusChip = (status) => {
    const map = {
      Pendente: {
        label: "Pendente",
        color: "#1565c0",
        bg: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
        icon: <Schedule fontSize="small" />,
      },
      Concluido: {
        label: "Concluído",
        color: "#2e7d32",
        bg: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
        icon: <CheckCircle fontSize="small" />,
      },
      Cancelado: {
        label: "Cancelado",
        color: "#c62828",
        bg: "linear-gradient(135deg, #ffebee, #ffcdd2)",
        icon: <Cancel fontSize="small" />,
      },
    };
    const s = map[status] || map.Pendente;
    return (
      <Chip
        icon={s.icon}
        label={s.label}
        sx={{
          fontWeight: 600,
          color: s.color,
          background: s.bg,
          borderRadius: "30px",
          px: 1.5,
          py: 0.5,
          boxShadow: `0 0 8px ${s.color}33`,
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
    <Fade in timeout={600}>
      <Box
        sx={{
          mt: 4,
          maxWidth: "96%",
          mx: "auto",
          minHeight: "85vh",
          pb: 8,
          pt: 4,
          px: 3,
          background: "linear-gradient(180deg, #ffffff, #f6f9fc)",
          borderRadius: "20px",
          boxShadow: "0 10px 35px rgba(0,0,0,0.1)",
        }}
      >
        {/* TÍTULO */}
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 1,
            fontWeight: 800,
            color: "#0d47a1",
            textShadow: "0px 1px 4px rgba(13,71,161,0.25)",
            letterSpacing: "-0.5px",
          }}
        >
          📅 Agenda Pastoral
        </Typography>
        <Typography
          align="center"
          sx={{
            mb: 4,
            color: "#607d8b",
            fontSize: "1.1rem",
            fontWeight: 500,
          }}
        >
          Visualize e gerencie os compromissos com estilo premium.
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
              onChange={handleFiltroChange}
              label="Status"
              sx={{
                borderRadius: 3,
                backgroundColor: "#f8faff",
                boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                fontWeight: 600,
              }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Concluido">Concluído</MenuItem>
              <MenuItem value="Cancelado">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* TABELA PREMIUM RESPONSIVA */}
        {!isMobile ? (
          <TableContainer
            component={Paper}
            sx={{
              width: "100%",
              borderRadius: 4,
              boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
              overflowX: "auto",
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
                    "Tipo de Compromisso",
                    "Pessoa / Local",
                    "Responsável",
                    "Data e Hora",
                    "Status",
                    "Alterar Status",
                    "Observações",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {agendamentosPaginados.map((ag, i) => (
                  <Fade in timeout={300 + i * 100} key={ag.id}>
                    <TableRow
                      hover
                      sx={{
                        backgroundColor: i % 2 === 0 ? "#f9fbff" : "#ffffff",
                        "&:hover": {
                          backgroundColor: "#e3f2fd",
                          transition: "0.3s",
                        },
                      }}
                    >
                      <TableCell>
                        <WorkOutline sx={{ color: "#1565c0", mr: 1 }} />
                        {ag.tipo_cumprimento}
                      </TableCell>
                      <TableCell>
                        <Person sx={{ color: "#0d47a1", mr: 1 }} />
                        {ag.nome_pessoa}
                      </TableCell>
                      <TableCell>{ag.responsavel || "-"}</TableCell>
                      <TableCell>
                        <Event sx={{ color: "#1565c0", mr: 0.5 }} />
                        {new Date(ag.data_hora).toLocaleString("pt-PT")}
                      </TableCell>
                      <TableCell align="center">{statusChip(ag.status)}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {["Pendente", "Concluido", "Cancelado"].map((s) => (
                            <Button
                              key={s}
                              variant={ag.status === s ? "contained" : "outlined"}
                              size="small"
                              onClick={() => handleStatusChange(ag.id, s)}
                              startIcon={
                                s === "Pendente" ? (
                                  <Schedule />
                                ) : s === "Concluido" ? (
                                  <CheckCircle />
                                ) : (
                                  <Cancel />
                                )
                              }
                              sx={{
                                borderRadius: "25px",
                                px: 2,
                                fontWeight: 600,
                                textTransform: "none",
                                background:
                                  ag.status === s
                                    ? s === "Concluido"
                                      ? "linear-gradient(90deg,#43a047,#66bb6a)"
                                      : s === "Cancelado"
                                      ? "linear-gradient(90deg,#e53935,#ef5350)"
                                      : "linear-gradient(90deg,#1976d2,#64b5f6)"
                                    : "transparent",
                                color: ag.status === s ? "#fff" : "#37474f",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                  boxShadow: "0 5px 15px rgba(0,0,0,0.25)",
                                },
                              }}
                            >
                              {s}
                            </Button>
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <InfoOutlined sx={{ mr: 0.5, color: "#1565c0" }} />
                        {ag.observacao || "-"}
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* MOBILE VIEW - CARDS PREMIUM */
          <Stack spacing={2}>
            {agendamentosPaginados.map((ag, i) => (
              <Fade in timeout={300 + i * 100} key={ag.id}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 2.5,
                    borderRadius: "18px",
                    background: "linear-gradient(145deg, #ffffff, #f1f6ff)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: "#0d47a1", mb: 1 }}
                  >
                    <WorkOutline sx={{ mr: 1, verticalAlign: "middle" }} />
                    {ag.tipo_cumprimento}
                  </Typography>

                  <Typography sx={{ color: "#37474f", mb: 0.5 }}>
                    <Person sx={{ mr: 1, verticalAlign: "middle" }} />
                    <strong>{ag.nome_pessoa}</strong>
                  </Typography>

                  <Typography sx={{ color: "#607d8b", mb: 0.5 }}>
                    <Event sx={{ mr: 1, verticalAlign: "middle" }} />
                    {new Date(ag.data_hora).toLocaleString("pt-PT")}
                  </Typography>

                  <Typography sx={{ color: "#455a64", mb: 1 }}>
                    <InfoOutlined sx={{ mr: 1, verticalAlign: "middle" }} />
                    {ag.observacao || "Sem observações"}
                  </Typography>

                  <Box sx={{ mb: 1 }}>{statusChip(ag.status)}</Box>

                  <Stack direction="row" spacing={1.5} flexWrap="wrap">
                    {["Pendente", "Concluido", "Cancelado"].map((s) => (
                      <Button
                        key={s}
                        variant={ag.status === s ? "contained" : "outlined"}
                        size="small"
                        onClick={() => handleStatusChange(ag.id, s)}
                        startIcon={
                          s === "Pendente" ? (
                            <Schedule />
                          ) : s === "Concluido" ? (
                            <CheckCircle />
                          ) : (
                            <Cancel />
                          )
                        }
                        sx={{
                          borderRadius: "25px",
                          px: 1.5,
                          fontWeight: 600,
                          textTransform: "none",
                          background:
                            ag.status === s
                              ? s === "Concluido"
                                ? "linear-gradient(90deg,#43a047,#66bb6a)"
                                : s === "Cancelado"
                                ? "linear-gradient(90deg,#e53935,#ef5350)"
                                : "linear-gradient(90deg,#1976d2,#64b5f6)"
                              : "transparent",
                          color: ag.status === s ? "#fff" : "#37474f",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.25)",
                          },
                        }}
                      >
                        {s}
                      </Button>
                    ))}
                  </Stack>
                </Paper>
              </Fade>
            ))}
          </Stack>
        )}

        {/* PAGINAÇÃO */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={Math.ceil(agendamentosFiltrados.length / itensPorPagina)}
            page={pagina}
            onChange={(e, val) => setPagina(val)}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "50%",
                fontWeight: 600,
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
          © {new Date().getFullYear()} Sistema Pastoral — Interface Premium ✨
        </Box>
      </Box>
    </Fade>
  );
}
