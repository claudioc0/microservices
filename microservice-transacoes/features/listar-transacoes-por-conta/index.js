
const { Transacao } = require('../../database'); 


async function listarTransacoesPorContaHandler(req, res) {
  const { contaId } = req.params;


  const transacoes = await Transacao
    .find({ conta_id: contaId })
    .sort({ timestamp: -1 }) 
    .limit(5); 


  res.status(200).json(transacoes);
}

module.exports = { listarTransacoesPorContaHandler };