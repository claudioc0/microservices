// database.js
require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI não está definida no arquivo .env');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('[Clean Architecture] Conectado ao MongoDB Atlas com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar no MongoDB:', error);
    process.exit(1);
  }
}

const TransacaoSchema = new mongoose.Schema({
  conta_id: String,
  tipo: String,
  valor_origem: Number,
  moeda_origem: String,
  valor_destino: Number,
  moeda_destino: String,
  timestamp: { type: Date, default: Date.now },
});

const Transacao = mongoose.model('Transacao', TransacaoSchema);

module.exports = {
  connectToDatabase,
  Transacao,
};
