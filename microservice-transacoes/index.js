require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase, Transacao } = require('./database');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// ------------------------------
// POST /transacoes
// ------------------------------
app.post('/transacoes', async (req, res) => {
  try {
    const { conta_id, tipo, valor_origem, moeda_origem, valor_destino, moeda_destino } = req.body;

    // Validação dos campos obrigatórios
    if (!conta_id || !tipo || !valor_origem || !moeda_origem || !valor_destino || !moeda_destino) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }

    const novaTransacao = new Transacao({
      conta_id,
      tipo,
      valor_origem,
      moeda_origem,
      valor_destino,
      moeda_destino,
    });

    const transacaoSalva = await novaTransacao.save();

    res.status(201).json(transacaoSalva);
  } catch (error) {
    console.error("Erro ao registrar transação:", error);
    res.status(500).json({ error: error.code || 'MONGO_ERR', message: error.message });
  }
});

// ------------------------------
// GET /transacoes/conta/:contaId
// ------------------------------
app.get('/transacoes/conta/:contaId', async (req, res) => {
  try {
    const { contaId } = req.params;

    // Busca transações da conta, ordena por timestamp e limita a 50 registros
    const transacoes = await Transacao.find({ conta_id: contaId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(200).json(transacoes);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    res.status(500).json({ error: error.code || 'MONGO_ERR', message: error.message });
  }
});

// ------------------------------
// Inicialização do servidor
// ------------------------------
(async () => {
  try {
    await connectToDatabase();
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`[Clean Architecture] Microserviço de Transações rodando na porta ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Falha ao iniciar o servidor de transações:", error);
  }
})();

module.exports = app;
