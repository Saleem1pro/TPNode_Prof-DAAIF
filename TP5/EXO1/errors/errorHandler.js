const AppError = require('./AppError');
const logger = require('./logger');
const fs = require('fs');
const path = require('path');

function errorHandler(err, req, res, next) {
  // Journalisation des erreurs
  logger(err, req);
  
  // Gestion des erreurs non reconnues
  if (!(err instanceof AppError)) {
    err = new AppError(
      err.message || 'Erreur inattendue du serveur',
      err.statusCode || 500,
      'internal'
    );
  }
  
  // Formatage de la réponse d'erreur
  const errorResponse = {
    error: {
      type: err.errorType,
      message: err.message,
      status: err.statusCode,
      timestamp: err.timestamp
    }
  };
  
  // Ajouter des détails supplémentaires en développement
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
    if (err.details) {
      errorResponse.error.details = err.details;
    }
  }
  
  // Gestion de la réponse HTML
  if (req.accepts('html')) {
    try {
      // Lire le template d'erreur
      const errorTemplatePath = path.join(__dirname, '../views/error.html');
      let html = fs.readFileSync(errorTemplatePath, 'utf8');
      
      // Remplacer les variables dans le template
      html = html
        .replace(/<%= error\.status %>/g, err.statusCode)
        .replace(/<%= error\.message %>/g, err.message)
        .replace(/<%= error\.stack %>/g, err.stack);
      
      res.status(err.statusCode).send(html);
    } catch (e) {
      // En cas d'erreur avec le template, envoyer une réponse simple
      res.status(err.statusCode).send(`
        <h1>${err.statusCode} - ${err.message}</h1>
        <p>Une erreur s'est produite</p>
        <a href="/">Retour à l'accueil</a>
      `);
    }
  } else {
    res.status(err.statusCode).json(errorResponse);
  }
}

module.exports = errorHandler;