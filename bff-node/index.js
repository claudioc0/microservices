// Carrega variáveis de ambiente
require('dotenv').config(); 

const express = require('express');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Carregar Swagger UI
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const URL_MS_CONTAS = process.env.URL_MS_CONTAS || 'http://localhost:3001';
const URL_MS_TRANSOES = process.env.URL_MS_TRANSOES || 'http://localhost:3002';
const URL_FUNCTION_CRIAR = process.env.URL_FUNCTION_CRIAR;

// --- ENDPOINT 'GET /contas' ---
app.get('/contas', async (req, res) => {
    try {
        const response = await axios.get(`${URL_MS_CONTAS}/contas`);
        res.status(response.status).json(response.data);
    } catch (error) {
        // --- CORREÇÃO AQUI ---
        // Se o microsserviço falhar, repasse o erro como JSON
        const message = error.response?.data?.message || error.message;
        const status = error.response?.status || 500;
        res.status(status).json({ message: message }); // Trocado .send() por .json()
    }
});

// Endpoint de AGREGAÇÃO (sem alterações)
app.get('/relatorio/conta/:id', async (req, res) => {
    try {
        const contaId = req.params.id;
        const [contaResponse, transacoesResponse] = await Promise.all([
            axios.get(`${URL_MS_CONTAS}/contas/${contaId}`),
            axios.get(`${URL_MS_TRANSOES}/transacoes/conta/${contaId}`)
        ]);

        const relatorio = {
            dados_conta: contaResponse.data,
            ultimas_transacoes: transacoesResponse.data
        };
        
        res.status(200).json(relatorio);
    } catch (error) {
        // --- CORREÇÃO AQUI (Melhoria) ---
        const message = error.response?.data?.message || error.message;
        const status = error.response?.status || 500;
        res.status(status).json({ message: message });
    }
});

// --- ENDPOINT 'POST /contas' ---
app.post('/contas', async (req, res) => {
    try {
        const response = await axios.post(`${URL_MS_CONTAS}/contas`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        // --- CORREÇÃO AQUI ---
        // Se o microsserviço falhar (ex: erro 400 de validação),
        // repasse o erro como JSON para o frontend.
        const message = error.response?.data?.message || error.message;
        const status = error.response?.status || 500;
        res.status(status).json({ message: message }); // Trocado .send() por .json()
    }
});

// Endpoint que chama a FUNCTION (sem alterações)
app.post('/transacoes', async (req, res) => {
    try {
        const response = await axios.post(URL_FUNCTION_CRIAR, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        // --- CORREÇÃO AQUI (Melhoria) ---
        const message = error.response?.data?.message || error.message;
        const status = error.response?.status || 500;
        res.status(status).json({ message: message });
    }
});

app.listen(3000, () => console.log('BFF rodando na porta 3000'));