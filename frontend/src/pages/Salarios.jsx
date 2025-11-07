import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import {
  MonetizationOn,
  People,
  Payment,
  Discount,
  AccountBalanceWallet,
} from "@mui/icons-material";

import FormFuncionarios from "../components/FormFuncionarios";
import FormSubsidios from "../components/FormSubsidios";
import FormDescontos from "../components/FormDescontos";
import FormSalarios from "../components/FormSalarios";

export default function GestaoSalarios() {
  const [formAtivo, setFormAtivo] = useState("funcionarios");

  const renderFormulario = () => {
    switch (formAtivo) {
      case "funcionarios":
        return <FormFuncionarios />;
      case "subsidios":
        return <FormSubsidios />;
      case "descontos":
        return <FormDescontos />;
      case "salarios":
        return <FormSalarios />;
      default:
        return null;
    }
  };

  const buttonStyles = (active) => ({
    borderRadius: "50px",
    px: 6,
    py: 2,
    fontWeight: 800,
    fontSize: "1rem",
    textTransform: "none",
    color: active ? "#fff" : "#0d47a1",
    background: active
      ? "linear-gradient(90deg, #0d47a1 0%, #1976d2 100%)"
      : "#ffffff",
    border: "2px solid #0d47a1",
    boxShadow: active
      ? "0 8px 24px rgba(13, 71, 161, 0.4)"
      : "0 4px 12px rgba(13, 71, 161, 0.15)",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-3px)",
      background: "linear-gradient(90deg, #1565c0 0%, #0d47a1 100%)",
      color: "#fff",
      boxShadow: "0 10px 28px rgba(13, 71, 161, 0.5)",
    },
  });

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ffffff 0%, #e3f2fd 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 10,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 1100, textAlign: "center" }}
      >
        {/* Título Premium */}
        <Typography
          variant="h3"
          fontWeight={900}
          sx={{
            mb: 5,
            fontFamily: "'Poppins', sans-serif",
            color: "#0d47a1",
            textShadow: "0 3px 8px rgba(13,71,161,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <MonetizationOn sx={{ color: "#1565c0", fontSize: 42 }} />
          Gestão de Salários
        </Typography>

        {/* Barra de Botões */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 8 }}
        >
          <Button
            startIcon={<People />}
            onClick={() => setFormAtivo("funcionarios")}
            sx={buttonStyles(formAtivo === "funcionarios")}
          >
            Funcionários
          </Button>

          <Button
            startIcon={<Payment />}
            onClick={() => setFormAtivo("subsidios")}
            sx={buttonStyles(formAtivo === "subsidios")}
          >
            Subsídios
          </Button>

          <Button
            startIcon={<Discount />}
            onClick={() => setFormAtivo("descontos")}
            sx={buttonStyles(formAtivo === "descontos")}
          >
            Descontos
          </Button>

          <Button
            startIcon={<AccountBalanceWallet />}
            onClick={() => setFormAtivo("salarios")}
            sx={buttonStyles(formAtivo === "salarios")}
          >
            Efetuar Pagamento
          </Button>
        </Stack>

        {/* Formulário Selecionado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            marginTop: "40px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            boxShadow: "0 8px 30px rgba(13,71,161,0.15)",
            padding: "40px",
          }}
        >
          {renderFormulario()}
        </motion.div>
      </motion.div>
    </Box>
  );
}
