// Importa o dotenv para carregar as variáveis de ambiente
require('dotenv').config(); 
const { Connection, Request, TYPES } = require('tedious');

// 1. Configuração central da conexão (lida do .env)
const config = {
  server: process.env.SQL_SERVER,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.SQL_USER,
      password: process.env.SQL_PASS,
    },
  },
  options: {
    encrypt: true,
    database: process.env.SQL_DB,
    connectTimeout: 30000 
  },
};

/**
 * Função helper para executar queries de forma segura e assíncrona.
 * Isso remove a lógica de conexão de dentro das nossas rotas.
 */
async function executeSql(query, params = []) {
  return new Promise((resolve, reject) => {
    const connection = new Connection(config);

    connection.on('connect', (err) => {
      if (err) return reject(err);

      const result = [];
      let jsonBuffer = '';

      const request = new Request(query, (err, rowCount) => {
        if (err) return reject(err);

        // Se veio JSON (FOR JSON PATH)
        if (jsonBuffer) {
          try {
            const parsed = JSON.parse(jsonBuffer);
            resolve({ rowCount, result: parsed });
          } catch (jsonError) {
            reject(jsonError);
          }
        } else {
          // Se veio linha normal (SELECT *)
          resolve({ rowCount, result });
        }

        connection.close();
      });

      // Adiciona parâmetros
      params.forEach(p => {
        request.addParameter(p.name, p.type, p.value);
      });

      // Captura resultados linha a linha
      request.on('row', columns => {
        // Se for JSON (FOR JSON PATH), concatena a string
        if (columns.length === 1 && columns[0].metadata.colName === '' && typeof columns[0].value === 'string') {
          jsonBuffer += columns[0].value;
        } else {
          // Caso padrão: SELECT normal
          const rowObj = {};
          columns.forEach(col => {
            rowObj[col.metadata.colName] = col.value;
          });
          result.push(rowObj);
        }
      });

      connection.execSql(request);
    });

    connection.on('error', (err) => reject(err));
    connection.connect();
  });
}

// Exporta a função e os TYPES do Tedious para usarmos nas 'features'
module.exports = { executeSql, TYPES };