// jest.config.js
module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  
  // --- ATUALIZAÇÃO ---
  // Removi o 'testRegex' e usei 'testMatch'
  // Este é o padrão default do Jest e vai encontrar
  // qualquer arquivo que termine em .test.js ou .spec.js
  testMatch: [
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js"
  ],

  testPathIgnorePatterns: [
    "/node_modules/"
  ],
};