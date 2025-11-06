// jest.config.js
module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  
  // Encontra arquivos .test.js em qualquer subpasta
  testMatch: [
    "**/?(*.)+(spec|test).js"
  ],
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
};