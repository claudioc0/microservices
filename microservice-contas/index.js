require('dotenv').config(); 
const express = require('express');
const featureRoutes = require('./features'); 
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/', featureRoutes);


app.use((err, req, res, next) => {
  console.error("ERRO INESPERADO:", err.message || err);
  res.status(500).json({ 
      message: "Ocorreu um erro interno no servidor.",
      error: err.code || err.message 
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Clean Architecture] Microserviço de Contas (Vertical Slice) rodando na porta ${PORT}`);
  });
}

// Exportamos o 'app' para que o Supertest possa importá-lo
module.exports = app;