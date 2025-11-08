// features/criar-conta/index.test.js
const request = require('supertest');
const app = require('../../index'); // Importa o servidor
const db = require('../../database'); // Importa o módulo do banco

// =======================================================
// MOCK DO database.js
// =======================================================
// "Mockamos" (enganamos) o módulo 'database'
jest.mock('../../database', () => ({
  // Mantemos o TYPES real, pois nosso handler o utiliza
  TYPES: require('tedious').TYPES, 
  // "Enganamos" a função executeSql
  executeSql: jest.fn(), 
}));
// =======================================================


describe('Feature: Criar Conta (POST /contas)', () => {

  beforeEach(() => {
    // Limpa o mock antes de cada teste
    db.executeSql.mockClear();
  });

  it('deve retornar 201 e a nova conta criada', async () => {
    // 1. ARRANGE (Arrumar)
    const dadosEntrada = {
      nome_usuario: 'Claudio Teste',
      email: 'claudio@teste.com',
      saldo: 1000,
      moeda_padrao: 'BRL'
    };
    
    const dadosRetornoDoBanco = {
      id: 'uuid-falso', // O banco retornaria o ID gerado
      ...dadosEntrada
    };

    // Dizemos ao nosso mock para retornar os 'dadosRetornoDoBanco'
    db.executeSql.mockResolvedValue({ result: dadosRetornoDoBanco });

    // 2. ACT (Agir)
    const response = await request(app)
      .post('/contas')
      .send(dadosEntrada); // Envia os dados no corpo da requisição

    // 3. ASSERT (Verificar)
    expect(response.status).toBe(201);
    expect(response.body).toEqual(dadosRetornoDoBanco);
    expect(db.executeSql).toHaveBeenCalledTimes(1); // Garante que o banco foi chamado
  });

  it('deve retornar 400 (Bad Request) se os dados estiverem faltando', async () => {
    // 1. ARRANGE
    const dadosIncompletos = {
      nome_usuario: 'Usuario Incompleto'
      // email e saldo estão faltando
    };

    // 2. ACT
    const response = await request(app)
      .post('/contas')
      .send(dadosIncompletos);

    // 3. ASSERT
    expect(response.status).toBe(400);
    expect(db.executeSql).not.toHaveBeenCalled(); // Não deve nem tentar chamar o banco
  });
});