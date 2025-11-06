// jest.setup.js
// Silencia o console.error durante os testes (para não poluir a saída)
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore(); // Restaura o console.error original
});