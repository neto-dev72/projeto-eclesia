// src/pages/RelatorioMembros.js
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
  Chip,
  CircularProgress,
  CssBaseline,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Fade,
  Slide,
  TextField,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  FilterAlt,
  Search,
  PictureAsPdf,
  Description,
} from "@mui/icons-material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import api from "../../api/axiosConfig";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

/* ---------- Styled ---------- */
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
    cargos: [],
    departamentos: [],
    categoriasMinisteriais: [],
    habilitacoes: [],
  });

  const [filtroAtivo, setFiltroAtivo] = useState({
    generos: [],
    estadosCivis: [],
    profissoes: [],
    idades: [],
    batizados: [],
    cargos: [],
    departamentos: [],
    categoriasMinisteriais: [],
    habilitacoes: [],
  });

  const [relatorio, setRelatorio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("light");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [search, setSearch] = useState("");

  // 🔹 Busca filtros iniciais
  useEffect(() => {
    const fetchFiltros = async () => {
      try {
        const res = await api.get("/membros-filtros");
        const data = res.data;

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
          cargos: data.filtros.cargos || [],
          departamentos: data.filtros.departamentos || [],
          categoriasMinisteriais: data.filtros.categoriasMinisteriais || [],
          habilitacoes: data.filtros.habilitacoes || [],
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

  // 📦 Exportar para Excel
  const exportarExcel = () => {
    if (relatorio.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(relatorio);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório de Membros");
    XLSX.writeFile(wb, "relatorio_membros.xlsx");
  };

  // 📦 Exportar para PDF (corrigido)
  const exportarPDF = async () => {
    if (relatorio.length === 0) return;

    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF("p", "pt");
    doc.setFontSize(14);
    doc.text("Relatório de Membros", 40, 40);

    const colunas = ["Nome", "Gênero", "Idade", "Estado Civil", "Profissão"];
    const linhas = relatorio.map((r) => [
      r.nome || "",
      r.genero || "",
      r.idade || "",
      r.estado_civil || "",
      r.profissao || "",
    ]);

    autoTable(doc, {
      head: [colunas],
      body: linhas,
      startY: 60,
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [13, 71, 161] },
    });

    doc.save("relatorio_membros.pdf");
  };

  // 🌙 Tema moderno
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
          h3: { fontWeight: 800 },
          h5: { fontWeight: 700 },
        },
      }),
    [mode]
  );

  // ✅ Colunas da tabela
  const columns = [
    {
      field: "foto",
      headerName: "Foto",
      width: 90,
      sortable: false,
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
    { field: "nome", headerName: "Nome", flex: 1.5, minWidth: 200 },
    { field: "genero", headerName: "Gênero", flex: 1 },
    { field: "idade", headerName: "Idade", flex: 0.7 },
    { field: "estado_civil", headerName: "Estado Civil", flex: 1 },
    { field: "profissao", headerName: "Profissão", flex: 1 },
  ];

  const filteredRelatorio = relatorio.filter((m) =>
    m.nome?.toLowerCase().includes(search.toLowerCase())
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
              ? "radial-gradient(1200px 400px at 10% 10%, rgba(63,81,181,0.06), transparent)"
              : "radial-gradient(1200px 400px at 90% 20%, rgba(33,150,243,0.05), transparent)",
        }}
      >
        <Container maxWidth="xl">
          {/* Cabeçalho */}
          <GradientHeader>
            <Box>
              <Fade in>
                <Typography variant="h3" sx={{ lineHeight: 1 }}>
                  Relatório de{" "}
                  <Box component="span" sx={{ color: "primary.main" }}>
                    Membros
                  </Box>
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
                sx={{
                  textTransform: "none",
                  px: 2.5,
                  py: 1.1,
                  borderRadius: 12,
                  fontWeight: 700,
                }}
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
              { key: "cargos", label: "Cargo", values: filtros.cargos },
              { key: "departamentos", label: "Departamento", values: filtros.departamentos },
              { key: "categoriasMinisteriais", label: "Categoria Ministerial", values: filtros.categoriasMinisteriais },
              { key: "habilitacoes", label: "Habilitações", values: filtros.habilitacoes },
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

          {/* Chips de Filtros Ativos */}
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
            <Box sx={{ mt: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h4" fontWeight="bold">
                  Resultado do Relatório
                </Typography>
                <TextField
                  size="small"
                  placeholder="Buscar por nome..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />
              </Stack>

              {/* Botões de exportação */}
              <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>
                <Button variant="outlined" startIcon={<Description />} onClick={exportarExcel}>
                  Exportar Excel
                </Button>
                <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={exportarPDF}>
                  Exportar PDF
                </Button>
              </Stack>

              <Box sx={{ height: "70vh", width: "100%" }}>
                <DataGrid
                  rows={filteredRelatorio}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  disableSelectionOnClick
                  sx={{
                    borderRadius: 4,
                    boxShadow: 4,
                    border: "none",
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#1e293b" : "#e3f2fd",
                      color: theme.palette.text.primary,
                      fontWeight: 700,
                      fontSize: 16,
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
