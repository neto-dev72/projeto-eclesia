import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function TopBarInfo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const items = [
    { icon: <PhoneIcon />, text: '+351 912 345 678' },
    { icon: <EmailIcon />, text: 'contato@bernetsystem.com' },
    { icon: <LocationOnIcon />, text: 'Lisboa, Portugal' },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        background: 'linear-gradient(90deg, #A3D8F4, #C6E6FA)', // gradiente azul bebé
        color: '#03396c', // azul escuro para melhor contraste
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 2, md: 6 },
        px: { xs: 2, md: 10 },
        py: { xs: 2, md: 2.5 },
        fontSize: { xs: 12, md: 16 },
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {items.map((item, idx) => (
        <Box
          key={idx}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: '#ffffffcc', // branco quase opaco para destacar
            px: 2,
            py: 1,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            cursor: 'default',
            '&:hover': {
              bgcolor: '#ffffff', // fundo totalmente branco ao passar o mouse
              transform: 'translateY(-2px)',
            },
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#1e3a8a', // azul escuro para ícone
              borderRadius: '50%',
              width: isMobile ? 28 : 36,
              height: isMobile ? 28 : 36,
              color: 'white',
              fontSize: isMobile ? 16 : 20,
            }}
          >
            {item.icon}
          </Box>
          <Typography sx={{ fontWeight: 600 }}>{item.text}</Typography>
        </Box>
      ))}
    </Box>
  );
}
