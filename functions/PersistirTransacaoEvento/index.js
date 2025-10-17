const axios = require('axios');

module.exports = async function (context, myQueueItem) {
    context.log('Queue trigger processando item: ', myQueueItem);
    try {
        // Chama o endpoint POST do microsserviço de transações
        await axios.post('http://localhost:3002/transacoes', myQueueItem);
        context.log('Transação persistida com sucesso.');
    } catch (error) {
        context.log.error('Erro ao persistir transação:', error);
        // Adicionar lógica de retry ou dead-letter queue aqui
    }
};