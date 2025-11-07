// src/components/ListaAtendimentos.js
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
  MenuItem,
  Select,
  InputLabel,
  Fade,
  Pagination,
  Stack,
  Button,
  Chip,
  useMediaQuery,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Schedule,
  Person,
  Event,
  InfoOutlined,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import api from "../api/axiosConfig";

export default function ListaAtendimentos() {
  const [atendimentos, setAtendimentos] = useState([]);
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
    fetchAtendimentos();
  }, []);

  const fetchAtendimentos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tabela-atendimentos");
      setAtendimentos(res.data.atendimentos || []);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar atendimentos.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, novoStatus) => {
    try {
      await api.put(`/atendimentos/${id}/status`, { status: novoStatus });
      setAtendimentos((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: novoStatus } : a))
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

  const atendimentosFiltrados =
    filtroStatus === "Todos"
      ? atendimentos
      : atendimentos.filter((a) => a.status === filtroStatus);

  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const atendimentosPaginados = atendimentosFiltrados.slice(inicio, fim);

  const statusChip = (status) => {
    const map = {
      Agendado: {
        label: "Agendado",
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
    const s = map[status] || map.Agendado;
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
          💬 Atendimentos Pastorais
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
          Gerencie, acompanhe e atualize os atendimentos com estilo premium.
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
              <MenuItem value="Agendado">Agendado</MenuItem>
              <MenuItem value="Concluido">Concluído</MenuItem>
              <MenuItem value="Cancelado">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* TABELA PREMIUM SEM ROLAGEM HORIZONTAL */}
        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            borderRadius: 4,
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
            overflow: "hidden",
            background: "linear-gradient(180deg,#ffffff,#f8fbff)",
          }}
        >
          <Table sx={{ width: "100%" }}>
            {!isMobile && (
              <TableHead>
                <TableRow
                  sx={{
                    background: "linear-gradient(90deg, #0d47a1, #1565c0)",
                  }}
                >
                  {[
                    "Pastor / Membro",
                    "Criado por",
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
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
            )}

            <TableBody>
              {atendimentosPaginados.map((a, i) => (
                <Fade in timeout={300 + i * 100} key={a.id}>
                  <TableRow
                    sx={{
                      display: isMobile ? "block" : "table-row",
                      background: isMobile
                        ? "linear-gradient(135deg, #ffffff, #f4f7ff)"
                        : i % 2 === 0
                        ? "#f9fbff"
                        : "#ffffff",
                      borderRadius: isMobile ? "18px" : 0,
                      boxShadow: isMobile
                        ? "0 4px 14px rgba(0,0,0,0.08)"
                        : "none",
                      mb: isMobile ? 2 : 0,
                      p: isMobile ? 2 : 0,
                      "&:hover": {
                        background: isMobile
                          ? "linear-gradient(135deg,#f8fbff,#e3f2fd)"
                          : "#e3f2fd",
                        transition: "0.3s",
                      },
                    }}
                  >
                    {isMobile ? (
                      <TableCell sx={{ display: "block", p: 2 }}>
                        <Stack spacing={1.2}>
                          <Box display="flex" alignItems="center">
                            <Person sx={{ color: "#0d47a1", mr: 1 }} />
                            <Typography fontWeight={700}>
                              {a.Membro?.nome || "-"}
                            </Typography>
                          </Box>

                          <Typography sx={{ color: "#607d8b" }}>
                            📞 {a.Membro?.telefone || "Sem telefone"}
                          </Typography>

                          <Typography sx={{ color: "#607d8b" }}>
                            👤 Criado por: {a.Usuario?.nome || "-"}
                          </Typography>

                          <Typography sx={{ color: "#607d8b" }}>
                            📅 {new Date(a.data_hora).toLocaleString("pt-PT")}
                          </Typography>

                          <Box>{statusChip(a.status)}</Box>

                          <Box>
                            <Typography
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "#455a64",
                              }}
                            >
                              <InfoOutlined
                                sx={{
                                  mr: 0.5,
                                  color: "#1565c0",
                                }}
                              />
                              {a.observacoes || "Sem observações"}
                            </Typography>
                          </Box>

                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            flexWrap="wrap"
                            mt={1}
                          >
                            {["Agendado", "Concluido", "Cancelado"].map((s) => (
                              <Button
                                key={s}
                                variant={
                                  a.status === s ? "contained" : "outlined"
                                }
                                size="small"
                                onClick={() => handleStatusChange(a.id, s)}
                                startIcon={
                                  s === "Agendado" ? (
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
                                    a.status === s
                                      ? s === "Concluido"
                                        ? "linear-gradient(90deg,#43a047,#66bb6a)"
                                        : s === "Cancelado"
                                        ? "linear-gradient(90deg,#e53935,#ef5350)"
                                        : "linear-gradient(90deg,#1976d2,#64b5f6)"
                                      : "transparent",
                                  color: a.status === s ? "#fff" : "#37474f",
                                  "&:hover": {
                                    transform: "scale(1.05)",
                                  },
                                }}
                              >
                                {s}
                              </Button>
                            ))}
                          </Stack>
                        </Stack>
                      </TableCell>
                    ) : (
                      <>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Person sx={{ color: "#0d47a1" }} />
                            <Box>
                              <Typography fontWeight={600}>
                                {a.Membro?.nome || "-"}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "#607d8b" }}
                              >
                                {a.Membro?.telefone || ""}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>{a.Usuario?.nome || "-"}</TableCell>
                        <TableCell>
                          {new Date(a.data_hora).toLocaleString("pt-PT")}
                        </TableCell>
                        <TableCell align="center">
                          {statusChip(a.status)}
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            flexWrap="wrap"
                          >
                            {["Agendado", "Concluido", "Cancelado"].map((s) => (
                              <Button
                                key={s}
                                variant={
                                  a.status === s ? "contained" : "outlined"
                                }
                                size="small"
                                onClick={() => handleStatusChange(a.id, s)}
                                startIcon={
                                  s === "Agendado" ? (
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
                                    a.status === s
                                      ? s === "Concluido"
                                        ? "linear-gradient(90deg,#43a047,#66bb6a)"
                                        : s === "Cancelado"
                                        ? "linear-gradient(90deg,#e53935,#ef5350)"
                                        : "linear-gradient(90deg,#1976d2,#64b5f6)"
                                      : "transparent",
                                  color: a.status === s ? "#fff" : "#37474f",
                                }}
                              >
                                {s}
                              </Button>
                            ))}
                          </Stack>
                        </TableCell>
                        <TableCell>{a.observacoes || "-"}</TableCell>
                      </>
                    )}
                  </TableRow>
                </Fade>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINAÇÃO */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={Math.ceil(atendimentosFiltrados.length / itensPorPagina)}
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
