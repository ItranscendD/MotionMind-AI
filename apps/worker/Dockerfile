FROM node:20-slim AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/worker/package.json ./apps/worker/
RUN pnpm install --filter @motionmind/worker...
COPY apps/worker ./apps/worker
RUN pnpm --filter @motionmind/worker build

FROM node:20-slim
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/apps/worker/dist ./dist
COPY --from=builder /app/apps/worker/package.json ./package.json
RUN pnpm install --prod --filter @motionmind/worker
CMD ["node", "dist/index.js"]
