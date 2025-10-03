import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

export default function CartaoMembrosEstilo2({ membro, onClose }) {
  return (
    <Box
      sx={{
        p: 4,
        bgcolor: '#e6f0ff',      // azul claro
        border: '2px solid #1e3a8a',
        borderRadius: 3,
        boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
        textAlign: 'center',
        maxWidth: 600,
        mx: 'auto'
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="#1e3a8a" gutterBottom>
        CARTÃO DE MEMBRO Nº {membro.id}
      </Typography>

      <Avatar
        src={membro.foto || undefined}
        sx={{ width: 120, height: 120, mx: 'auto', border: '3px solid #1e3a8a' }}
      >
        {membro.nome?.[0]}
      </Avatar>

      <Typography variant="h6" mt={2}>{membro.nome}</Typography>

      {membro.data_batismo && (
        <Typography variant="body2" color="text.secondary">
          Batizado em {new Date(membro.data_batismo).toLocaleDateString()}
        </Typography>
      )}

      <Typography variant="caption" display="block" mt={3} color="text.secondary">
        Mantenha este cartão em local seguro.
      </Typography>
    </Box>
  );
}
 