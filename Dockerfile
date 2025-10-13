FROM node:lts-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Accept secret key as build argument (set via deployment platform)
ARG AGENT_SECRET_KEY
ENV AGENT_SECRET_KEY=${AGENT_SECRET_KEY}
ENV ENVIRONMENT=MAINNET
ENV USE_STREAMABLE_HTTP=true
ENV PORT=3000
ENV HOST=127.0.0.1

COPY package*.json ./
COPY tsconfig.json ./

RUN pnpm install --ignore-scripts

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["node", "./dist/index.js"]
