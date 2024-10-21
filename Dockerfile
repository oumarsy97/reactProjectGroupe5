# Utiliser une image Node.js officielle comme base
FROM node:16-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application pour la production
RUN npm run build

# Spécifier la commande par défaut pour démarrer l'application (sur Render, c'est Render qui va gérer le serveur)
CMD ["npm", "run", "start"]