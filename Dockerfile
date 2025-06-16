# Use Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Alleen dependency bestanden kopiëren (Docker caching!)
COPY package*.json ./

# Dependencies installeren
RUN npm install

# Prisma CLI nodig vóór je `generate` draait
RUN npm install -g prisma

# De rest van de app kopiëren
COPY . .

# Prisma client genereren
RUN npx prisma generate

# Poort openen
EXPOSE 3000

# Start server met nodemon of direct met node (dev/prod)
CMD ["npm", "run", "dev"]
