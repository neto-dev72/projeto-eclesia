import React, { useRef } from 'react';
import { Box, Typography, Avatar, IconButton, Chip, Stack, Fade, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import { toPng } from 'html-to-image';   // npm install html-to-image

export default function CartaoMembros({ membro, onClose }) {
  const cardRef = useRef(null);

  const baixarImagem = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `cartao_membro_${membro.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={baixarImagem}
        sx={{ mb: 2 }}
      >
        Baixar como Imagem
      </Button>

      <Fade in={true}>
        <Box
          ref={cardRef}   // 🔑 este ref é o alvo da captura
          sx={{
            position: 'relative',
            p: 4,
            bgcolor: '#f8faff',
            borderRadius: 3,
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            transition: 'transform 0.3s, box-shadow 0.3s',
            maxWidth: 650,
            mx: 'auto',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 12px 35px rgba(0,0,0,0.25)',
            },
          }}
        >
          {/* Dados à esquerda */}
          <Box sx={{ flex: 1, pl: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              sx={{ color: '#1e3a8a', mb: 1 }}
            >
              CARTÃO DE MEMBRO NÚMERO {membro.id}
            </Typography>

            <Typography variant="h5" gutterBottom fontWeight="bold">
              {membro.nome}
            </Typography>

            {membro.cargos?.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WorkIcon fontSize="small" sx={{ color: '#1e3a8a' }} /> Cargos:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {membro.cargos.map((cargo) => (
                    <Chip key={cargo.id} label={cargo.nome} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                  ))}
                </Stack>
              </Box>
            )}

            {membro.departamentos?.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <GroupIcon fontSize="small" sx={{ color: '#1e3a8a' }} /> Departamentos:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {membro.departamentos.map((dep) => (
                    <Chip key={dep.id} label={dep.nome} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                  ))}
                </Stack>
              </Box>
            )}

            {membro.data_batismo && (
              <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: '#555' }}>
                Data de Batismo: {new Date(membro.data_batismo).toLocaleDateString()}
              </Typography>
            )}

            <Box
              sx={{
                mt: 3,
                pt: 1,
                borderTop: '1px solid #d0d7e0',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <SecurityIcon fontSize="small" sx={{ color: '#1e3a8a' }} />
              <Typography variant="caption" color="text.secondary">
                Proteja este cartão e mantenha suas informações seguras.
              </Typography>
            </Box>
          </Box>

          {/* Foto à direita */}
          <Box sx={{ ml: 3, position: 'relative' }}>
            <Avatar
              src={membro.foto || undefined}
              sx={{
                width: 140,
                height: 140,
                border: '3px solid #1e3a8a',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.15)',
              }}
            >
              {membro.nome.charAt(0).toUpperCase()}
            </Avatar>

            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                bgcolor: 'white',
                '&:hover': { bgcolor: 'error.main', color: 'white' },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </Fade>
    </>
  );
}
