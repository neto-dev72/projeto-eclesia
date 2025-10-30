// src/pages/Contato.jsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

/* ---------- ESTILOS ---------- */
const HeroSection = styled(Box)(() => ({
  background: "linear-gradient(135deg, #5daeff 0%, #82c8ff 100%)",
  color: "#fff",
  textAlign: "center",
  padding: "130px 20px 100px",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
}));

const HeroGlow = styled(Box)(() => ({
  position: "absolute",
  width: "550px",
  height: "550px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
  filter: "blur(120px)",
  top: "25%",
  left: "35%",
  zIndex: 0,
}));

const ContactCard = styled(Paper)(() => ({
  background: "rgba(255, 255, 255, 0.9)",
  borderRadius: "25px",
  padding: "45px 35px",
  textAlign: "center",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  boxShadow: "0 25px 70px rgba(0,0,0,0.1)",
  border: "1px solid rgba(255,255,255,0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.15)",
  },
}));

const ContactIcon = styled(IconButton)(() => ({
  backgroundColor: "#5daeff",
  color: "#fff",
  marginBottom: "15px",
  "&:hover": { backgroundColor: "#3b82f6" },
}));

const ContactForm = styled("form")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "25px",
}));

/* ---------- COMPONENTE ---------- */
export default function Contato() {
  return (
    <Box sx={{ background: "linear-gradient(to bottom, #eef6ff, #ffffff)", minHeight: "100vh" }}>
      {/* HERO */}
      <HeroSection>
        <HeroGlow />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontFamily: "'Poppins', sans-serif",
            mb: 2,
            fontSize: { xs: "2.2rem", md: "3.8rem" },
            position: "relative",
            zIndex: 2,
            letterSpacing: "1px",
          }}
        >
          Fale Conosco!
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.95)",
            maxWidth: "700px",
            mx: "auto",
            fontFamily: "'Poppins', sans-serif",
            lineHeight: 1.6,
            fontWeight: 400,
            position: "relative",
            zIndex: 2,
          }}
        >
          Tem dúvidas, sugestões ou deseja conversar connosco?  
          A nossa equipa está pronta para o atender com profissionalismo e dedicação.
        </Typography>
      </HeroSection>

      {/* CONTEÚDO */}
      <Box sx={{ py: 10, px: { xs: 3, md: 10 } }}>
        <Grid container spacing={6} justifyContent="center">
          {/* INFORMAÇÕES DE CONTATO */}
          <Grid item xs={12} md={4}>
            <ContactCard
              component={motion.div}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <ContactIcon size="large">
                <PhoneIcon />
              </ContactIcon>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0b2045" }}>
                Telefone
              </Typography>
              <Typography sx={{ color: "#555" }}>+244 923 519 571</Typography>

              <Box sx={{ mt: 4 }}>
                <ContactIcon size="large">
                  <EmailIcon />
                </ContactIcon>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0b2045" }}>
                  E-mail
                </Typography>
                <Typography sx={{ color: "#555" }}>bernet-eclesia@gmail.com</Typography>
              </Box>

              <Box sx={{ mt: 4 }}>
                <ContactIcon size="large">
                  <LocationOnIcon />
                </ContactIcon>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0b2045" }}>
                  Endereço
                </Typography>
                <Typography sx={{ color: "#555" }}>
                  Luanda, Angola<br />Bairro Kapolo, nº 123
                </Typography>
              </Box>
            </ContactCard>
          </Grid>

          {/* FORMULÁRIO DE CONTATO */}
          <Grid item xs={12} md={8}>
            <ContactCard
              component={motion.div}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  fontFamily: "'Poppins', sans-serif",
                  color: "#0b2045",
                }}
              >
                Envie-nos uma Mensagem
              </Typography>

              <ContactForm>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Seu Nome"
                      fullWidth
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "14px",
                          backgroundColor: "#f9fbff",
                          "& fieldset": { borderColor: "#d6e0f5" },
                          "&:hover fieldset": { borderColor: "#5daeff" },
                          "&.Mui-focused fieldset": { borderColor: "#5daeff" },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Seu E-mail"
                      type="email"
                      fullWidth
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "14px",
                          backgroundColor: "#f9fbff",
                          "& fieldset": { borderColor: "#d6e0f5" },
                          "&:hover fieldset": { borderColor: "#5daeff" },
                          "&.Mui-focused fieldset": { borderColor: "#5daeff" },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Assunto"
                  fullWidth
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      backgroundColor: "#f9fbff",
                      "& fieldset": { borderColor: "#d6e0f5" },
                      "&:hover fieldset": { borderColor: "#5daeff" },
                      "&.Mui-focused fieldset": { borderColor: "#5daeff" },
                    },
                  }}
                />

                <TextField
                  label="Mensagem"
                  multiline
                  rows={5}
                  fullWidth
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      backgroundColor: "#f9fbff",
                      "& fieldset": { borderColor: "#d6e0f5" },
                      "&:hover fieldset": { borderColor: "#5daeff" },
                      "&.Mui-focused fieldset": { borderColor: "#5daeff" },
                    },
                  }}
                />

                <Button
                  variant="contained"
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    alignSelf: "flex-start",
                    background:
                      "linear-gradient(90deg, #5daeff 0%, #3b82f6 100%)",
                    borderRadius: "25px",
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 5px 20px rgba(93,174,255,0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
                      boxShadow: "0 8px 25px rgba(59,130,246,0.5)",
                    },
                  }}
                >
                  ✉️ Enviar Mensagem
                </Button>
              </ContactForm>
            </ContactCard>
          </Grid>
        </Grid>

        {/* MAPA FICTÍCIO */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          sx={{
            mt: 10,
            height: 360,
            borderRadius: "25px",
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.1)",
          }}
        >
          <iframe
            title="Localização Bernet"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15716.746214013727!2d13.234!3d-8.838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f20b39cb2aaf%3A0xf4cb44fdf528d5d5!2sLuanda%2C%20Angola!5e0!3m2!1spt-PT!2sao!4v1700000000000"
          ></iframe>
        </Box>
      </Box>
    </Box>
  );
}
