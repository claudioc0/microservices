// features/listar-transacoes-por-conta/index.test.js
const request = require('supertest');
const app = require('../../index'); // Importa o servidor
const { Transacao } = require('../../database'); // Importa o Model

// --- CORREÇÃO AQUI ---
// Precisamos de um mock para a função final .limit()
// que é a que realmente retorna a Promise
const mockLimit = jest.fn();
// --------------------

// =======================================================
// MOCK DO MONGOOSE (MÓDULO database.js)
// =======================================================
jest.mock('../../database', () => ({
  // Mock da função de conexão (não queremos conectar de verdade)
  connectToDatabase: jest.fn().mockResolvedValue(true),

  // Mock do Model 'Transacao'
  Transacao: {
    // Mock do método estático .find()
    find: jest.fn(() => ({
      // Mock da chained function .sort()
      sort: jest.fn(() => ({
         // Mock da chained function .limit()
         // --- CORREÇÃO ---
         // O .limit() agora aponta para o nosso mock
         limit: mockLimit
      }))
    }))
  }
}));
// =======================================================


describe('Feature: Listar Transações por Conta (GET /transacoes/conta/:contaId)', () => {

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    Transacao.find.mockClear();
    // --- CORREÇÃO ---
    // Limpamos o mock do .limit()
    mockLimit.mockClear();
  });

  it('deve retornar 200 e uma lista de transações', async () => {
    // 1. ARRANGE (Arrumar)
    const dadosFalsos = [
      { conta_id: '123', valor_origem: 100 },
      { conta_id: '123', valor_origem: 50 }
    ];
    
    // --- CORREÇÃO ---
    // Dizemos o que o Mongoose deve retornar
    // (O mock do .limit() deve resolver os dados)
    mockLimit.mockResolvedValue(dadosFalsos);

    // 2. ACT (Agir)
    const response = await request(app).get('/transacoes/conta/123');

    // 3. ASSERT (Verificar)
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dadosFalsos);
    expect(Transacao.find).toHaveBeenCalledWith({ conta_id: '123' });
  });

  it('deve retornar 200 e um array vazio se não houver transações', async () => {
    // 1. ARRANGE
    // --- CORREÇÃO ---
    mockLimit.mockResolvedValue([]); // Retorna vazio

    // 2. ACT
    const response = await request(app).get('/transacoes/conta/404');

    // 3. ASSERT
    expect(response.status).toBe(200);
    expect(Transacao.find).toHaveBeenCalledWith({ conta_id: '404' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});