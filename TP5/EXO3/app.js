const express = require('express');
const logger = require('./logger1');
const logMiddleware = require('./middleware/logger2');

const app = express();

// Middleware pour les logs contextuels
app.use(logMiddleware);

// Exemple de route
app.get('/', (req, res) => {
  logger.debug('Accès à la racine');
  res.send('Hello World!');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  logger.error('Erreur serveur', {
    error: err.message,
    stack: err.stack,
    path: req.originalUrl
  });
  
  res.status(500).send('Erreur interne');
});

// Démarrage du serveur
app.listen(3000, () => {
  logger.info('Serveur démarré sur http://localhost:3000');
});