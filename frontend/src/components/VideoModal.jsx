import React from "react";
import { Dialog, IconButton, Box, Fade } from "@mui/material";
import { Close } from "@mui/icons-material";

// Props: open (boolean), handleClose (função), videoSrc (string)
export default function VideoModal({ open, handleClose, videoSrc }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(8px)", // blur no fundo
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          borderRadius: 3,
          overflow: "hidden",
          p: 0,
        },
      }}
      TransitionComponent={Fade} // fade moderno
    >
      <Box
        sx={{
          position: "relative",
          pt: "56.25%", // proporção 16:9
          transform: "scale(1)",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Botão de fechar */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "red",
            zIndex: 3,
            backgroundColor: "rgba(255,255,255,0.15)",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
            width: 48,
            height: 48,
          }}
        >
          <Close sx={{ fontSize: 28 }} />
        </IconButton>

        {/* Vídeo */}
        <video
          src={videoSrc}
          controls
          autoPlay
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          }}
        />
      </Box>
    </Dialog>
  );
}
