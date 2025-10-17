const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Conexão com MongoDB Atlas (use variáveis de ambiente!)
const mongoUri = 'mongodb+srv://claudiocolomboferreira13_db_user:9OgYnD8petAI3OOj@cluster0.nhpcddl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoUri);

const TransacaoSchema = new mongoose.Schema({
    conta_id: String,
    tipo: String,
    valor_origem: Number,
    // ... outros campos
});
const Transacao = mongoose.model('Transacao', TransacaoSchema);

// Endpoint para buscar transações de uma conta
app.get('/transacoes/conta/:contaId', async (req, res) => {
    try {
        const transacoes = await Transacao.find({ conta_id: req.params.contaId }).limit(5);
        res.status(200).json(transacoes);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Este serviço receberá o comando de escrita da Function 2
app.post('/transacoes', async (req, res) => {
    try {
        const novaTransacao = new Transacao(req.body);
        await novaTransacao.save();
        res.status(201).send(novaTransacao);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3002, () => console.log('Microserviço de Transações rodando na porta 3002'));