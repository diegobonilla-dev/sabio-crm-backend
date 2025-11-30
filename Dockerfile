# backend/Dockerfile
FROM node:20-alpine AS base

# Instalar dependencias solo cuando sea necesario
FROM base AS deps
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci --only=production

# Imagen final
FROM base AS runner
WORKDIR /app

# Establecer ambiente de producción
ENV NODE_ENV=production

# Copiar dependencias
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY src ./src
COPY package.json ./

# Exponer puerto
EXPOSE 4000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicio
CMD ["npm", "start"]
