const express = require('express');
const errorHandler = require('./errors/errorHandler');
const AppError = require('./errors/AppError');
const path = require('path');

const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes de démonstration
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Démonstration des codes HTTP</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <div class="container">
        <h1>Middleware de gestion d'erreurs</h1>
        <p>Cette application démontre un middleware de gestion d'erreurs centralisé avec visualisation des codes HTTP.</p>
        
        <div class="actions">
          <a href="/status-codes" class="btn">Voir les codes HTTP</a>
          <a href="/success" class="btn success">Tester 200</a>
          <a href="/created" class="btn success">Tester 201</a>
          <a href="/validate" class="btn warning">Tester 400</a>
          <a href="/protected" class="btn warning">Tester 401</a>
          <a href="/crash" class="btn danger">Tester 500</a>
          <a href="/not-found" class="btn danger">Tester 404</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Routes de test
app.get('/success', (req, res) => {
  res.status(200).json({ message: 'Opération réussie!' });
});

app.get('/created', (req, res) => {
  res.status(201).json({ message: 'Ressource créée avec succès' });
});

// Route qui génère une erreur de validation
app.post('/validate', (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return next(new AppError('Email est requis', 400, 'validation'));
  }
  
  if (!/\S+@\S+\.\S+/.test(email)) {
    return next(new AppError('Format email invalide', 400, 'validation'));
  }
  
  res.send({ message: 'Email valide' });
});

// Route qui nécessite une authentification
app.get('/protected', (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return next(new AppError('Accès non autorisé', 401, 'authentication'));
  }
  
  // Vérification fictive du token
  if (token !== 'Bearer valid-token') {
    return next(new AppError('Token invalide', 403, 'authentication'));
  }
  
  res.send({ message: 'Accès autorisé' });
});

// Route qui génère une erreur interne
app.get('/crash', (req, res, next) => {
  // Simuler une erreur inattendue
  const data = null;
  try {
    data.doSomething();
  } catch (err) {
    next(new AppError('Erreur inattendue du serveur', 500, 'internal'));
  }
});

// Route pour afficher les codes HTTP
app.get('/status-codes', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'status-codes.html'));
});

// Route qui génère une erreur 404
app.use((req, res, next) => {
  next(new AppError('Ressource non trouvée', 404, 'not-found'));
});

// Middleware de gestion d'erreurs centralisé
app.use(errorHandler);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
  console.log('Endpoints:');
  console.log(`GET  /             - Page d'accueil`);
  console.log(`GET  /status-codes - Page des codes HTTP`);
  console.log(`GET  /success      - Réponse 200`);
  console.log(`GET  /created      - Réponse 201`);
  console.log(`POST /validate     - Validation d'email (ex: {"email": "test@example.com"})`);
  console.log(`GET  /protected    - Route protégée (ajouter header: Authorization: Bearer valid-token)`);
  console.log(`GET  /crash        - Génère une erreur 500`);
  console.log(`GET  /not-found    - Génère une erreur 404`);
});