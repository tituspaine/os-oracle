FROM node:22-alpine

WORKDIR /app
COPY package.json ./
COPY src ./src
COPY scripts ./scripts

RUN npm install --omit=dev
RUN npm run build

ENTRYPOINT ["node", "dist/cli.js"]
CMD ["tui"]
