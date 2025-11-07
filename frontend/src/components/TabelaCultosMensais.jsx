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
  Fade,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import api from "../api/axiosConfig";
import { TrendingUp, EventAvailable, CheckCircle, Cancel } from "@mui/icons-material";

export default function ResumoCultos() {
  const [resumo, setResumo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetchResumo();
  }, []);

  const fetchResumo = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cultos/resumo-mensal");
      setResumo(res.data.resumo || []);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar o resumo mensal dos cultos.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          background: "linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 100%)",
        }}
      >
        <CircularProgress size={70} thickness={5} color="primary" />
      </Box>
    );
  }

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          mt: 4,
          maxWidth: "95%",
          mx: "auto",
          minHeight: "85vh",
          pb: 6,
          background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
          borderRadius: "20px",
          boxShadow: "0 0 30px rgba(0,0,0,0.1)",
          p: 5,
        }}
      >
        {/* Título principal */}
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 1,
            fontWeight: 800,
            color: "#0d47a1",
            textShadow: "0px 1px 4px rgba(13,71,161,0.3)",
          }}
        >
          📊 Resumo Mensal de Cultos
        </Typography>
        <Typography
          align="center"
          sx={{
            mb: 5,
            color: "#546e7a",
            fontSize: "1.1rem",
          }}
        >
          Acompanhe a evolução mensal dos cultos realizados e programados.
        </Typography>

        {erro && (
          <Alert severity="error" sx={{ mb: 3, mx: "auto", width: "80%" }}>
            {erro}
          </Alert>
        )}

        {/* Cards de estatísticas gerais */}
        {resumo.length > 0 && (
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 4,
                  background: "linear-gradient(135deg, #2196f3, #64b5f6)",
                  color: "white",
                  boxShadow: "0 10px 25px rgba(33,150,243,0.4)",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)" },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <EventAvailable sx={{ fontSize: 45, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total de Cultos
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {resumo.reduce((acc, cur) => acc + cur.total, 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 4,
                  background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                  color: "white",
                  boxShadow: "0 10px 25px rgba(25,118,210,0.4)",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)" },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <TrendingUp sx={{ fontSize: 45, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    A Realizar
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {resumo.reduce((acc, cur) => acc + cur.programados, 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 4,
                  background: "linear-gradient(135deg, #2e7d32, #66bb6a)",
                  color: "white",
                  boxShadow: "0 10px 25px rgba(46,125,50,0.4)",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)" },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <CheckCircle sx={{ fontSize: 45, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Realizados
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {resumo.reduce((acc, cur) => acc + cur.realizados, 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 4,
                  background: "linear-gradient(135deg, #c62828, #ef5350)",
                  color: "white",
                  boxShadow: "0 10px 25px rgba(198,40,40,0.4)",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)" },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Cancel sx={{ fontSize: 45, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Cancelados
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {resumo.reduce((acc, cur) => acc + cur.cancelados, 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tabela moderna */}
        {resumo.length === 0 ? (
          <Typography align="center" sx={{ mt: 4 }}>
            Nenhum dado encontrado.
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              width: "95%",
              mx: "auto",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: "linear-gradient(90deg, #0d47a1, #1565c0)",
                  }}
                >
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                    }}
                  >
                    Mês
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">
                    Total
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">
                    A Realizar
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">
                    Realizados
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">
                    Cancelados
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {resumo.map((item, i) => (
                  <Fade in timeout={400 + i * 120} key={i}>
                    <TableRow
                      hover
                      sx={{
                        backgroundColor: i % 2 === 0 ? "#f8fbff" : "#ffffff",
                        "&:hover": {
                          backgroundColor: "#e3f2fd",
                          transform: "scale(1.01)",
                          transition: "0.2s",
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>
                        {item.mes}
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        {item.total}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: "#1976d2", fontWeight: 700 }}
                      >
                        {item.programados}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: "#2e7d32", fontWeight: 700 }}
                      >
                        {item.realizados}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: "#c62828", fontWeight: 700 }}
                      >
                        {item.cancelados}
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Fade>
  );
}
