Projeto PJBL - Arquitetura de Microsserviços

Este repositório contém a implementação completa de uma arquitetura de microsserviços distribuídos, incluindo backends (Microsserviços, BFF, Functions), bancos de dados (SQL e NoSQL) e frontends (Micro-Frontends com Module Federation).

1. Integrantes da Equipe

Claudio Colombo 

Eric Simões

João Pedro dos Santos 

Lorenzo Silva 

Vinícius Chella 

2. Arquitetura do Código-Fonte (Clean Architecture & Vertical Slice)

O código-fonte dos microsserviços (microservice-contas e microservice-transacoes) foi refatorado para seguir os padrões de Clean Architecture e Vertical Slice (Fatias Verticais).

O objetivo é separar as responsabilidades e organizar o código por funcionalidade (feature), e não por tipo (como pastas "controllers", "services", "repositories" separadas).

A estrutura de cada microsserviço é a seguinte:

database.js

Responsabilidade: Camada de Acesso a Dados (Data Access Layer).

Função: Centraliza toda a lógica de conexão com o banco de dados (seja Mongoose/MongoDB ou Tedious/Azure SQL).

Exporta: Funções utilitárias (como executeSql) ou Models (como Transacao) para que o resto da aplicação possa interagir com o banco sem saber os detalhes da conexão.

index.js (Raiz)

Responsabilidade: Camada de Servidor (Server Layer).

Função: Apenas inicia o servidor Express, carrega middlewares (como cors e express.json), e importa o roteador principal da pasta features.

Importante: Ele também exporta o app do Express para ser usado pelos testes unitários (Supertest).

features/ (Pasta de "Fatias Verticais")

features/index.js

Responsabilidade: Roteador Principal (Router).

Função: Mapeia as rotas HTTP (ex: GET /contas) para o Handler da feature correspondente (ex: listarContasHandler).

features/listar-contas/index.js (Exemplo de "Fatia")

Responsabilidade: Lógica de Negócios (Business Logic Layer).

Função: Contém todo o código necessário para uma única funcionalidade. Ele importa o database.js para buscar os dados e define o handler (controlador) que formata a resposta.

features/listar-contas/index.test.js (Exemplo de "Teste")

Responsabilidade: Teste Unitário da Fatia.

Função: O teste é colocado ao lado da feature que ele testa. Ele usa o Jest e o Supertest para fazer uma requisição HTTP falsa contra a rota (GET /contas) e "moca" (jest.mock) o database.js para simular respostas do banco (sucesso, vazio ou erro 500), provando que a arquitetura está isolada e correta.

3. Guia Rápido: Como Rodar o Projeto Localmente

Este é um guia passo-a-passo para rodar a aplicação completa na sua máquina local.

AVISO: Esta é uma arquitetura complexa! Você precisará de 7 (sete) terminais rodando ao mesmo tempo para que tudo funcione.

Arquitetura Local

Backends:

microservice-contas (Azure SQL) -> http://localhost:3001

microservice-transacoes (MongoDB) -> http://localhost:3002

bff-node (API Gateway) -> http://localhost:3000

functions (Azure Functions) -> http://localhost:7071

Frontends (Module Federation):

microfrontend/contas (Remote) -> http://localhost:8081

microfrontend/transacoes (Remote) -> http://localhost:8082

microfrontend/host (Shell) -> http://localhost:8080 (URL PRINCIPAL)

⚙️ Passo 0: Pré-Requisitos (Setup)

Antes de rodar, você precisa:

1. Clonar o Repositório:

git clone [https://github.com/claudioc0/microservices.git](https://github.com/claudioc0/microservices.git)
cd microservices-main


2. Ter Contas nos Serviços de Nuvem:
Este projeto NÃO vai funcionar sem as credenciais corretas. Você precisa:

Um cluster MongoDB Atlas (com seu IP liberado no Firewall).

Um servidor Azure SQL (com seu IP liberado no Firewall e a tabela Contas criada).

Um Azure Service Bus (para a fila de eventos das Functions).

Azure Functions Core Tools instalados (npm install -g azure-functions-core-tools@4).

3. Criar TODOS os Arquivos de Credenciais (.env / local.settings.json)
Nossas senhas não estão no Git. Você precisa criar os arquivos abaixo em cada pasta:

bff-node/.env

URL_MS_CONTAS=http://localhost:3001
URL_MS_TRANSOES=http://localhost:3002
URL_FUNCTION_CRIAR=http://localhost:7071/api/CriarTransacaoHttp


microservice-contas/.env

SQL_SERVER=seuservidor.database.windows.net
SQL_USER=seu_usuario_admin
SQL_PASS=sua_senha_do_azure_sql
SQL_DB=seu_banco_de_dados


microservice-transacoes/.env

MONGODB_URI=sua_connection_string_do_mongodb_atlas


functions/local.settings.json

{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_SERVICE_BUS_CONNECTION_STRING": "SUA_CONNECTION_STRING_DO_SERVICE_BUS_AQUI",
    "URL_MS_TRANSACOES": "http://localhost:3002"
  }
}


Passo 1: Instalar Dependências (Em todas as 7 pastas!)

Abra um terminal para CADA pasta e rode npm install:

# Backend
cd bff-node && npm install
cd microservice-contas && npm install
cd microservice-transacoes && npm install
cd functions && npm install

# Frontend
cd microfrontend/host && npm install
cd microfrontend/contas && npm install
cd microfrontend/transacoes && npm install


Passo 2: Rodar o Backend (4 Terminais)

Você precisa de 4 terminais abertos para o backend:

Terminal 1 (Contas - Porta 3001):

cd microservice-contas
node index.js


Terminal 2 (Transações - Porta 3002):

cd microservice-transacoes
node index.js


Terminal 3 (BFF - Porta 3000):

cd bff-node
node index.js


Terminal 4 (Functions - Porta 7071):

cd functions
func start


Passo 3: Rodar o Micro-Frontend (3 Terminais)

Você precisa de 3 terminais abertos para o frontend:

Terminal 5 (MF Contas - Porta 8081):

cd microfrontend/contas
npm start


Terminal 6 (MF Transações - Porta 8082):

cd microfrontend/transacoes
npm start


Terminal 7 (MF Host - Porta 8080):

cd microfrontend/host
npm start


Passo 4: Acessar a Aplicação

Se todos os 7 terminais estiverem rodando sem erros, abra seu navegador e acesse a URL do Host:

http://localhost:8080 

Você deverá ver a aplicação completa funcionando, carregando os dados do Azure SQL (via BFF).
