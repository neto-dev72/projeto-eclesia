import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import {
Box,
Typography,
CircularProgress,
Avatar,
Chip,
Fade,
Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { FaBell } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { MdEventAvailable, MdChurch, MdPerson } from "react-icons/md";

// 🌌 FUNDO ULTRA-PREMIUM COM ANIMAÇÃO E GRADIENTE FLUIDO
const Background = styled(Box)(({ theme }) => ({
minHeight: "100vh",
width: "100%",
background:
"linear-gradient(135deg, #e3f2ff 0%, #d7e4ff 40%, #fdfbff 100%)",
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "flex-start",
padding: theme.spacing(10, 3),
position: "relative",
overflow: "hidden",
animation: "gradientShift 15s ease infinite alternate",
"@keyframes gradientShift": {
"0%": {
background:
"linear-gradient(135deg, #e3f2ff 0%, #d7e4ff 40%, #fdfbff 100%)",
},
"100%": {
background:
"linear-gradient(135deg, #dfeaff 0%, #e7f3ff 40%, #ffffff 100%)",
},
},
}));

// ✨ LUZES FLUTUANTES E PARTICULAS SUAVES
const FloatingLights = styled("div")({
position: "absolute",
inset: 0,
zIndex: 0,
"&::before, &::after": {
content: '""',
position: "absolute",
borderRadius: "50%",
filter: "blur(180px)",
animation: "float 12s ease-in-out infinite alternate",
},
"&::before": {
top: "15%",
left: "-10%",
width: "500px",
height: "500px",
background: "rgba(0,120,255,0.25)",
},
"&::after": {
bottom: "-15%",
right: "-10%",
width: "600px",
height: "600px",
background: "rgba(0,200,255,0.25)",
},
"@keyframes float": {
"0%": { transform: "translateY(0)" },
"100%": { transform: "translateY(25px)" },
},
});

// 💎 CABEÇALHO ANIMADO
const Title = styled(motion.h1)(({ theme }) => ({
fontFamily: "'Poppins', sans-serif",
fontWeight: 800,
fontSize: "3.2rem",
textAlign: "center",
marginBottom: theme.spacing(1),
background: "linear-gradient(90deg, #0044ff, #00bfff)",
WebkitBackgroundClip: "text",
WebkitTextFillColor: "transparent",
textShadow: "0px 6px 25px rgba(0,72,255,0.2)",
zIndex: 2,
}));

const Subtitle = styled(motion.p)(({ theme }) => ({
color: "#003366",
fontSize: "1.2rem",
fontFamily: "'Inter', sans-serif",
opacity: 0.8,
textAlign: "center",
marginBottom: theme.spacing(6),
zIndex: 2,
}));

// 🎁 CARTÃO DE NOTIFICAÇÃO MODERNO
const NotificationCard = styled(motion.div)(({ theme }) => ({
width: "100%",
maxWidth: "950px",
background:
"linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,245,255,0.85))",
borderRadius: "32px",
backdropFilter: "blur(25px)",
boxShadow: "0 15px 70px rgba(0,0,0,0.1)",
padding: theme.spacing(4),
marginBottom: theme.spacing(4),
display: "flex",
alignItems: "flex-start",
gap: theme.spacing(4),
position: "relative",
overflow: "hidden",
transition: "all 0.5s ease",
"&:hover": {
transform: "translateY(-10px) scale(1.02)",
boxShadow: "0 30px 90px rgba(0,100,255,0.3)",
},
}));

const NotificationText = styled(Box)(() => ({
display: "flex",
flexDirection: "column",
flex: 1,
color: "#002244",
}));

const NotificationMessage = styled(Typography)(() => ({
fontSize: "1.15rem",
color: "#002b5c",
marginTop: 8,
lineHeight: 1.6,
fontFamily: "'Inter', sans-serif",
}));

const NotificationDescription = styled(Box)(() => ({
backgroundColor: "rgba(235,245,255,0.9)",
borderRadius: "12px",
padding: "14px 18px",
marginTop: "12px",
borderLeft: "4px solid #005cff",
fontFamily: "'Inter', sans-serif",
fontSize: "0.95rem",
color: "#002b5c",
whiteSpace: "pre-line",
boxShadow: "0 4px 20px rgba(0,60,255,0.05)",
}));

const DateText = styled(Typography)(() => ({
fontSize: "0.9rem",
color: "#004c99",
opacity: 0.8,
marginTop: 10,
}));

const TodayBadge = styled(Chip)(() => ({
position: "absolute",
top: 15,
right: 15,
background: "linear-gradient(90deg, #ffd700, #fff3b0)",
color: "#4d3b00",
fontWeight: 700,
boxShadow: "0 0 25px rgba(255,215,0,0.6)",
border: "1px solid rgba(255,215,0,0.4)",
}));

const AnimatedIcon = styled(motion.div)({
background:
"linear-gradient(135deg, #0072ff, #00c6ff)",
borderRadius: "50%",
width: 70,
height: 70,
display: "flex",
alignItems: "center",
justifyContent: "center",
color: "#fff",
boxShadow: "0 10px 25px rgba(0,100,255,0.4)",
});

const NotificacoesEventos = () => {
const [notificacoes, setNotificacoes] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const atualizarNotificacoes = async () => {
try {
await axios.get("/eventos");
const response = await axios.get("/notificacoes");
setNotificacoes(response.data || []);
} catch (error) {
console.error("Erro ao atualizar notificações:", error);
} finally {
setLoading(false);
}
};
atualizarNotificacoes();
const interval = setInterval(atualizarNotificacoes, 60000);
return () => clearInterval(interval);
}, []);

const getIcon = (tipo) => {
switch (tipo) {
case "culto":
return <MdChurch size={32} />;
case "agendamento_pastoral":
return <MdEventAvailable size={32} />;
case "atendimento":
return <IoNotifications size={32} />;
case "aniversario":
return <MdPerson size={32} />;
default:
return <FaBell size={28} />;
}
};

return ( <Background> <FloatingLights />
<motion.div
initial={{ opacity: 0, y: -30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8 }}
style={{ zIndex: 2 }}
> <Title>✨ Notificações de Eventos</Title> <Subtitle>
Fique atualizado com os eventos, cultos e compromissos mais recentes. </Subtitle>
</motion.div>


  {loading ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="50vh"
    >
      <CircularProgress sx={{ color: "#0048ff" }} />
    </Box>
  ) : notificacoes.length === 0 ? (
    <Fade in>
      <Box textAlign="center" mt={8}>
        <Typography
          variant="h6"
          sx={{
            color: "#003366",
            fontFamily: "'Inter', sans-serif",
            opacity: 0.9,
          }}
        >
          Nenhuma notificação recente.
        </Typography>
      </Box>
    </Fade>
  ) : (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
    >
      {notificacoes.map((notif, index) => (
        <NotificationCard
          key={notif.id || index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          {notif.tipo === "culto" && <TodayBadge label="⛪ Culto Hoje!" />}
          {notif.tipo === "agendamento_pastoral" && (
            <TodayBadge label="🙏 Agendamento Pastoral" />
          )}
          {notif.tipo === "atendimento" && (
            <TodayBadge label="📞 Atendimento" />
          )}
          {notif.tipo === "aniversario" && (
            <TodayBadge label="🎂 Aniversário" />
          )}

          <AnimatedIcon
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {getIcon(notif.tipo)}
          </AnimatedIcon>

          <NotificationText>
            <Typography variant="h6" fontWeight={700}>
              {notif.Membro?.nome || "Evento Geral"}
            </Typography>
            <NotificationMessage>{notif.mensagem}</NotificationMessage>

            {notif.Descricao && (
              <NotificationDescription>
                {notif.Descricao.split("|").map((linha, i) => (
                  <Typography
                    key={i}
                    variant="body2"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {linha.trim()}
                  </Typography>
                ))}
              </NotificationDescription>
            )}

            <DateText>
              {new Date(notif.data_enviada).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </DateText>
          </NotificationText>
        </NotificationCard>
      ))}
    </Box>
  )}
</Background>


);
};

export default NotificacoesEventos;
