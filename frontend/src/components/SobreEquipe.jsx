// src/pages/SobreEquipa.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import heroImage from "../assets/nossaequipe.jpg";
import berna from "../assets/bernardo.jpg";
import pastor from "../assets/pastor.jpg";
import equipa from "../assets/equipa.jpg";

/* ---------- ESTILOS ---------- */
const HeroSection = styled(Box)(() => ({
  position: "relative",
  backgroundImage: `url(${heroImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "60vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "#fff",
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,70,0.65)",
  },
}));

const HeroContent = styled(Box)(() => ({
  position: "relative",
  zIndex: 2,
  maxWidth: "900px",
  padding: "20px",
}));

const ProfileImage = styled(motion.img)(({ size }) => ({
  width: size,
  height: size,
  borderRadius: "50%",
  objectFit: "cover",
  objectPosition: "top center",
  boxShadow: "0 0 30px rgba(0,0,0,0.4)",
  border: "4px solid #fff",
  transition: "transform 0.4s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const GlowCircle = styled(Box)(({ color }) => ({
  position: "absolute",
  width: "250px",
  height: "250px",
  borderRadius: "50%",
  background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
  filter: "blur(90px)",
  zIndex: 0,
}));

/* ---------- COMPONENTE ---------- */
export default function SobreEquipa() {
  return (
    <Box sx={{ backgroundColor: "#f8faff", overflow: "hidden" }}>
      {/* HERO */}
      <HeroSection>
        <HeroContent>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontFamily: "'Poppins', sans-serif",
              mb: 2,
            }}
          >
            A Nossa Equipa
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#e0e0e0",
              fontWeight: 400,
              lineHeight: 1.7,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Pessoas que acreditam no poder da fé e da tecnologia.  
            Criamos soluções que transformam o modo como as igrejas se organizam e crescem.
          </Typography>
        </HeroContent>
      </HeroSection>

      {/* DECORAÇÃO DE EQUIPA */}
      <Box
        sx={{
          position: "relative",
          py: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Luzes decorativas */}
        <GlowCircle color="rgba(0, 86, 255, 0.5)" sx={{ top: "10%", left: "15%" }} />
        <GlowCircle color="rgba(255, 0, 255, 0.4)" sx={{ bottom: "10%", right: "15%" }} />

        {/* Título */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#0056FF",
            mb: 10,
            fontFamily: "'Poppins', sans-serif",
            position: "relative",
            zIndex: 2,
          }}
        >
          Conheça as Pessoas Por Trás da Bernet-Eclesia
        </Typography>

        {/* Linha de imagens */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 4, md: 10 },
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          {/* Bernardo (esquerda) */}
          <Box sx={{ textAlign: "center" }}>
            <ProfileImage
              src={berna}
              alt="Bernardo António"
              size="220px"
              whileHover={{ scale: 1.1 }}
            />
            <Typography
              sx={{
                mt: 2,
                fontWeight: 700,
                color: "#0056FF",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Bernardo António
            </Typography>
            <Typography sx={{ color: "#555", fontSize: "0.95rem" }}>
               Desenvolvedor
            </Typography>
          </Box>

          {/* Equipa (centro) */}
          <Box sx={{ position: "relative", textAlign: "center" }}>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                width: "400px",
                height: "400px",
                background:
                  "radial-gradient(circle at center, rgba(0,86,255,0.25) 0%, transparent 70%)",
                filter: "blur(80px)",
                zIndex: 0,
              }}
            />
            <ProfileImage
              src={equipa}
              alt="Equipa Bernet"
              size="300px"
              whileHover={{ scale: 1.08, rotate: 2 }}
              style={{
                zIndex: 2,
                border: "6px solid #fff",
                boxShadow:
                  "0 0 40px rgba(0,86,255,0.4), 0 0 80px rgba(255,255,255,0.3)",
              }}
            />
            <Typography
              sx={{
                mt: 3,
                fontWeight: 800,
                color: "#111",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Equipa Bernet
            </Typography>
            <Typography sx={{ color: "#666", fontSize: "0.95rem", maxWidth: "360px", mx: "auto" }}>
              Unidos pela mesma visão, desenvolvemos soluções que inspiram fé e inovação.
            </Typography>
          </Box>

          {/* Dr. Neto (direita) */}
          <Box sx={{ textAlign: "center" }}>
            <ProfileImage
              src={pastor}
              alt="Dr. Neto"
              size="220px"
              whileHover={{ scale: 1.1 }}
            />
            <Typography
              sx={{
                mt: 2,
                fontWeight: 700,
                color: "#0056FF",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Dr. Neto
            </Typography>
            <Typography sx={{ color: "#555", fontSize: "0.95rem" }}>
              Mentor & Estrategista
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
