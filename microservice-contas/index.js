require('dotenv').config();

const express = require('express');
const { Connection, Request } = require('tedious');

const app = express();
app.use(express.json());

// Configuração da conexão com Azure SQL (use variáveis de ambiente!)
const config = {
  server: 'globalstable.database.windows.net',
  authentication: {
    type: 'default',
    options: {
      userName: 'CloudSA64d4a7e8',
      password: '9OgYnD8petAI3OOj'
    }
  },
  options: {
    encrypt: true,
    database: 'GlobalStable'
  }
};

// Endpoint para buscar conta por ID 
app.get('/contas/:id', (req, res) => {
  const connection = new Connection(config);
  connection.on('connect', (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Query parametrizada
    const request = new Request(`SELECT * FROM Contas WHERE id = @id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER`, (err, rowCount, rows) => {
      if (err) {
        res.status(500).send(err);
      } else if (rowCount === 0) {
        res.status(404).send({ message: "Conta não encontrada" });
      } else {
        // O JSON já vem pronto do SQL Server
        res.status(200).json(JSON.parse(rows[0][0].value)); 
      }
      connection.close();
    });

    // Adiciona o parâmetro de forma segura
    const { TYPES } = require('tedious'); // Importe TYPES
    request.addParameter('id', TYPES.VarChar, req.params.id); // Ajuste o TIPO (ex: TYPES.Int) se o ID for número

    connection.execSql(request);
  });
  connection.connect();
});

// Adicione endpoints para CREATE, UPDATE, DELETE...

app.listen(3001, () => console.log('Microserviço de Contas rodando na porta 3001'));