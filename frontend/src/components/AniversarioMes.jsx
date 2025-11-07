import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import {
  Box,
  Typography,
  CircularProgress,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Paper,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { FaBirthdayCake, FaCalendarAlt } from "react-icons/fa";

/* 🌈 Fundo elegante com luzes flutuantes */
const Background = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100%",
  background: "linear-gradient(135deg, #f6f9ff 0%, #eef3ff 50%, #ffffff 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: theme.spacing(10, 3),
  position: "relative",
  overflow: "hidden",
}));

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
    top: "10%",
    left: "-15%",
    width: "500px",
    height: "500px",
    background: "rgba(0,132,255,0.25)",
  },
  "&::after": {
    bottom: "-15%",
    right: "-10%",
    width: "600px",
    height: "600px",
    background: "rgba(0,212,255,0.25)",
  },
  "@keyframes float": {
    "0%": { transform: "translateY(0)" },
    "100%": { transform: "translateY(25px)" },
  },
});

/* ✨ Cabeçalho */
const Title = styled(Typography)(({ theme }) => ({
  fontFamily: "'Raleway', sans-serif",
  fontWeight: 900,
  fontSize: "3rem",
  background: "linear-gradient(90deg, #0038ff, #00c3ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textAlign: "center",
  marginBottom: theme.spacing(1),
  zIndex: 2,
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Inter', sans-serif",
  fontSize: "1.2rem",
  color: "#003366",
  opacity: 0.85,
  textAlign: "center",
  marginBottom: theme.spacing(5),
  zIndex: 2,
}));

const SelectBox = styled(FormControl)(({ theme }) => ({
  minWidth: 220,
  marginBottom: theme.spacing(6),
  zIndex: 3,
}));

/* 📓 Estilo premium de “papel de caderno” */
const TablePaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: "1000px",
  borderRadius: "20px",
  padding: theme.spacing(2),
  background: "repeating-linear-gradient(0deg, #ffffff, #ffffff 29px, #d8e3ff 30px)",
  boxShadow: "0 15px 45px rgba(0,0,0,0.1)",
  border: "1px solid #ccd9ff",
  backdropFilter: "blur(20px)",
  position: "relative",
  overflow: "hidden",
}));

const TableHeader = styled(TableRow)(() => ({
  background: "linear-gradient(90deg, #005cff, #00c8ff)",
}));

const HeaderCell = styled(TableCell)(() => ({
  color: "#fff",
  fontWeight: 700,
  fontFamily: "'Poppins', sans-serif",
  fontSize: "1rem",
  textTransform: "uppercase",
}));

const DataCell = styled(TableCell)(() => ({
  fontFamily: "'Inter', sans-serif",
  color: "#002244",
  fontWeight: 500,
  fontSize: "1rem",
}));

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro"
];

const AniversarianteMes = () => {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscar = async (m) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/aniversarios/mes/${m}`);
      setLista(data.aniversariantes || []);
    } catch (error) {
      console.error("Erro ao buscar aniversariantes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscar(mes);
  }, [mes]);

  return (
    <Background>
      <FloatingLights />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ zIndex: 2 }}
      >
        <Title>🎉 Aniversariantes do Mês</Title>
        <Subtitle>Veja quem está comemorando neste mês 💙</Subtitle>

        <SelectBox variant="outlined">
          <InputLabel>Mês</InputLabel>
          <Select
            value={mes}
            label="Mês"
            onChange={(e) => setMes(e.target.value)}
          >
            {meses.map((m, i) => (
              <MenuItem key={i} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </SelectBox>
      </motion.div>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
          zIndex={2}
        >
          <CircularProgress sx={{ color: "#0048ff" }} />
        </Box>
      ) : lista.length === 0 ? (
        <Typography
          variant="h6"
          sx={{ color: "#003366", mt: 8, opacity: 0.85 }}
        >
          Nenhum aniversariante neste mês 🎈
        </Typography>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: "100%", display: "flex", justifyContent: "center", zIndex: 2 }}
        >
          <TablePaper elevation={5}>
            <Table>
              <TableHead>
                <TableHeader>
                  <HeaderCell>Foto</HeaderCell>
                  <HeaderCell>Nome</HeaderCell>
                  <HeaderCell>Data de Nascimento</HeaderCell>
                  <HeaderCell>Idade</HeaderCell>
                </TableHeader>
              </TableHead>
              <TableBody>
                {lista.map((pessoa, index) => {
                  const dataNasc = new Date(pessoa.data_nascimento);
                  const idade =
                    new Date().getFullYear() - dataNasc.getFullYear() -
                    (new Date().getMonth() < dataNasc.getMonth() ||
                    (new Date().getMonth() === dataNasc.getMonth() &&
                      new Date().getDate() < dataNasc.getDate())
                      ? 1
                      : 0);
                  return (
                    <TableRow
                      key={pessoa.id || index}
                      sx={{
                        transition: "background 0.3s",
                        "&:hover": { background: "rgba(0,102,255,0.08)" },
                      }}
                    >
                      <DataCell>
                        <Avatar
                          src={pessoa.foto || "/default-user.png"}
                          alt={pessoa.nome}
                          sx={{
                            width: 65,
                            height: 65,
                            borderRadius: "15%",
                            border: "2px solid rgba(0,102,255,0.2)",
                          }}
                        />
                      </DataCell>
                      <DataCell sx={{ fontWeight: 700, color: "#0033aa" }}>
                        {pessoa.nome}
                      </DataCell>
                      <DataCell>
                        <FaCalendarAlt style={{ marginRight: 8, color: "#0048ff" }} />
                        {dataNasc.toLocaleDateString("pt-BR")}
                      </DataCell>
                      <DataCell>
                        <FaBirthdayCake style={{ marginRight: 6, color: "#ff7b00" }} />
                        {idade} anos
                      </DataCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TablePaper>
        </motion.div>
      )}
    </Background>
  );
};

export default AniversarianteMes;
