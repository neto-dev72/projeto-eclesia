import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Link,
  IconButton,
} from "@mui/material";
import {
  People,
  Event,
  BarChart,
  AccountBalance,
  Phone,
  Email,
  LocationOn,
  Facebook,
  Instagram,
  LinkedIn,
  Twitter,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import heroImage from "../assets/home1.png"; // imagem estática

export default function Home() {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #0d0d2b, #1a1a40, #0f0c29)",
        color: "white",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 14 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <Typography
                variant="h2"
                fontWeight="bold"
                gutterBottom
                sx={{
                  background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0px 0px 25px rgba(0, 114, 255, 0.5)",
                }}
              >
                Tecnologia inteligente de gestão de igrejas
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.85, maxWidth: 500 }}
              >
                A Bernet cria plataformas modernas para igrejas, empresas e
                organizações, conectando tecnologia e inovação para transformar
                sua gestão.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "30px",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(135deg, #6a11cb, #2575fc, #00c6ff)",
                  boxShadow: "0px 8px 25px rgba(0,0,0,0.5)",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 12px 30px rgba(0,0,0,0.7)",
                  },
                }}
              >
                ENTRA / Login
              </Button>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <Box
                component="img"
                src={heroImage}
                alt="Ilustração Bernet"
                sx={{
                  width: "100%",
                  maxWidth: 520,
                  margin: "0 auto",
                  borderRadius: "25px",
                  boxShadow: "0px 15px 40px rgba(0,0,0,0.6)",
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Recursos */}
      <Container maxWidth="lg" sx={{ py: 14 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
            sx={{
              textTransform: "uppercase",
              letterSpacing: 2,
              mb: 2,
              textShadow: "0px 0px 15px rgba(0,200,255,0.5)",
            }}
          >
            O que oferecemos
          </Typography>
          <Typography
            variant="subtitle1"
            textAlign="center"
            sx={{ mb: 8, opacity: 0.7 }}
          >
            Tecnologia de ponta para transformar sua organização.
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {[
            {
              icon: <AccountBalance sx={{ fontSize: 60, color: "#FFD700" }} />,
              title: "Gestão Financeira",
              desc: "Controle completo de finanças, relatórios e segurança.",
            },
            {
              icon: <People sx={{ fontSize: 60, color: "#4CAF50" }} />,
              title: "Gestão de Pessoas",
              desc: "Gerencie membros, clientes e equipes de forma eficiente.",
            },
            {
              icon: <Event sx={{ fontSize: 60, color: "#FF5722" }} />,
              title: "Eventos & Agendas",
              desc: "Organize e acompanhe atividades com calendários inteligentes.",
            },
            {
              icon: <BarChart sx={{ fontSize: 60, color: "#03A9F4" }} />,
              title: "Relatórios Avançados",
              desc: "Visualize dados estratégicos com gráficos e estatísticas.",
            },
          ].map((item, i) => (
            <Grid item xs={12} md={3} key={i}>
              <motion.div whileHover={{ scale: 1.08 }}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.1), rgba(0,0,0,0.4))",
                    color: "white",
                    height: "100%",
                    borderRadius: "22px",
                    boxShadow: "0px 12px 35px rgba(0,0,0,0.6)",
                    backdropFilter: "blur(14px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.4s ease",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 5 }}>
                    <Box
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(0,0,0,0.3))",
                        backdropFilter: "blur(6px)",
                        boxShadow: "0 0 25px rgba(255,255,255,0.2)",
                        margin: "0 auto",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ mt: 2, mb: 1 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Box
        sx={{
          py: 14,
          textAlign: "center",
          background: "linear-gradient(135deg,#6a11cb,#2575fc,#00c6ff)",
          boxShadow: "inset 0 0 80px rgba(0,0,0,0.5)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{
              textTransform: "uppercase",
              letterSpacing: 3,
              textShadow: "0px 0px 25px rgba(255,255,255,0.6)",
            }}
          >
            Bernet - Inovação que conecta
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 5, opacity: 0.85 }}>
            Soluções digitais para igrejas, empresas e muito mais.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 5,
              py: 1.8,
              borderRadius: "35px",
              fontWeight: "bold",
              background: "linear-gradient(90deg,#00c6ff,#0072ff,#6a11cb)",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.6)",
              "&:hover": {
                transform: "scale(1.08)",
                boxShadow: "0px 12px 35px rgba(0,0,0,0.8)",
              },
            }}
          >
            ENTRA / Login
          </Button>
        </motion.div>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 10, px: 4, background: "#0a0a1a" }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            {/* Sobre */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{
                  background: "linear-gradient(90deg,#00c6ff,#6a11cb)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Bernet
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                Desenvolvemos soluções digitais inteligentes para diferentes
                setores: igrejas, beleza, educação e empresas. A tecnologia é a
                nossa missão.
              </Typography>
              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                {[Facebook, Instagram, LinkedIn, Twitter].map((Icon, i) => (
                  <IconButton
                    key={i}
                    sx={{
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.2)",
                      "&:hover": {
                        background: "linear-gradient(135deg,#6a11cb,#00c6ff)",
                        transform: "scale(1.15)",
                      },
                    }}
                  >
                    <Icon />
                  </IconButton>
                ))}
              </Box>
            </Grid>

            {/* Links */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Links Rápidos
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                {["Início", "Recursos", "Planos", "Contato"].map((link) => (
                  <Link
                    key={link}
                    href="#"
                    underline="hover"
                    color="inherit"
                    sx={{ opacity: 0.8, "&:hover": { color: "#00c6ff" } }}
                  >
                    {link}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Contatos */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Contato
              </Typography>
              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                <Phone fontSize="small" />{" "}
                <Typography variant="body2">+244 900 000 000</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                <Email fontSize="small" />{" "}
                <Typography variant="body2">contato@bernet.com</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1.5}>
                <LocationOn fontSize="small" />{" "}
                <Typography variant="body2">Luanda, Angola</Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 5, background: "rgba(255,255,255,0.2)" }} />

          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.6 }}>
            © 2025 Bernet - Todos os direitos reservados
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
