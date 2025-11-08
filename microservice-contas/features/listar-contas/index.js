const { executeSql } = require('../../database');

/**
 * Handler (Controlador) para a rota GET /contas
 */
async function listarContasHandler(req, res) {
  // 1. Query normal, sem FOR JSON
  const query = `SELECT * FROM Contas`;
  
  // 2. Executa a query
  const { rowCount, result } = await executeSql(query);

  // 3. Retorna o resultado
  res.status(200).json(result);
}

module.exports = { listarContasHandler };
