require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase, Transacao } = require('./database'); // ✅ Importa daqui

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// ✅ Criar nova transação
app.post('/transacoes', async (req, res) => {
  try {
    const { conta_id, tipo, valor_origem, moeda_origem, valor_destino, moeda_destino } = req.body;

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

    await novaTransacao.save();

    res.status(201).json({
      message: 'Transação registrada com sucesso.',
      transacao: novaTransacao
    });
  } catch (error) {
    console.error("Erro ao registrar transação:", error);
    res.status(500).json({ message: "Erro ao registrar transação.", error: error.message });
  }
});

// ✅ Buscar transações por conta
app.get('/transacoes/:contaId', async (req, res) => {
  try {
    const { contaId } = req.params;
    const transacoes = await Transacao.find({ conta_id: contaId }).sort({ timestamp: -1 });
    res.json(transacoes);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    res.status(500).json({ message: "Erro ao buscar transações.", error: error.message });
  }
});

// Inicialização
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
