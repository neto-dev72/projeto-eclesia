import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';

// Ícones modernos do MUI
import EventIcon from '@mui/icons-material/Event';
import ChurchIcon from '@mui/icons-material/Church';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Importando a fonte Poppins
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

// Componentes
import TabelaCultoMensais from '../components/TabelaCultosMensais';
import ListaACultos from '../components/TabelaCultoProgramado';
import ListaAtendimentos from '../components/TabelaAtendimento';
import ListaAgendaPastoral from '../components/TabelaCompromisso';

export default function AtendimentosPage() {
  const sections = [
    { titulo: 'Cultos Mensais', componente: <TabelaCultoMensais />, icon: <ChurchIcon sx={{ color: '#1565c0' }} /> },
    { titulo: 'Cultos Programados', componente: <ListaACultos />, icon: <EventIcon sx={{ color: '#1565c0' }} /> },
    { titulo: 'Atendimentos', componente: <ListaAtendimentos />, icon: <PeopleAltIcon sx={{ color: '#1565c0' }} /> },
    { titulo: 'Agenda Pastoral', componente: <ListaAgendaPastoral />, icon: <CalendarMonthIcon sx={{ color: '#1565c0' }} /> },
  ];

  return (
    <Box
      sx={{
        mt: 4,
        mx: 'auto',
        maxWidth: '95%',
        minHeight: '90vh',
        background: 'linear-gradient(180deg, #f4f8ff 0%, #e8f0ff 100%)',
        borderRadius: 6,
        p: { xs: 2, md: 6 },
        boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      {/* efeito decorativo suave no fundo */}
      <Box
        sx={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #bbdefb40, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      {/* Cabeçalho */}
      <Typography
        variant="h4"
        align="center"
        sx={{
          mb: 6,
          fontWeight: 700,
          color: '#0d47a1',
          textShadow: '0 1px 2px rgba(13,71,161,0.3)',
          letterSpacing: 1,
          position: 'relative',
          zIndex: 1,
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        Painel de Eventos 
      </Typography>

      {/* Seções */}
      {sections.map((secao, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Paper
            elevation={10}
            sx={{
              mb: 6,
              p: 4,
              borderRadius: 5,
              background:
                'linear-gradient(145deg, #ffffff 0%, #f5f8ff 100%)',
              boxShadow:
                '0 8px 25px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
              border: '1px solid #e3eafc',
              transition: 'all 0.35s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow:
                  '0 12px 35px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
              },
            }}
          >
            {/* Cabeçalho da seção */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 30,
                  borderRadius: 2,
                  background:
                    'linear-gradient(180deg, #1e88e5 0%, #1565c0 100%)',
                  mr: 2,
                  boxShadow: '0 2px 6px rgba(21,101,192,0.3)',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#0d47a1',
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {secao.icon}
                {secao.titulo}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3, borderColor: '#bbdefb' }} />

            {/* Conteúdo */}
            <Box
              sx={{
                backgroundColor: 'rgba(245,248,255,0.6)',
                borderRadius: 3,
                p: 2,
                boxShadow: 'inset 0 0 10px rgba(13,71,161,0.05)',
                overflowX: 'auto',
              }}
            >
              {secao.componente}
            </Box>
          </Paper>
        </motion.div>
      ))}

      {/* Rodapé */}
      <Typography
        align="center"
        sx={{
          mt: 4,
          color: 'rgba(13,71,161,0.7)',
          fontSize: 14,
          letterSpacing: 0.5,
          fontFamily: 'Poppins, sans-serif',
          position: 'relative',
          zIndex: 1,
        }}
      >
        © {new Date().getFullYear()} Sistema de Administração — Design Premium
      </Typography>
    </Box>
  );
}
