import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Button,
  Box,
  Stack,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  CssBaseline,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Fade,
  Slide,
} from "@mui/material";
import { Brightness4, Brightness7, FilterAlt } from "@mui/icons-material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import api from "../../api/axiosConfig";

/* ---------- Styled ---------- */
const GlassCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))"
      : "rgba(255,255,255,0.70)",
  backdropFilter: "blur(8px)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 30px rgba(2,6,23,0.6)"
      : "0 10px 30px rgba(15,23,42,0.08)",
  transition: "transform 250ms ease, box-shadow 250ms ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 14px 45px rgba(2,6,23,0.75)"
        : "0 20px 50px rgba(15,23,42,0.12)",
  },
}));

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

export default function RelatorioMembros() {
  const [filtros, setFiltros] = useState({
    generos: [],
    estadosCivis: [],
    profissoes: [],
    idades: [],
    batizados: [],
  });

  const [filtroAtivo, setFiltroAtivo] = useState({
    generos: [],
    estadosCivis: [],
    profissoes: [],
    idades: [],
    batizados: [],
  });

  const [relatorio, setRelatorio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("dark");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  // Busca filtros iniciais com contagem de membros
  useEffect(() => {
    const fetchFiltros = async () => {
      try {
        const res = await api.get("/membros-filtros");
        const data = res.data;

        // Adiciona contagem nos labels
        const addContagem = (arr, campo) => {
          return arr.map((val) => {
            const valorSemParenteses = val.replace(/\s\(\d+\smembros\)$/, "");
            const count = data.membros.filter((m) => {
              if (campo === "batizados") return m.batizadoStatus === valorSemParenteses;
              if (campo === "idades") {
                const idade = m.idade || 0;
                if (valorSemParenteses === "0-18") return idade >= 0 && idade <= 18;
                if (valorSemParenteses === "19-30") return idade >= 19 && idade <= 30;
                if (valorSemParenteses === "31-50") return idade >= 31 && idade <= 50;
                if (valorSemParenteses === "51+") return idade >= 51;
              }
              return m[campo] === valorSemParenteses;
            }).length;
            return `${valorSemParenteses} (${count} membros)`;
          });
        };

        setFiltros({
          generos: addContagem(data.filtros.generos, "genero"),
          estadosCivis: addContagem(data.filtros.estadosCivis, "estado_civil"),
          profissoes: addContagem(data.filtros.profissoes, "profissao"),
          idades: addContagem(data.filtros.idades, "idades"),
          batizados: addContagem(data.filtros.batizados, "batizados"),
        });
      } catch (err) {
        console.error(err);
        setSnack({ open: true, message: "Erro ao carregar filtros.", severity: "error" });
      }
    };
    fetchFiltros();
  }, []);

  const handleChange = (e, key) => {
    const { value } = e.target;
    // Remove contagem ao atualizar o filtro ativo
    const selecionados = typeof value === "string" ? value.split(",") : value;
    setFiltroAtivo({
      ...filtroAtivo,
      [key]: selecionados.map((v) => v.replace(/\s\(\d+\smembros\)$/, "")),
    });
  };

  const gerarRelatorio = async () => {
    setLoading(true);
    try {
      const res = await api.post("/membros-relatorio", filtroAtivo);
      setRelatorio(res.data);
      setSnack({ open: true, message: "Relatório gerado com sucesso.", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Erro ao gerar relatório.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#0f52ba" },
                background: { default: "#f6f9ff", paper: "#ffffff" },
                text: { primary: "#072146" },
              }
            : {
                primary: { main: "#8ab4f8" },
                background: { default: "#0b1020", paper: "#0f1724" },
                text: { primary: "#e6eef8" },
              }),
        },
        typography: {
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          h3: { fontWeight: 800 },
          h5: { fontWeight: 700 },
        },
      }),
    [mode]
  );

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
              ? "radial-gradient(1200px 400px at 10% 10%, rgba(63,81,181,0.06), transparent), linear-gradient(180deg, rgba(0,0,0,0.25), transparent)"
              : "radial-gradient(1200px 400px at 90% 20%, rgba(33,150,243,0.06), transparent), linear-gradient(180deg, rgba(255,255,255,0.6), transparent)",
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <GradientHeader>
            <Box>
              <Fade in>
                <Typography variant="h3" sx={{ lineHeight: 1 }}>
                  Relatório de <Box component="span" sx={{ color: "primary.main" }}>Membros</Box>
                </Typography>
              </Fade>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Gere relatórios detalhados de membros aplicando múltiplos filtros.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === "dark"}
                    onChange={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
                    icon={<Brightness7 />}
                    checkedIcon={<Brightness4 />}
                  />
                }
                label={mode === "dark" ? "Dark" : "Light"}
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<FilterAlt />}
                onClick={gerarRelatorio}
                disabled={loading}
                sx={{ textTransform: "none", px: 2.5, py: 1.1, borderRadius: 12, fontWeight: 700 }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Gerar Relatório"}
              </Button>
            </Stack>
          </GradientHeader>

          {/* Filtros */}
          <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 2, flexWrap: "wrap" }}>
            {[
              { key: "generos", label: "Gênero", values: filtros.generos },
              { key: "estadosCivis", label: "Estado Civil", values: filtros.estadosCivis },
              { key: "profissoes", label: "Profissão", values: filtros.profissoes },
              { key: "idades", label: "Idade", values: filtros.idades },
              { key: "batizados", label: "Batizado", values: filtros.batizados },
            ].map(({ key, label, values }) => (
              <FormControl key={key} sx={{ minWidth: 220, mb: 2 }}>
                <InputLabel>{label}</InputLabel>
                <Select
                  multiple
                  value={filtroAtivo[key]}
                  onChange={(e) => handleChange(e, key)}
                  input={<OutlinedInput label={label} />}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {values.map((val, i) => {
                    // Remove qualquer contagem duplicada antes de renderizar
                    const valorReal = val.replace(/\s\(\d+\smembros\)$/, "");
                    const count = val.match(/\((\d+)\smembros\)/)?.[1] || 0;
                    return (
                      <MenuItem key={i} value={valorReal}>
                        <Checkbox checked={filtroAtivo[key].indexOf(valorReal) > -1} />
                        <ListItemText primary={`${valorReal} (${count} membros)`} />
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            ))}
          </Stack>

          {/* Filtros aplicados (chips) */}
          {Object.entries(filtroAtivo).some(([k, v]) => v.length > 0) && (
            <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap" }}>
              {Object.entries(filtroAtivo).map(([key, valores]) =>
                valores.map((v) => (
                  <Chip
                    key={`${key}-${v}`}
                    label={`${key}: ${v}`}
                    color="primary"
                    onDelete={() =>
                      setFiltroAtivo((prev) => ({
                        ...prev,
                        [key]: prev[key].filter((item) => item !== v),
                      }))
                    }
                    sx={{ mb: 1 }}
                  />
                ))
              )}
            </Stack>
          )}

          {/* Resultado */}
          {relatorio.length > 0 ? (
            <Box>
              <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
                Resultado do Relatório
              </Typography>
              <Grid container spacing={4}>
                {relatorio.map((m) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={m.id}>
                    <GlassCard>
                      {m.foto && (
                        <CardMedia
                          component="img"
                          height="220"
                          image={m.foto}
                          alt={m.nome}
                          sx={{ objectFit: "cover" }}
                        />
                      )}
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {m.nome}
                        </Typography>
                        <Stack spacing={1}>
                          {m.profissao && <Chip label={`Profissão: ${m.profissao}`} color="primary" />}
                          <Chip label={`Gênero: ${m.genero}`} color="secondary" />
                          <Chip label={`Estado Civil: ${m.estado_civil}`} color="success" />
                          {m.idade && <Chip label={`Idade: ${m.idade} anos`} />}
                          <Chip label={`Batizado: ${m.batizadoStatus}`} color="warning" />
                          {m.endereco_cidade && <Chip label={`Cidade: ${m.endereco_cidade}`} />}
                        </Stack>
                      </CardContent>
                    </GlassCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            !loading && (
              <Slide direction="up" in>
                <Typography align="center" sx={{ mt: 4, color: "text.secondary" }}>
                  Nenhum membro encontrado com os filtros selecionados.
                </Typography>
              </Slide>
            )
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
