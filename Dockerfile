FROM node:22 as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build


FROM node:22

WORKDIR /app
COPY package*.json ./

RUN npm ci --production

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]