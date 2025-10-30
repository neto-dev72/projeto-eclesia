// src/pages/Planos.jsx
import React from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

/* ---------- ESTILOS ---------- */
const HeroSection = styled(Box)(() => ({
  background: "linear-gradient(135deg, #5daeff 0%, #4682ff 100%)", // azul-bebê forte
  color: "#fff",
  textAlign: "center",
  padding: "100px 20px 80px",
  position: "relative",
  overflow: "hidden",
}));

const HeroGlow = styled(Box)(() => ({
  position: "absolute",
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle at center, rgba(255,255,255,0.25) 0%, transparent 70%)",
  filter: "blur(100px)",
  top: "20%",
  left: "30%",
  zIndex: 0,
}));

const PlanCard = styled(Paper)(({ highlight, premium, free }) => ({
  padding: "40px 30px",
  borderRadius: "25px",
  background: premium
    ? "linear-gradient(145deg, #fdfdfd, #fff7f0)"
    : free
    ? "linear-gradient(145deg, #e3f2fd, #ffffff)"
    : highlight
    ? "linear-gradient(135deg, #ffffff, #f0f4ff)"
    : "#fff",
  boxShadow: premium
    ? "0 25px 60px rgba(255,215,0,0.35)"
    : free
    ? "0 20px 50px rgba(0,150,255,0.3)"
    : highlight
    ? "0 20px 60px rgba(0,86,255,0.3)"
    : "0 10px 30px rgba(0,0,0,0.1)",
  border: premium
    ? "2px solid gold"
    : free
    ? "2px solid #00bfff"
    : "none",
  transform: premium || free ? "scale(1.07)" : "scale(1)",
  transition: "all 0.4s ease",
  "&:hover": {
    transform: "translateY(-10px) scale(1.08)",
    boxShadow: premium
      ? "0 30px 70px rgba(255,215,0,0.5)"
      : "0 25px 60px rgba(0,86,255,0.4)",
  },
  textAlign: "center",
  position: "relative",
  zIndex: 2,
}));

const Price = styled("div")({
  fontSize: "2rem",
  fontWeight: 800,
  color: "#0056FF",
  marginBottom: "8px",
  fontFamily: "'Poppins', sans-serif",
});

const OldPrice = styled("span")({
  textDecoration: "line-through",
  textDecorationColor: "#800020",
  color: "#800020",
  fontWeight: 600,
  fontSize: "1.1rem",
  marginLeft: "8px",
});

/* ---------- COMPONENTE ---------- */
export default function Planos() {
  return (
    <Box sx={{ backgroundColor: "#f7f9ff", minHeight: "100vh" }}>
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
          Escolha o Plano Ideal para a Sua Igreja
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.85)",
            maxWidth: "700px",
            mx: "auto",
            fontFamily: "'Poppins', sans-serif",
            lineHeight: 1.6,
            position: "relative",
            zIndex: 2,
          }}
        >
          Planos flexíveis e acessíveis para diferentes tamanhos de igrejas — todos com as funcionalidades completas da plataforma Bernet-Eclesia.
        </Typography>
      </HeroSection>

      {/* PLANOS */}
      <Box sx={{ py: 10, px: { xs: 3, md: 10 } }}>
        <Grid container spacing={6} justifyContent="center">
          {/* PLANO 1 - GRÁTIS */}
          <Grid item xs={12} sm={6} md={3}>
            <PlanCard component={motion.div} whileHover={{ scale: 1.05 }} free>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: "'Poppins', sans-serif",
                  color: "#0077ff",
                }}
              >
                Plano Grátis 💎
              </Typography>
              <Price>0 Kz</Price>
              <Typography sx={{ color: "#333", mb: 3 }}>
                <b>Duração:</b> 7 dias <br />
                <b>Membros:</b> até 30 <br />
                <b>Usuários:</b> até 3 <br />
                <b>Funcionalidades:</b> todas ativas
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#0077ff",
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#005fd1" },
                }}
              >
                Aderir Agora
              </Button>
            </PlanCard>
          </Grid>

          {/* PLANO 2 - INTERMÉDIO */}
          <Grid item xs={12} sm={6} md={3}>
            <PlanCard component={motion.div} whileHover={{ scale: 1.05 }} highlight>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Plano Intermédio
              </Typography>
              <Price>
                10.000 Kz<span> /mês</span>
                <OldPrice>25.000 Kz</OldPrice>
              </Price>
              <Typography sx={{ color: "#555", mb: 3 }}>
                <b>Membros:</b> até 150 <br />
                <b>Usuários:</b> até 10 <br />
                <b>Funcionalidades:</b> todas ativas
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#0056FF",
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#003cd1" },
                }}
              >
                Aderir Agora
              </Button>
            </PlanCard>
          </Grid>

          {/* PLANO 3 - AVANÇADO */}
          <Grid item xs={12} sm={6} md={3}>
            <PlanCard component={motion.div} whileHover={{ scale: 1.05 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Plano Avançado
              </Typography>
              <Price>
                20.000 Kz<span> /mês</span>
                <OldPrice>50.000 Kz</OldPrice>
              </Price>
              <Typography sx={{ color: "#555", mb: 3 }}>
                <b>Membros:</b> até 300 <br />
                <b>Usuários:</b> até 25 <br />
                <b>Funcionalidades:</b> todas ativas
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#0056FF",
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#003cd1" },
                }}
              >
                Aderir Agora
              </Button>
            </PlanCard>
          </Grid>

          {/* PLANO 4 - ILIMITADO */}
          <Grid item xs={12} sm={6} md={3}>
            <PlanCard component={motion.div} whileHover={{ scale: 1.05 }} premium>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: "'Poppins', sans-serif",
                  color: "#d4af37",
                }}
              >
                Plano Ilimitado ⭐
              </Typography>
              <Price>
                35.000 Kz<span> /mês</span>
                <OldPrice>80.000 Kz</OldPrice>
              </Price>
              <Typography sx={{ color: "#333", mb: 3 }}>
                <b>Membros:</b> ilimitados <br />
                <b>Usuários:</b> ilimitados <br />
                <b>Funcionalidades:</b> todas ativas
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#d4af37",
                  color: "#fff",
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#b08d28" },
                }}
              >
                Aderir Agora
              </Button>
            </PlanCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
