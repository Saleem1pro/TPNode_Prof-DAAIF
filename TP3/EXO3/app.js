const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const app = express();

// Créer le dossier logs s'il n'existe pas
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 1. Middleware de logging (morgan) vers un fichier
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'access.log'), 
  { flags: 'a' } // 'a' pour append (ajouter à la fin)
);

app.use(morgan('combined', { stream: accessLogStream }));

// 2. Middleware CORS
app.use(cors());

// 3. Middleware de compression
app.use(compression());

// 4. Middleware pour parser les requêtes JSON
app.use(express.json());

// Route de test avec réponse compressée
app.get('/', (req, res) => {
  const largeData = Array(1000).fill({
    message: "Ceci est une réponse compressée",
    timestamp: new Date().toISOString(),
    logInfo: "Cette requête est enregistrée dans logs/access.log"
  });
  res.json(largeData);
});

// Route publique simple
app.get('/public', (req, res) => {
  res.send('Ressource publique - loggé dans access.log');
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log('Middleware installés: morgan (fichier), cors, compression');
  console.log('Tous les logs sont enregistrés dans logs/access.log');
  console.log('Testez avec:');
  console.log(`curl http://localhost:${PORT}`);
  console.log(`curl http://localhost:${PORT}/public`);
});