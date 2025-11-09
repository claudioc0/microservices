const request = require('supertest');
const app = require('../../index'); // Importa o servidor Express
const db = require('../../database'); // Importa o módulo do banco

// =======================================================
// Mock do database.js
// =======================================================
jest.mock('../../database', () => ({
  TYPES: require('tedious').TYPES,
  executeSql: jest.fn(),
}));

describe('Feature: Criar Conta (POST /contas)', () => {
  beforeEach(() => {
    db.executeSql.mockClear();
  });

  it('deve retornar 201 e a nova conta criada', async () => {
    // ARRANGE
    const dadosEntrada = {
      nome_usuario: 'Claudio Teste',
      email: 'claudio@teste.com',
      saldo: 1000,
      moeda_padrao: 'BRL',
    };

    const dadosRetornoDoBanco = [
      {
        id: 'uuid-falso',
        nome_usuario: 'Claudio Teste',
        email: 'claudio@teste.com',
        saldo: 1000,
        moeda_padrao: 'BRL',
      },
    ];

    // Mock do retorno do banco
    db.executeSql.mockResolvedValue({ result: dadosRetornoDoBanco });

    // ACT
    const response = await request(app)
      .post('/contas')
      .send(dadosEntrada);

    // ASSERT
    expect(response.status).toBe(201);
    expect(response.body).toEqual(dadosRetornoDoBanco[0]);
    expect(db.executeSql).toHaveBeenCalledTimes(1);
  });

  it('deve retornar 400 se dados obrigatórios estiverem faltando', async () => {
    // ARRANGE
    const dadosIncompletos = {
      nome_usuario: 'Usuario Incompleto',
      // faltam email e saldo
    };

    // ACT
    const response = await request(app)
      .post('/contas')
      .send(dadosIncompletos);

    // ASSERT
    expect(response.status).toBe(400);
    expect(db.executeSql).not.toHaveBeenCalled();
  });
});
