import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Tooltip } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function NotificationBell({ userRole }) {
  const [contador, setContador] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== 'admin') return;

    const fetchContador = async () => {
      try {
        const res = await api.get('/contador');
        setContador(res.data.total || 0);
      } catch (err) {
        console.error('Erro ao buscar contador de notificações:', err);
      }
    };

    fetchContador();
    const intervalo = setInterval(fetchContador, 60000);
    return () => clearInterval(intervalo);
  }, [userRole]);

  if (userRole !== 'admin') return null;

  return (
    <Tooltip title="Ver aniversários" arrow placement="bottom">
      <IconButton
        color="inherit"
        sx={{ mr: 2 }}
        onClick={() => navigate('/aniversarios')}
      >
        <Badge
          badgeContent={contador}
          color="error"
          overlap="circular"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            '& .MuiBadge-badge': {
              background: contador > 0
                ? 'linear-gradient(135deg, #ff416c, #ff4b2b)'
                : 'rgba(255,255,255,0.25)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.85rem',
              minWidth: '24px',
              height: '24px',
              borderRadius: '12px',
              boxShadow: contador > 0
                ? '0 0 12px rgba(255,75,43,0.8), inset 0 0 4px rgba(255,255,255,0.3)'
                : 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
        >
          <NotificationsIcon sx={{ color: 'white', fontSize: 28 }} />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
