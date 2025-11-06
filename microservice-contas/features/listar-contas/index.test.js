// Importamos o 'supertest' para fazer requisições HTTP falsas
const request = require('supertest');

// Importamos o nosso servidor Express (o index.js principal)
// O Supertest vai iniciar o servidor para nós
const app = require('../../index'); 

// Importamos o MÓDULO que queremos "mockar" (enganar)
const db = require('../../database');

// =======================================================
// MOCK DO BANCO DE DADOS
// =======================================================
// Aqui dizemos ao Jest: "Qualquer arquivo que tentar importar o '../../database',
// não dê o arquivo real, dê este mock."
jest.mock('../../database', () => ({
  // Nós "mockamos" a função 'executeSql' que é a única
  // coisa que esta feature usa.
  executeSql: jest.fn(),
}));
// =======================================================


describe('Feature: Listar Contas (GET /contas)', () => {

  // Limpa o mock antes de cada teste
  beforeEach(() => {
    db.executeSql.mockClear();
  });

  // Teste de Caminho Feliz (Happy Path)
  it('deve retornar 200 e uma lista de contas', async () => {
    
    // 1. ARRANGE (Arrumar)
    // Preparamos nossos dados falsos
    const dadosFalsos = [
      { id: '1', nome_usuario: 'Claudio', saldo: 100 },
      { id: '2', nome_usuario: 'Maria', saldo: 200 }
    ];
    
    // Dizemos ao nosso mock 'executeSql' o que ele deve retornar
    // quando for chamado. (Note: o 'result' está dentro de um objeto)
    db.executeSql.mockResolvedValue({
      rowCount: 2,
      result: dadosFalsos
    });

    // 2. ACT (Agir)
    // Usamos o supertest para fazer uma requisição real (mas em memória)
    // ao nosso servidor Express.
    const response = await request(app).get('/contas');

    // 3. ASSERT (Verificar)
    // Verificamos se o banco de dados foi chamado
    expect(db.executeSql).toHaveBeenCalledTimes(1);
    
    // Verificamos se a resposta do servidor está correta
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dadosFalsos); // O corpo deve ser os dados falsos
  });

  // Teste de Caminho Vazio
  it('deve retornar 200 e um array vazio se não houver contas', async () => {
    
    // 1. ARRANGE (Arrumar)
    // Desta vez, o banco não retorna nada
    db.executeSql.mockResolvedValue({
      rowCount: 0,
      result: []
    });

    // 2. ACT (Agir)
    const response = await request(app).get('/contas');

    // 3. ASSERT (Verificar)
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]); // O corpo deve ser um array vazio
  });

  // Teste de Erro 500
  it('deve retornar 500 se o banco de dados falhar', async () => {
    
    // 1. ARRANGE (Arrumar)
    // Simulamos um erro vindo do banco de dados
    const erroDoBanco = new Error('Falha na conexão SQL');
    erroDoBanco.code = 'ESQL'; // Código de erro falso
    
    db.executeSql.mockRejectedValue(erroDoBanco);

    // 2. ACT (Agir)
    const response = await request(app).get('/contas');

    // 3. ASSERT (Verificar)
    // O nosso handler de erro genérico (no index.js) deve capturar
    // o erro e retornar um 500.
    expect(response.status).toBe(500);
    expect(response.body.message).toContain('Ocorreu um erro interno');
    expect(response.body.error).toBe('ESQL'); // Verificamos se o erro foi repassado
  });
});