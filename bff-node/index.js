const express = require('express');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
app.use(express.json());

// Carregar Swagger UI
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const URL_MS_CONTAS = 'http://localhost:3001';
const URL_MS_TRANSACOES = 'http://localhost:3002';
const URL_FUNCTION_CRIAR = 'URL_DA_SUA_FUNCTION_HTTP_TRIGGER';

// Endpoint de AGREGAÇÃO
app.get('/relatorio/conta/:id', async (req, res) => {
    try {
        const contaId = req.params.id;
        
        // Chamadas em paralelo
        const [contaResponse, transacoesResponse] = await Promise.all([
            axios.get(`${URL_MS_CONTAS}/contas/${contaId}`),
            axios.get(`${URL_MS_TRANSACOES}/transacoes/conta/${contaId}`) // Supondo que a function atualize o MS
        ]);

        const relatorio = {
            dados_conta: contaResponse.data,
            ultimas_transacoes: transacoesResponse.data
        };
        
        res.status(200).json(relatorio);
    } catch (error) {
        res.status(500).send({ message: "Erro ao agregar dados", error: error.message });
    }
});

// Endpoint de PROXY para criar conta (chama o microserviço)
app.post('/contas', async (req, res) => {
    try {
        const response = await axios.post(`${URL_MS_CONTAS}/contas`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).send(error.message);
    }
});

// Endpoint que chama a FUNCTION para criar transação via evento
app.post('/transacoes', async (req, res) => {
    try {
        const response = await axios.post(URL_FUNCTION_CRIAR, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).send({ message: "Erro ao iniciar criação da transação", error: error.message });
    }
});

app.listen(3000, () => console.log('BFF rodando na porta 3000'));