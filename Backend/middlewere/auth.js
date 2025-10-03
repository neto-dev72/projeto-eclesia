const jwt = require("jsonwebtoken");
const JWT_SECRET = "berna12890i";

module.exports = (req, res, next) => {
  console.log("Middleware auth chamado"); // debug

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("Token não fornecido");
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("Token mal formatado");
    return res.status(401).json({ erro: "Token mal formatado" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("Token verificado com sucesso", payload); // debug

    // Guardamos no req.usuario apenas os campos que realmente existem na tabela
    req.usuario = {
      id: payload.id,
      nome: payload.nome,
      SedeId: payload.SedeId || null,
      FilhalId: payload.FilhalId || null,
      funcao: payload.funcao || null, // adicionando a função do usuário
    };

    next();
  } catch (err) {
    console.log("Erro ao verificar token", err.message);
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
};
