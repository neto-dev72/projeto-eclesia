import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  CssBaseline,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Button,
  Stack,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import api from "../api/axiosConfig";

const GradientHeader = styled(Box)(({ theme }) => ({
  borderRadius: 18,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(90deg, rgba(63,81,181,0.18), rgba(156,39,176,0.12))"
      : "linear-gradient(90deg, rgba(63,81,181,0.12), rgba(33,150,243,0.12))",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

export default function TabelaCriancas() {
  const [criancas, setCriancas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("light");
  const [filtroConsagrado, setFiltroConsagrado] = useState(null); // null = todas, true = consagradas, false = não consagradas
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#0d47a1" },
                background: { default: "#f6f9ff", paper: "#ffffff" },
                text: { primary: "#072146" },
              }
            : {
                primary: { main: "#90caf9" },
                background: { default: "#0b1020", paper: "#0f1724" },
                text: { primary: "#e6eef8" },
              }),
        },
        typography: {
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          h4: { fontWeight: 700 },
        },
      }),
    [mode]
  );

  // Função para calcular idade
  const calcularIdade = (dataNasc) => {
    if (!dataNasc) return "";
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
  };

  // Buscar crianças da API
  const carregarCriancas = async (filtro = null) => {
    setLoading(true);
    try {
      let url = "/membros/criancas";
      if (filtro === true) url += "?consagrado=true";
      if (filtro === false) url += "?consagrado=false";

      const res = await api.get(url);
      const data = res.data.map((c) => ({
        ...c,
        idade: calcularIdade(c.data_nascimento),
      }));
      setCriancas(data);
    } catch (err) {
      console.error("Erro ao buscar crianças:", err);
      setSnack({
        open: true,
        message: "Erro ao carregar crianças.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCriancas(filtroConsagrado);
  }, [filtroConsagrado]);

  // Colunas da tabela
  const columns = [
    {
      field: "foto",
      headerName: "Foto",
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <img
            src={params.value}
            alt={params.row.nome}
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #bbdefb",
            }}
          />
        ) : (
          <Box
            sx={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              background: "#bbdefb",
            }}
          />
        ),
    },
    { field: "nome", headerName: "Nome", flex: 2, minWidth: 200 },
    { field: "genero", headerName: "Gênero", flex: 1, minWidth: 120 },
    { field: "idade", headerName: "Idade", flex: 0.7, minWidth: 100 },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          py: 6,
          px: { xs: 2, sm: 4 },
          background:
            mode === "dark"
              ? "radial-gradient(1200px 400px at 10% 10%, rgba(63,81,181,0.06), transparent)"
              : "radial-gradient(1200px 400px at 90% 20%, rgba(33,150,243,0.05), transparent)",
        }}
      >
        <Container maxWidth="lg">
          {/* Cabeçalho */}
          <GradientHeader>
            <Typography variant="h4">
              Lista de{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                Crianças (0 a 6 anos)
              </Box>
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={mode === "dark"}
                  onChange={() =>
                    setMode((m) => (m === "dark" ? "light" : "dark"))
                  }
                  icon={<Brightness7 />}
                  checkedIcon={<Brightness4 />}
                />
              }
              label={mode === "dark" ? "Dark" : "Light"}
            />
          </GradientHeader>

          {/* Botões de filtro */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: 3 }}
          >
            <Button
              variant={filtroConsagrado === null ? "contained" : "outlined"}
              color="primary"
              onClick={() => setFiltroConsagrado(null)}
            >
              Todas
            </Button>
            <Button
              variant={filtroConsagrado === true ? "contained" : "outlined"}
              color="success"
              onClick={() => setFiltroConsagrado(true)}
            >
              Consagradas
            </Button>
            <Button
              variant={filtroConsagrado === false ? "contained" : "outlined"}
              color="error"
              onClick={() => setFiltroConsagrado(false)}
            >
              Não Consagradas
            </Button>
          </Stack>

          {/* Tabela */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <CircularProgress />
            </Box>
          ) : criancas.length > 0 ? (
            <Box sx={{ height: "70vh", width: "100%" }}>
              <DataGrid
                rows={criancas}
                columns={columns}
                pageSize={10}
                rowHeight={58} // 🔹 Linhas mais compactas
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  border: "none",
                  fontSize: 15,
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1e293b" : "#e3f2fd",
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                    fontSize: 16,
                    minHeight: 50,
                  },
                  "& .MuiDataGrid-row": {
                    transition: "all 0.25s ease",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(144,202,249,0.08)"
                          : "rgba(13,71,161,0.06)",
                    },
                  },
                }}
              />
            </Box>
          ) : (
            <Typography align="center" sx={{ mt: 6, color: "text.secondary" }}>
              Nenhuma criança encontrada no sistema.
            </Typography>
          )}

          {/* Snackbar */}
          <Snackbar
            open={snack.open}
            autoHideDuration={3500}
            onClose={() => setSnack((s) => ({ ...s, open: false }))}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert severity={snack.severity} sx={{ width: "100%" }}>
              {snack.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
