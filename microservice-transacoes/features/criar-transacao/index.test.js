// features/criar-transacao/index.test.js
const request = require('supertest');
const app = require('../../index');
const { Transacao } = require('../../database'); // Importa direto do módulo mockado

// Mock do método .save()
const mockSave = jest.fn();

// Mock do construtor Transacao
jest.mock('../../database', () => ({
  connectToDatabase: jest.fn().mockResolvedValue(true),
  Transacao: jest.fn().mockImplementation(() => ({
    save: mockSave
  }))
}));

describe('Feature: Criar Transação (POST /transacoes)', () => {

  beforeEach(() => {
    mockSave.mockClear(); // Limpa apenas o mock do .save()
    Transacao.mockClear(); // Limpa o mock do construtor
  });

  it('deve retornar 201 e a transação criada', async () => {
    const dadosEntrada = {
      conta_id: '123',
      tipo: 'debito',
      valor_origem: 100,
      moeda_origem: 'BRL',
      valor_destino: 100,
      moeda_destino: 'BRL'
    };

    const dadosSalvos = { ...dadosEntrada, _id: 'fakeMongoId' };

    mockSave.mockResolvedValue(dadosSalvos);

    const response = await request(app)
      .post('/transacoes')
      .send(dadosEntrada);

    expect(Transacao).toHaveBeenCalledTimes(1);
    expect(Transacao).toHaveBeenCalledWith(dadosEntrada);
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(dadosSalvos);
  });

  it('deve retornar 500 se o .save() falhar', async () => {
    const erroDoBanco = new Error('Falha ao salvar no Mongo');
    erroDoBanco.code = 'MONGO_ERR';

    mockSave.mockRejectedValue(erroDoBanco);

    const response = await request(app)
      .post('/transacoes')
      .send({
        conta_id: '123',
        tipo: 'debito',
        valor_origem: 100,
        moeda_origem: 'BRL',
        valor_destino: 100,
        moeda_destino: 'BRL'
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('MONGO_ERR');
  });
});
