# # Fase de Build
# FROM node:lts-alpine3.17 as builder

# RUN apk add --no-cache openssl libstdc++ bash libc6-compat

# WORKDIR /app/frontend

# COPY package.json pnpm-lock.yaml ./  
# RUN npm install -g pnpm && pnpm install

# RUN corepack enable && pnpm install --frozen-lockfile

# COPY . .

# RUN pnpm prisma generate

# CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm run dev"]


# # RUN pnpm run build

# # RUN pnpm prune --production

# # # Fase de Execução
# # FROM node:lts-alpine3.17 as runner

# # WORKDIR /app/frontend

# # RUN corepack enable

# # # Copiar arquivos necessários para rodar a aplicação
# # COPY --from=builder /app/frontend/package.json ./ 
# # COPY --from=builder /app/frontend/pnpm-lock.yaml ./ 
# # COPY --from=builder /app/frontend/node_modules ./node_modules 
# # COPY --from=builder /app/frontend/.next ./.next 
# # COPY --from=builder /app/frontend/next.config.mjs ./ 
# # COPY --from=builder /app/frontend/next.config.mjs ./ 
# # COPY --from=builder /app/frontend/prisma ./prisma 

# # EXPOSE 3030

# # CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm run dev"]