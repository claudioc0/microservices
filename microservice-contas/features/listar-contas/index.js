const { executeSql } = require('../../database');

/**
 * Handler (Controlador) para a rota GET /contas
 * Esta é a nossa "Vertical Slice" - a lógica desta feature está toda aqui.
 */
async function listarContasHandler(req, res) {
  // 1. Define a Query
  const query = `SELECT * FROM Contas FOR JSON PATH`;
  
  // 2. Executa a query (usando a função helper do database.js)
  const { rowCount, result } = await executeSql(query);

  // 3. Retorna a resposta
  // Se rowCount for 0, o 'result' será [] (graças ao FOR JSON PATH)
  res.status(200).json(result);
}

module.exports = { listarContasHandler };