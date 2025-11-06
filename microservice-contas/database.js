require('dotenv').config(); 
const { Connection, Request, TYPES } = require('tedious');

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


async function executeSql(query, params = []) {
  return new Promise((resolve, reject) => {
    const connection = new Connection(config);

    connection.on('connect', (err) => {
      if (err) {
        return reject(err);
      }

      const request = new Request(query, (err, rowCount, rows) => {
        if (err) {
          reject(err);
        } else {
          let result = [];
          if (rowCount > 0 && rows[0][0] && rows[0][0].value) {
            try {
              result = JSON.parse(rows[0][0].value);
            } catch (jsonError) {
              reject(jsonError);
            }
          } else if (rowCount > 0) {
             result = rows;
          }
          resolve({ rowCount, result });
        }
        connection.close();
      });

      params.forEach(p => {
        request.addParameter(p.name, p.type, p.value);
      });

      connection.execSql(request);
    });

    connection.on('error', (err) => {
        reject(err);
    });

    connection.connect();
  });
}

module.exports = { executeSql, TYPES };