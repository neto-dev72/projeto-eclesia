import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Zoom,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import { PlayCircle } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import heroImage from "../assets/homeimg.jpg";
import Servicos from "../components/servicos";
import Footer from "../components/footer";
import SobreEquipa from "../components/SobreEquipe";
import Planos from "../components/Planos";
import Contato from "../components/Contato";
import Testemunhos from "../components/Testemunhos";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function Home() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.scrollTo === "servicos") {
      const el = document.getElementById("servicos");
      if (el) {
        setTimeout(() => {
          window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY - 120,
            behavior: "smooth",
          });
        }, 300);
      }
    }
  }, [location]);

  return (
    <Box>
      {/* 🔹 HERO SECTION */}
      <Box
        sx={{
          width: "100%",
          height: isDesktop ? "90vh" : "75vh",
          position: "relative",
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: isDesktop ? "center top 60px" : "center center",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 70, 0.6)",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "10%",
            transform: "translateY(-50%)",
            maxWidth: isDesktop ? "50%" : "90%",
            textAlign: "left",
            zIndex: 1,
          }}
        >
          <Typography
            variant={isDesktop ? "h2" : "h4"}
            sx={{
              fontWeight: 900,
              color: "#ffffff",
              mb: 2,
              lineHeight: 1.1,
              fontFamily: "'Poppins', sans-serif",
              "& span": { color: "#66b2ff", fontWeight: 900 },
            }}
          >
            Transforme a gestão da sua igreja com a <span>Bernet@-eclesia</span>
          </Typography>

          <Typography
            variant={isDesktop ? "h5" : "body1"}
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontWeight: 400,
              lineHeight: 1.6,
              mb: 3,
              maxWidth: "90%",
            }}
          >
            Facilitamos a administração, o acompanhamento dos membros, finanças,
            eventos e muito mais — tudo em um único sistema pensado para igrejas.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/criar-usuarios")}
              sx={{
                backgroundColor: "#3399FF",
                color: "#fff",
                fontWeight: 700,
                px: 5,
                py: 2,
                fontSize: isDesktop ? "1.1rem" : "1rem",
                borderRadius: "14px",
                textTransform: "none",
                minWidth: 0,
                "&:hover": { backgroundColor: "#2a80d6" },
              }}
            >
              Experimente agora
            </Button>

            <Button
              variant="text"
              onClick={() => setOpenModal(true)}
              sx={{
                color: "#fff",
                fontWeight: 600,
                px: 4,
                py: 2,
                fontSize: isDesktop ? "1.1rem" : "1rem",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                textTransform: "none",
                "&:hover": { color: "#66b2ff" },
              }}
            >
              <PlayCircle sx={{ color: "#3399FF", fontSize: 32 }} />
              Ver apresentação
            </Button>
          </Box>
        </Box>

        {/* 🔹 MODAL PREMIUM MODERNO */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
              sx: { backgroundColor: "rgba(0,0,0,0.85)" },
            },
          }}
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: isDesktop ? 480 : 320,
                bgcolor: "rgba(10,10,30,0.85)",
                backdropFilter: "blur(12px)",
                borderRadius: 4,
                boxShadow: "0 0 60px rgba(0, 150, 255, 0.5)",
                p: 5,
                textAlign: "center",
                color: "#fff",
                border: "2px solid #3399FF",
                fontFamily: "'Poppins', sans-serif",
                transition: "all 0.5s ease",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  fontSize: isDesktop ? "1.8rem" : "1.4rem",
                  background: "linear-gradient(90deg, #3399FF, #66b2ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Em Breve!
              </Typography>
              <Typography
                sx={{
                  mb: 4,
                  fontSize: isDesktop ? "1.2rem" : "1rem",
                  color: "#cce0ff",
                  lineHeight: 1.6,
                }}
              >
                O vídeo está a ser trabalhado! Assim que estiver pronto poderá reproduzí-lo,
                obrigado!
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpenModal(false)}
                sx={{
                  background:
                    "linear-gradient(135deg, #3399FF 0%, #66b2ff 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #66b2ff 0%, #3399FF 100%)",
                    transform: "scale(1.05)",
                  },
                  fontWeight: 700,
                  px: 5,
                  py: 1.8,
                  borderRadius: 3,
                  boxShadow: "0 8px 20px rgba(51,153,255,0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                Fechar
              </Button>
            </Box>
          </Fade>
        </Modal>
      </Box>

      <Box id="servicos">
        <Servicos />
      </Box>

      <SobreEquipa />
      <Testemunhos />
      <Planos />
      <Contato />
      <Footer />

      {/* 🔹 ÍCONE FIXO WHATSAPP PREMIUM COM ONDAS */}
      <Zoom in={true}>
        <Box
          component="a"
          href={`https://wa.me/244923519571?text=${encodeURIComponent(
            "Olá, caro(a) cliente, esperamos que tudo vá bem! Se clicou é porque está interessado! Expõe a tua questão, que estamos disponíveis em respondê-lo!"
          )}`}
          target="_blank"
          sx={(theme) => ({
            position: "fixed",
            bottom: 32,
            right: 32,
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #25D366, #128C7E)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            boxShadow:
              "0 12px 28px rgba(0,0,0,0.35), 0 0 15px rgba(37,211,102,0.6)",
            zIndex: 9999,
            cursor: "pointer",
            animation: "premiumPulse 2.5s infinite",
            "&:hover": {
              transform: "scale(1.3) rotate(-5deg)",
              transition: "all 0.4s ease-in-out",
              boxShadow:
                "0 15px 35px rgba(0,0,0,0.45), 0 0 25px rgba(37,211,102,0.8), 0 0 40px rgba(37,211,102,0.5)",
            },
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              width: "120%",
              height: "120%",
              borderRadius: "50%",
              background: "rgba(37, 211, 102, 0.3)",
              animation: "wavePremium 2.8s infinite",
            },
            "&::after": {
              animationDelay: "1.4s",
              background: "rgba(37, 211, 102, 0.2)",
            },

            [theme.breakpoints.down("md")]: {
              bottom: 140,
              width: 65,
              height: 65,
            },
            [theme.breakpoints.down("sm")]: {
              bottom: 180,
              right: 16,
              width: 60,
              height: 60,
            },
          })}
        >
          <WhatsAppIcon
            sx={(theme) => ({
              fontSize: 36,
              zIndex: 2,
              filter:
                "drop-shadow(0 0 4px #fff) drop-shadow(0 0 6px #25D366)",
              [theme.breakpoints.down("md")]: {
                fontSize: 34,
              },
              [theme.breakpoints.down("sm")]: {
                fontSize: 32,
              },
            })}
          />
        </Box>
      </Zoom>

      <style>
        {`
        @keyframes premiumPulse {
          0% { transform: scale(1); box-shadow: 0 12px 28px rgba(0,0,0,0.35), 0 0 15px rgba(37,211,102,0.6); }
          50% { transform: scale(1.1); box-shadow: 0 15px 35px rgba(0,0,0,0.45), 0 0 25px rgba(37,211,102,0.8); }
          100% { transform: scale(1); box-shadow: 0 12px 28px rgba(0,0,0,0.35), 0 0 15px rgba(37,211,102,0.6); }
        }
        @keyframes wavePremium {
          0% { transform: scale(0.8); opacity: 0.6; }
          50% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0.6; }
        }
      `}
      </style>
    </Box>
  );
}
