import React from 'react';
import { Box, Typography } from '@mui/material';

export default function CartaoMembrosEstilo3({ membro }) {
  return (
    <Box
      sx={{
        p: 4,
        bgcolor: '#1e3a8a',      // azul escuro
        color: 'white',
        borderRadius: 2,
        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
        maxWidth: 600,
        mx: 'auto'
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        CARTÃO DE MEMBRO Nº {membro.id}
      </Typography>

      <Typography variant="h6">{membro.nome}</Typography>

      {membro.data_batismo && (
        <Typography variant="body2">
          Batizado em {new Date(membro.data_batismo).toLocaleDateString()}
        </Typography>
      )}

      <Typography variant="caption" display="block" mt={3}>
        Proteja este cartão contra danos ou perda.
      </Typography>
    </Box>
  );
}
 