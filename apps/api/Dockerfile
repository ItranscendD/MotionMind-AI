FROM node:20-slim AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --filter @motionmind/api...
COPY apps/api ./apps/api
RUN pnpm --filter @motionmind/api build

FROM node:20-slim
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/prisma ./prisma
RUN pnpm install --prod --filter @motionmind/api
EXPOSE 3001
CMD ["node", "dist/index.js"]
