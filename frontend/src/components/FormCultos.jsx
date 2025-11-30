// src/components/FormCultos.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Event as EventIcon,
  MonetizationOn as MoneyIcon,
  People as PeopleIcon,
  ExpandMore,
} from "@mui/icons-material";
import api from "../api/axiosConfig";
import { DeleteSweepRounded } from "@mui/icons-material";


export default function FormCultos({ culto, onSuccess, onCancel }) {
  const [tiposCulto, setTiposCulto] = useState([]);
  const [tiposContribuicao, setTiposContribuicao] = useState([]);
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    dataHora: "",
    tipoCultoId: "",
    contribuicoes: {},
    membrosContribuicoes: {},
    homens: "",
    mulheres: "",
    criancas: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [modalTipoId, setModalTipoId] = useState(null);
  const [selectedMembro, setSelectedMembro] = useState(null);
  const [valorMembro, setValorMembro] = useState("");

  const isEdit = Boolean(culto?.id);

  // Buscar dados iniciais
  useEffect(() => {
    (async () => {
      try {
        const [tiposRes, contribRes, membrosRes] = await Promise.all([
          api.get("/lista/tipos-culto"),
          api.get("/lista/tipos-contribuicao"),
          api.get("/membros"),
        ]);
        setTiposCulto(tiposRes.data);
        setTiposContribuicao(contribRes.data);
        setMembros(membrosRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    })();
  }, []);

 


  // useEffect para inicializar os dados do culto
useEffect(() => {
  if (culto) {
    const contribGeral = {};      // contribuições sem membro
    const contribPorMembro = {};  // contribuições com membro

    (culto.contribuicoes || []).forEach((c) => {
      const tipoId = c.tipoId;
      const valor = Number(c.valor);

      if (c.membroId) {
        if (!contribPorMembro[tipoId]) contribPorMembro[tipoId] = {};
        contribPorMembro[tipoId][c.membroId] = valor;
      } else {
        contribGeral[tipoId] = (contribGeral[tipoId] || 0) + valor;
      }
    });

    // total = contribuições gerais + soma de todos os membros
    const totalContribuicoes = {};

    const todosTipos = new Set([
      ...Object.keys(contribGeral),
      ...Object.keys(contribPorMembro),
    ]);

    todosTipos.forEach((tipoId) => {
      const totalGeral = contribGeral[tipoId] || 0;
      const totalMembros = contribPorMembro[tipoId]
        ? Object.values(contribPorMembro[tipoId]).reduce((a, b) => a + b, 0)
        : 0;
      totalContribuicoes[tipoId] = totalGeral + totalMembros;
    });

    setFormData({
      dataHora: culto.dataHora ? culto.dataHora.slice(0, 16) : "",
      tipoCultoId: culto.tipoCultoId || "",
      homens: culto.homens || "",
      mulheres: culto.mulheres || "",
      criancas: culto.criancas || "",
      contribuicoes: totalContribuicoes,
      membrosContribuicoes: contribPorMembro,
    });
  }
}, [culto]);





    // Remover contribuição por membro
const handleRemoveMembroContribuicao = async (tipoId, membroId) => {
  setFormData(prev => {
    const copia = { ...prev.membrosContribuicoes };
    if (copia[tipoId]) {
      delete copia[tipoId][membroId];

      // recalcular total do tipo
      const valorGeral = prev.contribuicoes[tipoId] || 0;
      const totalMembros = Object.values(copia[tipoId] || {}).reduce((a,b)=>a+b,0);

      return {
        ...prev,
        membrosContribuicoes: copia,
        contribuicoes: {
          ...prev.contribuicoes,
          [tipoId]: totalMembros + valorGeral
        }
      };
    }
    return prev;
  });

  // 👉 Se estiver editando, faz request para deletar no backend
  if (isEdit) {
    try {
      await api.delete(`/detalhes-cultos/${culto.id}/contribuicao`, {
        data: { tipoId, membroId }
      });
    } catch (error) {
      console.error("Erro ao remover contribuição no servidor:", error);
    }
  }
};




  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContribuicaoChange = (id, valor) => {
    setFormData((prev) => ({
      ...prev,
      contribuicoes: { ...prev.contribuicoes, [id]: valor },
    }));
  };


  // handleAddMembroContribuicao corrigido
const handleAddMembroContribuicao = () => {
  if (!modalTipoId || !selectedMembro || !valorMembro) return;

  const valorNum = Number(valorMembro);

  setFormData((prev) => {
    // Atualiza os membros
    const novosMembros = {
      ...(prev.membrosContribuicoes[modalTipoId] || {}),
      [selectedMembro.id]: valorNum,
    };

    // Soma total de todos os membros
    const totalMembros = Object.values(novosMembros).reduce((a, b) => a + b, 0);

    // Pega o valor geral (somente contribuições sem membro)
    const valorGeral = prev.contribuicoes[modalTipoId] || 0;

    // Total = geral + todos os membros
    const totalGeral = valorGeral + totalMembros;






    return {
      ...prev,
      membrosContribuicoes: {
        ...prev.membrosContribuicoes,
        [modalTipoId]: novosMembros,
      },
      contribuicoes: {
        ...prev.contribuicoes,
        [modalTipoId]: totalGeral,
      },
    };
  });

  setSelectedMembro(null);
  setValorMembro("");
  setModalTipoId(null);
  setOpenModal(false);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contribArray = [];

      Object.entries(formData.contribuicoes).forEach(([tipoId, valor]) => {
        if (valor) {
          contribArray.push({
            tipoId: parseInt(tipoId),
            valor: parseFloat(valor),
          });
        }
      });

      Object.entries(formData.membrosContribuicoes).forEach(
        ([tipoId, membrosObj]) => {
          Object.entries(membrosObj).forEach(([membroId, valor]) => {
            if (valor) {
              contribArray.push({
                tipoId: parseInt(tipoId),
                membroId: parseInt(membroId),
                valor: parseFloat(valor),
              });
            }
          });
        }
      );

      if (isEdit) {
        await api.put(`/detalhes-cultos/${culto.id}`, {
          dataHora: formData.dataHora,
          tipoCultoId: formData.tipoCultoId,
          homens: formData.homens,
          mulheres: formData.mulheres,
          criancas: formData.criancas,
          contribuicoes: contribArray,
        });
      } else {
        await api.post("/detalhes-cultos", {
          dataHora: formData.dataHora,
          tipoCultoId: formData.tipoCultoId,
          homens: formData.homens,
          mulheres: formData.mulheres,
          criancas: formData.criancas,
          contribuicoes: contribArray,
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar culto:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        borderRadius: 4,
        background: "linear-gradient(135deg, #f9f9ff, #eef3ff)",
      }}
    >
      {/* Cabeçalho */}
      <Typography
        variant="h3"
        fontWeight="bold"
        gutterBottom
        align="center"
        sx={{
          mb: 3,
          background: "linear-gradient(to right, #6a11cb, #2575fc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "2px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {isEdit ? "Editar Culto" : "Registrar Culto"}
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* Dados principais */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  color="primary"
                  display="flex"
                  alignItems="center"
                  gutterBottom
                  fontWeight="bold"
                >
                  <EventIcon sx={{ mr: 1 }} /> Dados do Culto
                </Typography>
                <TextField
                  label="Data e Hora"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.dataHora}
                  onChange={(e) => handleChange("dataHora", e.target.value)}
                  sx={{ mt: 2 }}
                />
                <TextField
                  select
                  label="Tipo de Culto"
                  fullWidth
                  value={formData.tipoCultoId}
                  onChange={(e) => handleChange("tipoCultoId", e.target.value)}
                  sx={{ mt: 2 }}
                >
                  {tiposCulto.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </CardContent>
            </Card>
          </Grid>

          {/* Contribuições */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  color="secondary"
                  display="flex"
                  alignItems="center"
                  gutterBottom
                  fontWeight="bold"
                >
                  <MoneyIcon sx={{ mr: 1 }} /> Contribuições
                </Typography>

                {tiposContribuicao.map((tipo) => (
                  <Box key={tipo.id} sx={{ mb: 3 }}>
                    <TextField
                      type="number"
                      label={tipo.nome}
                      fullWidth
                      value={formData.contribuicoes[tipo.id] || ""}
                      onChange={(e) =>
                        handleContribuicaoChange(tipo.id, e.target.value)
                      }
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>Kz</Typography>,
                      }}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        mt: 1,
                        borderRadius: 2,
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                      }}
                      startIcon={<ExpandMore />}
                      onClick={() => {
                        setModalTipoId(tipo.id);
                        setOpenModal(true);
                      }}
                    >
                      Adicionar por membro
                    </Button>

                    {formData.membrosContribuicoes[tipo.id] && (
                      <Table size="small" sx={{ mt: 2 }}>
                      <TableHead>
  <TableRow
    sx={{
      background: "rgba(255, 255, 255, 0.6)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    }}
  >
    <TableCell>
      <Typography fontWeight="bold" sx={{ fontSize: "1rem", color: "#334" }}>
        Membro
      </Typography>
    </TableCell>
    <TableCell>
      <Typography fontWeight="bold" sx={{ fontSize: "1rem", color: "#334" }}>
        Valor (Kz)
      </Typography>
    </TableCell>
    <TableCell></TableCell>
  </TableRow>
</TableHead>

                        <TableBody>
                          {Object.entries(
                            formData.membrosContribuicoes[tipo.id]
                          ).map(([membroId, valor]) => {
                            const membro = membros.find(
                              (m) => m.id === parseInt(membroId)
                            );
                            return (
                              <TableRow key={membroId} hover>
<TableCell
  sx={{
    fontWeight: 700,
    color: "#2c2f36",
    fontSize: "0.95rem",
    letterSpacing: "0.4px",
    py: 2,
    textTransform: "capitalize",
  }}
>
  {membro?.nome}
</TableCell>

<TableCell>
  <Chip
    label={`${valor} Kz`}
    sx={{
      fontWeight: 600,
      fontSize: "0.88rem",
      px: 2.5,
      py: 1.2,
      borderRadius: "16px",
      background: "linear-gradient(145deg, #e0f2f1, #b2dfdb)",
      border: "1px solid rgba(0, 150, 136, 0.25)",
      color: "#004d40",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
      },
      "& .MuiChip-label": {
        padding: 0,
      },
    }}
  />
</TableCell>


  <TableCell align="right">
   <Button
  color="error"
  variant="text"
  startIcon={<DeleteSweepRounded />}
  onClick={() => handleRemoveMembroContribuicao(tipo.id, parseInt(membroId))}
  sx={{ fontWeight: "bold" }}
>
  Remover
</Button>

  </TableCell>
</TableRow>

                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Participantes */}
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  color="primary"
                  display="flex"
                  alignItems="center"
                  gutterBottom
                  fontWeight="bold"
                >
                  <PeopleIcon sx={{ mr: 1 }} /> Participantes
                </Typography>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      type="number"
                      label="Homens"
                      fullWidth
                      value={formData.homens}
                      onChange={(e) => handleChange("homens", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      type="number"
                      label="Mulheres"
                      fullWidth
                      value={formData.mulheres}
                      onChange={(e) =>
                        handleChange("mulheres", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      type="number"
                      label="Crianças"
                      fullWidth
                      value={formData.criancas}
                      onChange={(e) => handleChange("criancas", e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Botões */}
          <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onCancel}
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: 3,
                fontWeight: "bold",
                borderColor: "#6b78ff",
                color: "#6b78ff",
                "&:hover": {
                  borderColor: "#2575fc",
                  backgroundColor: "rgba(101,116,255,0.1)",
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: 3,
                fontWeight: "bold",
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isEdit ? (
                "Atualizar Culto"
              ) : (
                "Salvar Culto"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Modal de contribuição por membro */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle
          sx={{
            background: "#6b78ff",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Adicionar Contribuição por Membro
        </DialogTitle>
        <DialogContent dividers>
          <Autocomplete
            options={membros}
            getOptionLabel={(option) => option.nome}
            value={selectedMembro}
            onChange={(e, newValue) => setSelectedMembro(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Selecionar membro" />
            )}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            type="number"
            label="Valor"
            fullWidth
            value={valorMembro}
            onChange={(e) => setValorMembro(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleAddMembroContribuicao}
            sx={{
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              color: "white",
            }}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
