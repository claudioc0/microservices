// Usamos express-promise-router para lidar com erros em rotas assíncronas
const Router = require('express-promise-router'); 

// Importamos os handlers das nossas features
const { listarContasHandler } = require('./listar-contas');
const { buscarContaPorIdHandler } = require('./buscar-conta-por-id');

const router = Router();

// =======================================================
// MAPA DE ROTAS
// =======================================================
// Aqui conectamos as rotas (ex: '/contas') aos seus handlers (lógica)

router.get('/contas', listarContasHandler);
router.get('/contas/:id', buscarContaPorIdHandler);

// router.post('/contas', criarContaHandler);
// router.put('/contas/:id', atualizarContaHandler);
// etc...

// =======================================================

module.exports = router;