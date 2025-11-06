const Router = require('express-promise-router');

const { criarTransacaoHandler } = require('./criar-transacao');
const { listarTransacoesPorContaHandler } = require('./listar-transacoes-por-conta');

const router = Router();



router.post('/transacoes', criarTransacaoHandler);

router.get('/transacoes/conta/:contaId', listarTransacoesPorContaHandler);


module.exports = router;