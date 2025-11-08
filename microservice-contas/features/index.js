// Usamos express-promise-router para lidar com erros em rotas assíncronas
const Router = require('express-promise-router'); 

// Importamos os handlers das nossas features
const { listarContasHandler } = require('./listar-contas');
const { buscarContaPorIdHandler } = require('./buscar-conta-por-id');
// --- NOVA LINHA ---
// Importa o handler da nova feature "Criar Conta"
const { criarContaHandler } = require('./criar-conta');


const router = Router();

// =======================================================
// MAPA DE ROTAS
// =======================================================

// Rotas de Leitura (GET)
router.get('/contas', listarContasHandler);
router.get('/contas/:id', buscarContaPorIdHandler);

// Rotas de Escrita (POST)
// Conecta a rota POST /contas ao seu novo handler
router.post('/contas', criarContaHandler);

// router.put('/contas/:id', atualizarContaHandler);
// router.delete('/contas/:id', deletarContaHandler);
// etc...

// =======================================================

module.exports = router;