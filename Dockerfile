# Estágio 1: Build do Frontend
FROM node:18 as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Estágio 2: Servidor de produção
FROM node:18
WORKDIR /app

# Copia apenas os arquivos necessários
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Instala um servidor HTTP simples
RUN npm install -g http-server

# Porta que o Railway usa
EXPOSE $PORT

CMD ["sh", "-c", "http-server dist --port $PORT --proxy http://localhost:$PORT?"]