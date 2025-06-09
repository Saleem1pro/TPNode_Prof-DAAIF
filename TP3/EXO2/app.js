const express = require('express');
const app = express();
const cors = require('./middleware/cors');
const authenticate = require('./middleware/auth');

// Middleware CORS
app.use(cors);

// Middleware pour parser le JSON
app.use(express.json());

// Route publique (pas d'authentification)
app.get('/public', (req, res) => {
    res.json({
        message: "Ceci est une ressource publique",
        access: "Libre d'accès"
    });
});

// Route privée (nécessite authentification)
app.get('/private', authenticate, (req, res) => {
    res.json({
        message: "Ceci est une ressource privée",
        access: "Protégée par token",
        secretData: "🕵️‍♂️ Données sensibles ici..."
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint non trouvé" });
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log('Routes:');
    console.log(`- GET http://localhost:${PORT}/public (no auth)`);
    console.log(`- GET http://localhost:${PORT}/private (requires 'Authorization: Bearer secret-token')`);
});