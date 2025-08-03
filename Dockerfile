# -------- Etapa 1: Builder (compila el proyecto) --------
FROM node:22-alpine AS builder

WORKDIR /app

# 1. Copiar archivos de dependencias
COPY package.json package-lock.json ./

# 2. Instalar dependencias en modo limpio
RUN npm ci

# 3. Copiar el resto del proyecto y construir
COPY . .
RUN npm run build

# -------- Etapa 2: Runner (imagen final de producción) --------
FROM node:22-alpine AS runner

WORKDIR /app

# 1. Copiar solo lo necesario para producción
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 2. Definir entorno y puerto
ENV NODE_ENV=production
EXPOSE 3000

# 3. Comando que inicia la app Next.js
CMD ["npm", "start"]
