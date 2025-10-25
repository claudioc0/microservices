# ----- Estágio 1: "Builder" -----
# Usamos uma imagem node para instalar as dependências
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./

# Instala SOMENTE as dependências de produção
RUN npm install --omit=dev


# ----- Estágio 2: "Produção" -----
# Começamos uma imagem nova e limpa
FROM node:18-alpine
WORKDIR /app

# Copia as dependências já instaladas do estágio "builder"
COPY --from=builder /app/node_modules ./node_modules

# Copia os arquivos da aplicação
COPY package*.json ./
COPY index.js ./
COPY swagger.yaml ./ 

# Expõe a porta que o BFF usa (3000)
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "index.js"]