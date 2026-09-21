FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Prisma necesita un DATABASE_URL válido (aunque no exista aún) para generar el
# cliente en tiempo de build. El valor real se inyecta en runtime vía docker-compose.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate

EXPOSE 3000

# Al arrancar el contenedor: aplica migraciones pendientes, siembra datos si la
# tabla está vacía (el seed es idempotente), y recién ahí levanta la API.
CMD ["sh", "-c", "npx prisma migrate deploy && (npm run db:seed || true) && npm run start:dev"]
