const request = require('supertest');
const app = require('../../index');
const db = require('../../database');

// =======================================================
// MOCK DO MONGOOSE (MÓDULO database.js)
// =======================================================
// Desta vez, precisamos mockar o 'new Transacao()' (o construtor)
// e o método '.save()' da instância.

// 1. Criamos um mock para a função 'save'
const mockSave = jest.fn();

// 2. Mockamos o módulo 'database'
jest.mock('../../database', () => ({
  connectToDatabase: jest.fn().mockResolvedValue(true),

  // 3. Mockamos o Construtor 'Transacao'
  //    Ele agora retorna um objeto que tem a função '.save()'
  Transacao: jest.fn().mockImplementation(() => ({
    save: mockSave
  }))
}));
// =======================================================


describe('Feature: Criar Transação (POST /transacoes)', () => {
  
  beforeEach(() => {
    mockSave.mockClear();
    db.Transacao.mockClear();
  });

  it('deve retornar 201 e a transação criada', async () => {
    // 1. ARRANGE (Arrumar)
    const dadosEntrada = { conta_id: '123', valor_origem: 100 };
    const dadosSalvos = { ...dadosEntrada, _id: 'fakeMongoId' };
    
    // Dizemos o que o .save() deve retornar
    mockSave.mockResolvedValue(dadosSalvos);

    // 2. ACT (Agir)
    const response = await request(app)
      .post('/transacoes')
      .send(dadosEntrada); // Envia os dados no corpo da requisição

    // 3. ASSERT (Verificar)
    expect(db.Transacao).toHaveBeenCalledTimes(1);      // Ver se 'new Transacao()' foi chamado
    expect(db.Transacao).toHaveBeenCalledWith(dadosEntrada); // Ver se foi chamado com os dados corretos
    expect(mockSave).toHaveBeenCalledTimes(1);          // Ver se '.save()' foi chamado
    expect(response.status).toBe(201);
    expect(response.body).toEqual(dadosSalvos);      // Ver se retornou os dados salvos
  });

  it('deve retornar 500 se o .save() falhar', async () => {
    // 1. ARRANGE
    const erroDoBanco = new Error('Falha ao salvar no Mongo');
    erroDoBanco.code = 'MONGO_ERR';
    
    // Simulamos o .save() dando um erro
    mockSave.mockRejectedValue(erroDoBanco);

    // 2. ACT
    const response = await request(app)
      .post('/transacoes')
      .send({ conta_id: '123' });

    // 3. ASSERT
    // O express-promise-router deve capturar o erro
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('MONGO_ERR');
  });
});