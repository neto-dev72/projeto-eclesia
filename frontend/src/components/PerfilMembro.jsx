// components/PerfilMembros.jsx
import React from "react";
import { Box, Typography, Avatar, IconButton, Grid, Divider, Chip, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function PerfilMembros({ membro, onClose }) {
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
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 3,
          mb: 4,
        }}
      >
        <Avatar
          src={membro.foto || undefined}
          sx={{
            width: { xs: 120, md: 160 },
            height: { xs: 120, md: 160 },
            borderRadius: "50%",
            border: "4px solid rgba(124,77,255,0.4)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
            fontSize: 40,
          }}
        >
          {membro.nome ? membro.nome.charAt(0).toUpperCase() : "M"}
        </Avatar>

        <Box>
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
            {membro.nome || "-"}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "rgba(230,238,248,0.7)" }}>
            {membro.profissao || "-"} &nbsp;•&nbsp; {membro.email || "-"}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

      {/* Detalhes básicos */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>Gênero</Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>{membro.genero || "-"}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>Data de nascimento</Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>{membro.data_nascimento || "-"}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>Estado civil</Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>{membro.estado_civil || "-"}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>Telefone</Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>{membro.telefone || "-"}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>Cidade</Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>{membro.endereco_cidade || "-"}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>Profissão</Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>{membro.profissao || "-"}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>Batizado</Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>{membro.batizado ? "Sim" : "Não"}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>Ativo</Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>{membro.ativo ? "Sim" : "Não"}</Typography>
        </Grid>

        {/* Departamentos */}
        {membro.departamentos?.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>Departamentos</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {membro.departamentos.map(dep => <Chip key={dep.id} label={dep.nome} color="primary" sx={{ mb: 1 }} />)}
            </Stack>
          </Grid>
        )}

        {/* Cargos */}
        {membro.cargos?.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>Cargos</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {membro.cargos.map(cargo => <Chip key={cargo.id} label={cargo.nome} color="secondary" sx={{ mb: 1 }} />)}
            </Stack>
          </Grid>
        )}

        {/* Dados Acadêmicos */}
        {membro.dadosAcademicos && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>Dados Acadêmicos</Typography>
            <Stack spacing={1}>
              <Typography variant="body2">Habilitações: {membro.dadosAcademicos.habilitacoes || "-"}</Typography>
              <Typography variant="body2">Especialidades: {membro.dadosAcademicos.especialidades || "-"}</Typography>
              <Typography variant="body2">Estudo Teológico: {membro.dadosAcademicos.estudo_teologico || "-"}</Typography>
              <Typography variant="body2">Local de Formação: {membro.dadosAcademicos.local_formacao || "-"}</Typography>
            </Stack>
          </Grid>
        )}

        {/* Dados Cristãos */}
        {membro.dadosCristaos && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>Dados Cristãos</Typography>
            <Stack spacing={1}>
              <Typography variant="body2">Consagrado: {membro.dadosCristaos.consagrado ? "Sim" : "Não"}</Typography>
              <Typography variant="body2">Data Consagração: {membro.dadosCristaos.data_consagracao || "-"}</Typography>
              <Typography variant="body2">Categoria Ministerial: {membro.dadosCristaos.categoria_ministerial || "-"}</Typography>
            </Stack>
          </Grid>
        )}

        {/* Dados Diversos */}
        {membro.diversos && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>Dados Diversos</Typography>
            <Stack spacing={1}>
              <Typography variant="body2">Trabalha: {membro.diversos.trabalha ? "Sim" : "Não"}</Typography>
              <Typography variant="body2">Conta de Outrem: {membro.diversos.conta_outrem ? "Sim" : "Não"}</Typography>
              <Typography variant="body2">Conta Própria: {membro.diversos.conta_propria ? "Sim" : "Não"}</Typography>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
