FROM node:18-alpine

WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (para aproveitar o cache do Docker)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código fonte
COPY . .

# Expõe a porta que o Express vai usar
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "dev"]
