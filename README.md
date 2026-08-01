# Arquitetura de Microsserviços — Projeto PJBL

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![Azure Functions](https://img.shields.io/badge/Azure-Functions-0062AD?logo=microsoftazure&logoColor=white)
![Webpack](https://img.shields.io/badge/Module_Federation-Webpack-8DD6F9?logo=webpack&logoColor=black)
![Jest](https://img.shields.io/badge/tests-Jest-C21325?logo=jest&logoColor=white)

Projeto em equipe (PJBL) implementando uma arquitetura de microsserviços distribuídos
completa: backends (microsserviços, BFF, Azure Functions), bancos de dados (SQL e NoSQL)
e frontends via Micro-Frontends com Module Federation.

**Equipe:** Claudio Colombo, Eric Simões, João Pedro dos Santos, Lorenzo Silva, Vinícius Chella.

## Arquitetura

**Backends:**
- `microservice-contas` (Azure SQL) — `:3001`
- `microservice-transacoes` (MongoDB) — `:3002`
- `bff-node` (API Gateway, com Swagger) — `:3000`
- `functions` (Azure Functions, eventos via Service Bus) — `:7071`

**Frontends (Module Federation):**
- `microfrontend/contas` (remote) — `:8081`
- `microfrontend/transacoes` (remote) — `:8082`
- `microfrontend/host` (shell, URL principal) — `:8080`

### Código-fonte dos microsserviços (Clean Architecture + Vertical Slice)

Cada microsserviço organiza o código por **funcionalidade**, não por tipo técnico:

- `database.js` — camada de acesso a dados, centraliza a conexão (Mongoose/MongoDB ou
  Tedious/Azure SQL) e exporta funções utilitárias/models.
- `index.js` — inicia o Express, carrega middlewares e o roteador principal; exporta o
  `app` para os testes (Supertest).
- `features/<nome-da-feature>/index.js` — lógica de negócio de uma única funcionalidade
  (ex: `listar-contas`), incluindo o handler HTTP.
- `features/<nome-da-feature>/index.test.js` — teste unitário da fatia, ao lado do código
  que testa; usa Jest + Supertest e mocka `database.js` para simular sucesso, lista vazia
  e erro 500, comprovando o isolamento da camada de negócio.

## Rodando localmente

⚠️ Arquitetura complexa: são **7 terminais** rodando ao mesmo tempo, e requer contas reais
em serviços de nuvem (não funciona só com `git clone`).

**Pré-requisitos:**
- Um cluster MongoDB Atlas (IP liberado no firewall)
- Um servidor Azure SQL (IP liberado, tabela `Contas` criada)
- Um Azure Service Bus (fila de eventos das Functions)
- Azure Functions Core Tools (`npm install -g azure-functions-core-tools@4`)

**1. Criar os arquivos de credenciais** (nada disso está no Git):

`bff-node/.env`
```
URL_MS_CONTAS=http://localhost:3001
URL_MS_TRANSOES=http://localhost:3002
URL_FUNCTION_CRIAR=http://localhost:7071/api/CriarTransacaoHttp
```

`microservice-contas/.env`
```
SQL_SERVER=seuservidor.database.windows.net
SQL_USER=seu_usuario_admin
SQL_PASS=sua_senha_do_azure_sql
SQL_DB=seu_banco_de_dados
```

`microservice-transacoes/.env`
```
MONGODB_URI=sua_connection_string_do_mongodb_atlas
```

`functions/local.settings.json`
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_SERVICE_BUS_CONNECTION_STRING": "SUA_CONNECTION_STRING_DO_SERVICE_BUS_AQUI",
    "URL_MS_TRANSACOES": "http://localhost:3002"
  }
}
```

**2. Instalar dependências** (em cada uma das 7 pastas):

```bash
cd bff-node && npm install
cd microservice-contas && npm install
cd microservice-transacoes && npm install
cd functions && npm install
cd microfrontend/host && npm install
cd microfrontend/contas && npm install
cd microfrontend/transacoes && npm install
```

**3. Subir o backend** (4 terminais):

```bash
cd microservice-contas && node index.js       # :3001
cd microservice-transacoes && node index.js   # :3002
cd bff-node && node index.js                  # :3000
cd functions && func start                    # :7071
```

**4. Subir o micro-frontend** (3 terminais):

```bash
cd microfrontend/contas && npm start      # :8081
cd microfrontend/transacoes && npm start  # :8082
cd microfrontend/host && npm start        # :8080
```

**5. Acessar:** [http://localhost:8080](http://localhost:8080)

## Testes

```bash
cd microservice-contas && npm test
cd microservice-transacoes && npm test
```
