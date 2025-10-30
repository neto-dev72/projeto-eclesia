import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AccountBalance,
  People,
  MonetizationOn,
  NotificationsActive,
  EventNote,
  BarChart,
  GroupWork,
} from "@mui/icons-material";
import { motion } from "framer-motion";

/* ---------- DADOS ---------- */
const services = [
  {
    title: "Secretaria Inteligente",
    description:
      "Automatize documentos, organize correspondências e centralize toda a administração institucional da igreja.",
    icon: <AccountBalance fontSize="inherit" />,
  },
  {
    title: "Gestão de Membros",
    description:
      "Acompanhe o crescimento espiritual, envolvimento e histórico de cada membro de forma intuitiva e visual.",
    icon: <People fontSize="inherit" />,
  },
  {
    title: "Gestão Financeira",
    description:
      "Controle total de dízimos, ofertas e doações com dashboards analíticos, relatórios interativos e alertas automáticos.",
    icon: <MonetizationOn fontSize="inherit" />,
  },
  {
    title: "Alertas & Notificações",
    description:
      "Receba comunicações inteligentes sobre movimentações financeiras, eventos e marcos importantes da igreja.",
    icon: <NotificationsActive fontSize="inherit" />,
  },
  {
    title: "Cultos & Eventos",
    description:
      "Planeje, organize e acompanhe cada detalhe de cultos e eventos com controle financeiro integrado.",
    icon: <EventNote fontSize="inherit" />,
  },
  {
    title: "Relatórios Avançados",
    description:
      "Crie relatórios completos e personalizados, visualize estatísticas e acompanhe o impacto das suas decisões.",
    icon: <BarChart fontSize="inherit" />,
  },
  {
    title: "Departamentos & Ministérios",
    description:
      "Organize grupos e ministérios com acompanhamento dinâmico de objetivos, tarefas e participações.",
    icon: <GroupWork fontSize="inherit" />,
  },
];

/* ---------- ESTILOS ---------- */
const PageContainer = styled(Box)(() => ({
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(120deg, #f8faff, #eef2ff, #ffffff)",
  padding: "130px 30px 100px",
  minHeight: "100vh",
}));

const AnimatedGlow = styled(Box)(() => ({
  position: "absolute",
  width: "900px",
  height: "900px",
  background:
    "radial-gradient(circle at center, rgba(79,70,229,0.25), transparent 70%)",
  top: "-200px",
  right: "-250px",
  filter: "blur(180px)",
  zIndex: 0,
}));

const Title = styled(Typography)(() => ({
  fontWeight: 900,
  textAlign: "center",
  fontFamily: "'Poppins', sans-serif",
  background: "linear-gradient(90deg, #4338ca, #7c3aed, #2563eb)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "3.2rem",
  letterSpacing: "1px",
  marginBottom: "20px",
  position: "relative",
  zIndex: 2,
}));

const SubTitle = styled(Typography)(() => ({
  color: "#1e3a8a",
  textAlign: "center",
  maxWidth: "850px",
  margin: "0 auto 80px",
  lineHeight: 1.8,
  fontFamily: "'Inter', sans-serif",
  fontSize: "1.1rem",
  zIndex: 2,
  position: "relative",
}));

const Card = styled(motion.div)(() => ({
  position: "relative",
  backdropFilter: "blur(20px)",
  background:
    "linear-gradient(160deg, rgba(255,255,255,0.8) 0%, rgba(240,244,255,0.6) 100%)",
  border: "1px solid rgba(255,255,255,0.3)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
  borderRadius: "24px",
  padding: "50px 35px",
  textAlign: "center",
  transition: "all 0.5s ease",
  cursor: "default",
  overflow: "hidden",
  zIndex: 1,
  maxWidth: "370px",
  "&:hover": {
    transform: "translateY(-12px) scale(1.03)",
    boxShadow: "0 25px 80px rgba(59,130,246,0.35)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "-100%",
    left: "-100%",
    width: "200%",
    height: "200%",
    background:
      "linear-gradient(120deg, rgba(59,130,246,0.2), rgba(124,58,237,0.15), transparent)",
    transform: "rotate(25deg)",
    opacity: 0,
    transition: "opacity 0.6s ease",
    zIndex: 0,
  },
  "&:hover::after": {
    opacity: 1,
  },
}));

const IconWrapper = styled(Box)(() => ({
  fontSize: "75px",
  marginBottom: "25px",
  background: "linear-gradient(135deg, #4338ca, #7c3aed, #2563eb)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  transition: "transform 0.5s ease",
  "&:hover": {
    transform: "rotate(10deg) scale(1.15)",
  },
}));

const CardTitle = styled(Typography)(() => ({
  fontWeight: 700,
  color: "#111827",
  fontFamily: "'Poppins', sans-serif",
  fontSize: "1.5rem",
  marginBottom: "14px",
  zIndex: 1,
}));

const CardText = styled(Typography)(() => ({
  color: "#374151",
  fontFamily: "'Inter', sans-serif",
  fontSize: "1rem",
  lineHeight: 1.7,
  maxWidth: "300px",
  zIndex: 1,
}));

/* ---------- COMPONENTE ---------- */
export default function Servicos() {
  return (
    <PageContainer>
      <AnimatedGlow
        component={motion.div}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <Title
        component={motion.h2}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Nossos Serviços
      </Title>

      <SubTitle
        component={motion.p}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        A <strong>Bernet-Eclesia</strong> oferece soluções inteligentes,
        automatizadas e humanizadas para simplificar a gestão da sua igreja.
        Experimente tecnologia, beleza e espiritualidade conectadas.
      </SubTitle>

      <Grid
        container
        spacing={6}
        justifyContent="center"
        sx={{ position: "relative", zIndex: 3 }}
      >
        {services.map((service, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            md={4}
            display="flex"
            justifyContent="center"
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.15 }}
          >
            <Card whileHover={{ rotate: [0, -1, 1, 0] }}>
              <IconWrapper>{service.icon}</IconWrapper>
              <CardTitle>{service.title}</CardTitle>
              <CardText>{service.description}</CardText>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
}
