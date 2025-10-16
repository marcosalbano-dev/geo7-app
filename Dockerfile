###############################################
# Stage 1: Build Angular app inside the image #
###############################################
FROM node:20-alpine AS builder
WORKDIR /app

# Instala dependências primeiro para melhor cache
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copia o restante do código e realiza o build (produção por padrão)
COPY . .
RUN npm run build

###############################################
# Stage 2: Runtime com Nginx                  #
###############################################
FROM nginx:1.27-alpine

# instala curl pro healthcheck
RUN apk add --no-cache curl

# remove default e aplica a nossa
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build gerado no stage anterior
COPY --from=builder /app/dist/geo7-app/browser/ /usr/share/nginx/html

# healthcheck estável
HEALTHCHECK --interval=20s --timeout=3s --retries=5 CMD curl -fsS http://localhost/ || exit 1

# (opcional) comando explícito
CMD ["nginx", "-g", "daemon off;"]

