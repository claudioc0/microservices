// Importamos o TYPES para definir o tipo do parâmetro
const { executeSql, TYPES } = require('../../database');

/**
 * Handler (Controlador) para a rota GET /contas/:id
 */
async function buscarContaPorIdHandler(req, res) {
  const { id } = req.params;
  
  // 1. Define a Query (com parâmetros)
  const query = `SELECT * FROM Contas WHERE id = @id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER`;
  
  // 2. Define os parâmetros (para prevenir SQL Injection)
  const params = [
    { name: 'id', type: TYPES.VarChar, value: id }
  ];

  // 3. Executa a query
  const { rowCount, result } = await executeSql(query, params);

  // 4. Retorna a resposta
  if (rowCount === 0) {
    return res.status(404).send({ message: "Conta não encontrada" });
  }
  
  // O 'result' aqui será um objeto (graças ao WITHOUT_ARRAY_WRAPPER)
  res.status(200).json(result);
}

module.exports = { buscarContaPorIdHandler };