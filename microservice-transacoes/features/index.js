const Router = require('express-promise-router');

const { criarTransacaoHandler } = require('./criar-transacao');
const { listarTransacoesPorContaHandler } = require('./listar-transacoes-por-conta');

const router = Router();

// POST /transacoes -> cria uma nova transação
router.post('/', criarTransacaoHandler);

// GET /transacoes/conta/:id -> lista transações por conta
router.get('/conta/:id', listarTransacoesPorContaHandler);

module.exports = router;
