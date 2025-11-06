require('dotenv').config();
const express = require('express');
const featureRoutes = require('./features'); // Importa o roteador
const { connectToDatabase } = require('./database'); // Importa a função de conexão

// --- CORREÇÃO: Movido 'app' para o escopo global ---
// Isso garante que o 'module.exports = app' funcione
// e que o 'app' seja real quando o Supertest o importar.
const app = express();
// ----------------------------------------------------

const PORT = process.env.PORT || 3002;

// Middlewares Padrão
app.use(express.json());

// Carrega todas as rotas (definidas em /features/index.js)
app.use('/', featureRoutes);

// Handler de Erro Genérico
app.use((err, req, res, next) => {
  console.error("ERRO INESPERADO (Transações):", err.message || err);
  res.status(500).json({ 
      message: "Ocorreu um erro interno no servidor de Transações.",
      error: err.code || err.message 
  });
});

/**
 * Função auto-executável para iniciar o servidor.
 */
(async () => {
  try {
    // 1. Conecta ao MongoDB
    await connectToDatabase();
    
    // 2. Inicia o servidor Express (SÓ SE NÃO ESTIVER TESTANDO)
    //    Esta é a atualização crucial para o Jest funcionar
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`[Clean Architecture] Microserviço de Transações (Vertical Slice) rodando na porta ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Falha ao iniciar o servidor de transações:", error);
  }
})();

// Exportamos o 'app' para que o Supertest possa importá-lo
module.exports = app;