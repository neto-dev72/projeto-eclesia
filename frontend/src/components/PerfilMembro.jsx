import React from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Grid,
  Divider,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";

export default function PerfilMembros({ membro, onClose }) {
  // Função para gerar o PDF
  const gerarPDF = async () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 60;

    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Ficha do Membro", pageWidth / 2, y, { align: "center" });
    y += 20;

    // Função interna para preencher dados textuais
    function preencherDados() {
      let posY = 120; // início dos dados
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      const linha = (label, valor) => {
        doc.text(`${label}: ${valor || "-"}`, 40, posY);
        posY += 18;
      };

      linha("Nome", membro.nome);
      linha("Email", membro.email);
      linha("Profissão", membro.profissao);
      linha("Gênero", membro.genero);
      linha("Data de nascimento", membro.data_nascimento);
      linha("Estado civil", membro.estado_civil);
      linha("Telefone", membro.telefone);
      linha("Cidade", membro.endereco_cidade);
      linha("Batizado", membro.batizado ? "Sim" : "Não");
      linha("Ativo", membro.ativo ? "Sim" : "Não");
      // Linha do endereço, juntando rua, bairro, cidade e província
linha(
  "Endereço",
  `${membro.endereco_rua || "-"}, ${membro.endereco_bairro || "-"}, ${membro.endereco_cidade || "-"}, ${membro.endereco_provincia || "-"}`
);

// Linha do BI (identificação)
linha("BI", membro.bi || "-");

// Linha da data de batismo
linha("Data de Batismo", membro.data_batismo || "-");


      // Departamentos
      if (membro.departamentos?.length) {
        posY += 10;
        doc.setFont("helvetica", "bold");
        doc.text("Departamentos:", 40, posY);
        doc.setFont("helvetica", "normal");
        posY += 16;
        membro.departamentos.forEach((d) => {
          doc.text(`- ${d.nome}`, 60, posY);
          posY += 14;
        });
      }

      // Cargos
      if (membro.cargos?.length) {
        posY += 10;
        doc.setFont("helvetica", "bold");
        doc.text("Cargos:", 40, posY);
        doc.setFont("helvetica", "normal");
        posY += 16;
        membro.cargos.forEach((c) => {
          doc.text(`- ${c.nome}`, 60, posY);
          posY += 14;
        });
      }

      // Dados Acadêmicos
      if (membro.dadosAcademicos) {
        posY += 10;
        doc.setFont("helvetica", "bold");
        doc.text("Dados Acadêmicos:", 40, posY);
        doc.setFont("helvetica", "normal");
        posY += 16;
        const d = membro.dadosAcademicos;
        linha("Habilitações", d.habilitacoes);
        linha("Especialidades", d.especialidades);
        linha("Estudo Teológico", d.estudo_teologico);
        linha("Local de Formação", d.local_formacao);
      }

      // Dados Cristãos
      if (membro.dadosCristaos) {
        posY += 10;
        doc.setFont("helvetica", "bold");
        doc.text("Dados Cristãos:", 40, posY);
        doc.setFont("helvetica", "normal");
        posY += 16;
        const d = membro.dadosCristaos;
        linha("Consagrado", d.consagrado ? "Sim" : "Não");
        linha("Data Consagração", d.data_consagracao);
        linha("Categoria Ministerial", d.categoria_ministerial);
      }

      // Dados Diversos
      if (membro.diversos) {
        posY += 10;
        doc.setFont("helvetica", "bold");
        doc.text("Dados Diversos:", 40, posY);
        doc.setFont("helvetica", "normal");
        posY += 16;
        const d = membro.diversos;
        linha("Trabalha", d.trabalha ? "Sim" : "Não");
        linha("Conta de Outrem", d.conta_outrem ? "Sim" : "Não");
        linha("Conta Própria", d.conta_propria ? "Sim" : "Não");
      }

      doc.save(`perfil_${membro.nome || "membro"}.pdf`);
    }

    // Adiciona foto do membro (se existir)
    if (membro.foto) {
      try {
        const img = await fetch(membro.foto);
        const blob = await img.blob();
        const reader = new FileReader();
        reader.onload = function (e) {
          const imgWidth = 100;
          const imgHeight = 100;
          const x = pageWidth - imgWidth - 40; // canto superior direito
          const yImg = 60;
          doc.addImage(e.target.result, "JPEG", x, yImg, imgWidth, imgHeight);
          preencherDados();
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Erro ao carregar foto do membro:", err);
        preencherDados();
      }
    } else {
      preencherDados();
    }
  };

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
          zIndex: 2,
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Botão PDF Fixo */}
      <Button
        variant="contained"
        startIcon={<PictureAsPdfIcon />}
        onClick={gerarPDF}
        sx={{
          position: "absolute",
          top: { xs: "auto", md: 40 },
          left: 16,
          background: "linear-gradient(90deg,#6b78ff,#9c27b0)",
          color: "white",
          fontWeight: "bold",
          borderRadius: 3,
          px: 2.5,
          py: 1,
          zIndex: 2,
          "&:hover": {
            background: "linear-gradient(90deg,#5a68e5,#8e24aa)",
          },
        }}
      >
        Gerar PDF
      </Button>

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
          <Typography
            variant="subtitle1"
            sx={{ color: "rgba(230,238,248,0.7)" }}
          >
            {membro.profissao || "-"} &nbsp;•&nbsp; {membro.email || "-"}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

      {/* Detalhes básicos */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Gênero
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>
            {membro.genero || "-"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Data de nascimento
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>
            {membro.data_nascimento || "-"}
          </Typography>
        </Grid>

        <Grid container spacing={2} mt={2}>
  <Grid item xs={12} md={6}>
    <Typography><strong>Rua:</strong> {membro.endereco_rua}</Typography>
  </Grid>
  <Grid item xs={12} md={6}>
    <Typography><strong>Bairro:</strong> {membro.endereco_bairro}</Typography>
  </Grid>
  <Grid item xs={12} md={6}>
    <Typography><strong>Cidade:</strong> {membro.endereco_cidade}</Typography>
  </Grid>
  <Grid item xs={12} md={6}>
    <Typography><strong>Província:</strong> {membro.endereco_provincia}</Typography>
  </Grid>
  <Grid item xs={12} md={6}>
    <Typography><strong>Telefone:</strong> {membro.telefone}</Typography>
  </Grid>
  <Grid item xs={12} md={6}>
    <Typography><strong>BI:</strong> {membro.bi}</Typography>
  </Grid>
  <Grid item xs={12} md={6}>
    <Typography><strong>Data de Batismo:</strong> {membro.data_batismo || "-"}</Typography>
  </Grid>
</Grid>


        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Estado civil
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>
            {membro.estado_civil || "-"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Telefone
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>
            {membro.telefone || "-"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Cidade
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>
            {membro.endereco_cidade || "-"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Profissão
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>
            {membro.profissao || "-"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Batizado
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>
            {membro.batizado ? "Sim" : "Não"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Ativo
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(230,238,248,0.7)" }}>
            {membro.ativo ? "Sim" : "Não"}
          </Typography>
        </Grid>

        {/* Departamentos */}
        {membro.departamentos?.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Departamentos
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {membro.departamentos.map((dep) => (
                <Chip key={dep.id} label={dep.nome} color="primary" sx={{ mb: 1 }} />
              ))}
            </Stack>
          </Grid>
        )}

        {/* Cargos */}
        {membro.cargos?.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Cargos
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {membro.cargos.map((cargo) => (
                <Chip key={cargo.id} label={cargo.nome} color="secondary" sx={{ mb: 1 }} />
              ))}
            </Stack>
          </Grid>
        )}

        {/* Dados Acadêmicos */}
        {membro.dadosAcademicos && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>
              Dados Acadêmicos
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                Habilitações: {membro.dadosAcademicos.habilitacoes || "-"}
              </Typography>
              <Typography variant="body2">
                Especialidades: {membro.dadosAcademicos.especialidades || "-"}
              </Typography>
              <Typography variant="body2">
                Estudo Teológico: {membro.dadosAcademicos.estudo_teologico || "-"}
              </Typography>
              <Typography variant="body2">
                Local de Formação: {membro.dadosAcademicos.local_formacao || "-"}
              </Typography>
            </Stack>
          </Grid>
        )}

        {/* Dados Cristãos */}
        {membro.dadosCristaos && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>
              Dados Cristãos
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                Consagrado: {membro.dadosCristaos.consagrado ? "Sim" : "Não"}
              </Typography>
              <Typography variant="body2">
                Data Consagração: {membro.dadosCristaos.data_consagracao || "-"}
              </Typography>
              <Typography variant="body2">
                Categoria Ministerial: {membro.dadosCristaos.categoria_ministerial || "-"}
              </Typography>
            </Stack>
          </Grid>
        )}

        {/* Dados Diversos */}
        {membro.diversos && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>
              Dados Diversos
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                Trabalha: {membro.diversos.trabalha ? "Sim" : "Não"}
              </Typography>
              <Typography variant="body2">
                Conta de Outrem: {membro.diversos.conta_outrem ? "Sim" : "Não"}
              </Typography>
              <Typography variant="body2">
                Conta Própria: {membro.diversos.conta_propria ? "Sim" : "Não"}
              </Typography>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
