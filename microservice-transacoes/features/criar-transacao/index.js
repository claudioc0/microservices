// features/criar-transacao/index.js
const { Transacao } = require('../../database'); // Importa o Model

/**
 * Handler (Controlador) para a rota POST /transacoes
 * Esta é a rota que a sua Azure Function (PersistirTransacaoEvento) chama.
 */
async function criarTransacaoHandler(req, res) {
  // 1. Pega os dados do corpo da requisição (enviados pela Function)
  const dadosDaTransacao = req.body;

  // 2. Cria uma nova instância do Model
  const novaTransacao = new Transacao(dadosDaTransacao);

  // 3. Salva no MongoDB
  // --- CORREÇÃO: ---
  // Precisamos capturar o resultado do '.save()',
  // pois é ele que contém o _id e os dados do banco.
  const transacaoSalva = await novaTransacao.save();

  // 4. Retorna a transação criada com um status 201
  // --- CORREÇÃO: ---
  // Retornamos a 'transacaoSalva', e não a 'novaTransacao'.
  res.status(201).json(transacaoSalva);
}

module.exports = { criarTransacaoHandler };