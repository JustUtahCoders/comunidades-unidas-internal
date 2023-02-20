FROM node:18.14.1
ENV NODE_ENV=production
ENV PORT=8080
RUN apt-get update
RUN npm install -g pnpm
RUN mkdir /app
WORKDIR /app
COPY backend backend
COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml
RUN npm pkg delete scripts.prepare
RUN pnpm install --production
EXPOSE 8080
ENTRYPOINT pnpm start