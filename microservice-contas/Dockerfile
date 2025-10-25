# Estágio 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Estágio 2: Produção
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./


EXPOSE 3000
CMD ["node", "index.js"]