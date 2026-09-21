FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

# -H 0.0.0.0 es necesario para que el servidor de desarrollo de Next.js acepte
# conexiones que llegan desde fuera del contenedor (el navegador del host).
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
