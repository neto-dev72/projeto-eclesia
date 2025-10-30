// src/pages/Testemunhos.jsx
import React from "react";
import { Box, Typography, Grid, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

/* ---------- ESTILOS ---------- */
const HeroSection = styled(Box)(() => ({
  background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 40%, #93c5fd 100%)",
  color: "#fff",
  textAlign: "center",
  padding: "120px 20px 100px",
  position: "relative",
  overflow: "hidden",
}));

const HeroGlow = styled(Box)(() => ({
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle at center, rgba(255,255,255,0.25) 0%, transparent 70%)",
  filter: "blur(120px)",
  top: "25%",
  left: "30%",
  zIndex: 0,
}));

const TestimonialCard = styled(motion.div)(() => ({
  background: "rgba(255, 255, 255, 0.85)",
  borderRadius: "25px",
  padding: "50px 30px",
  textAlign: "center",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
  transition: "all 0.4s ease",
  border: "1px solid rgba(255,255,255,0.3)",
  "&:hover": {
    transform: "translateY(-10px) scale(1.03)",
    boxShadow: "0 35px 80px rgba(0,0,0,0.25)",
  },
}));

const AvatarWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "20px",
}));

const Name = styled(Typography)(() => ({
  fontWeight: 800,
  fontFamily: "'Poppins', sans-serif",
  fontSize: "1.25rem",
  marginTop: "15px",
  color: "#0b2045",
}));

const Role = styled(Typography)(() => ({
  color: "#5a5a5a",
  fontSize: "0.95rem",
  marginBottom: "20px",
}));

const Comment = styled(Typography)(() => ({
  fontStyle: "italic",
  color: "#333",
  lineHeight: 1.8,
  fontSize: "1rem",
  position: "relative",
  padding: "0 20px",
}));

const QuoteIcon = styled(FormatQuoteIcon)(() => ({
  fontSize: "2.5rem",
  color: "#60a5fa",
  opacity: 0.3,
  position: "absolute",
  top: -10,
  left: -10,
}));

/* ---------- COMPONENTE ---------- */
export default function Testemunhos() {
  const testemunhos = [
    {
      nome: "Pr. Mateus Chimbinda",
      cargo: "Pastor Sênior – Igreja Luz do Evangelho (Luanda, Angola)",
      foto: "https://randomuser.me/api/portraits/men/83.jpg",
      comentario:
        "A Bernet-Eclesia revolucionou a forma como gerimos nossa comunidade. Hoje temos uma visão completa dos membros, finanças e eventos. É uma bênção tecnológica para o ministério.",
    },
    {
      nome: "Bispa Nádia Mucavele",
      cargo: "Líder – Centro de Adoração Emanuel (Maputo, Moçambique)",
      foto: "https://randomuser.me/api/portraits/women/81.jpg",
      comentario:
        "Nunca imaginei que uma plataforma pudesse facilitar tanto o trabalho pastoral. A Bernet-Eclesia trouxe eficiência e modernidade à nossa gestão ministerial.",
    },
    {
      nome: "Pr. Edson Tavares",
      cargo: "Pastor – Igreja Pentecostal Maná (Cabo Verde)",
      foto: "https://randomuser.me/api/portraits/men/79.jpg",
      comentario:
        "A Bernet-Eclesia é mais do que um sistema; é uma ferramenta de unidade. O suporte é excelente, e a interface é intuitiva. Sinto que cada detalhe foi feito com amor e propósito.",
    },
    {
      nome: "Ap. Verónica Kiala",
      cargo: "Apóstola – Ministério Nova Aliança (Benguela, Angola)",
      foto: "https://randomuser.me/api/portraits/women/78.jpg",
      comentario:
        "Depois que começámos a usar a Bernet-Eclesia, a administração da igreja ficou clara e profissional. Cada relatório é preciso e automático. É o futuro das igrejas africanas.",
    },
  ];

  return (
    <Box sx={{ background: "linear-gradient(to bottom, #f3f8ff, #ffffff)", minHeight: "100vh" }}>
      {/* HERO */}
      <HeroSection>
        <HeroGlow />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontFamily: "'Poppins', sans-serif",
            mb: 2,
            fontSize: { xs: "2rem", md: "3.5rem" },
            position: "relative",
            zIndex: 2,
            color: "#fff",
          }}
        >
          Testemunhos de Transformação
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.9)",
            maxWidth: "720px",
            mx: "auto",
            fontFamily: "'Poppins', sans-serif",
            lineHeight: 1.6,
            position: "relative",
            zIndex: 2,
          }}
        >
          Pastores e líderes africanos compartilham como a Bernet-Eclesia está a
          fortalecer a gestão, a fé e a excelência ministerial nas suas igrejas.
        </Typography>
      </HeroSection>

      {/* TESTEMUNHOS */}
      <Box sx={{ py: 10, px: { xs: 3, md: 10 } }}>
        <Grid container spacing={6} justifyContent="center">
          {testemunhos.map((t, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <TestimonialCard
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <AvatarWrapper>
                  <Avatar
                    src={t.foto}
                    alt={t.nome}
                    sx={{
                      width: 90,
                      height: 90,
                      border: "3px solid #60a5fa",
                    }}
                  />
                </AvatarWrapper>
                <Name>{t.nome}</Name>
                <Role>{t.cargo}</Role>
                <Box sx={{ position: "relative" }}>
                  <QuoteIcon />
                  <Comment>“{t.comentario}”</Comment>
                </Box>
              </TestimonialCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
