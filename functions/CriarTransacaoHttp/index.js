module.exports = async function (context, req) {
    context.log('HTTP trigger para criar transação recebido.');
    
    if (req.body) {
        // Envia o corpo da requisição para a fila
        context.bindings.outputQueueItem = req.body;
        context.res = {
            status: 202, // Accepted
            body: "Sua transação foi recebida e está sendo processada."
        };
    } else {
        context.res = {
            status: 400,
            body: "Por favor, passe os dados da transação no corpo da requisição."
        };
    }
};