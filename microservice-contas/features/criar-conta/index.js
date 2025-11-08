// features/criar-conta/index.js
const { executeSql, TYPES } = require('../../database');
const crypto = require('crypto'); 

/**
 * Handler (Controlador) para a rota POST /contas
 */
async function criarContaHandler(req, res) {
  // 1. Pega os dados do corpo da requisição
  const { nome_usuario, email, saldo, moeda_padrao } = req.body;

  // Validação simples de entrada
  if (!nome_usuario || !email || saldo === undefined) {
    return res.status(400).json({ message: "Dados incompletos (nome, email, saldo são obrigatórios)." });
  }

  // 2. Gera um ID único para a nova conta
  const id = crypto.randomUUID();
  
  // 3. --- NOVA LINHA DE RACIOCÍNIO ---
  // Em vez de INSERT e depois SELECT (duas etapas), fazemos tudo em uma.
  // Usamos 'OUTPUT inserted.*' (sem 'FOR JSON') para que o SQL
  // retorne a linha que acabou de ser inserida.
  const query = `
    INSERT INTO Contas (id, nome_usuario, email, saldo, moeda_padrao)
    OUTPUT inserted.*
    VALUES (@id, @nome_usuario, @email, @saldo, @moeda_padrao)
  `;
  
  // 4. Parâmetros (os mesmos de antes)
  const params = [
    { name: 'id', type: TYPES.VarChar, value: id },
    { name: 'nome_usuario', type: TYPES.NVarChar, value: nome_usuario },
    { name: 'email', type: TYPES.NVarChar, value: email },
    { name: 'saldo', type: TYPES.Decimal, value: saldo.toString() },
    { name: 'moeda_padrao', type: TYPES.NVarChar, value: moeda_padrao || 'BRL' }
  ];

  // 5. Executa a query ÚNICA
  // O nosso 'database.js' (com a correção '&& rows')
  // vai receber { rowCount: 1, result: [ { id: '...', ... } ] }
  const { result } = await executeSql(query, params);

  // 6. Retorna o objeto criado
  // O 'result' é um array, então pegamos o primeiro (e único) item.
  res.status(201).json(result[0]);
}

module.exports = { criarContaHandler };