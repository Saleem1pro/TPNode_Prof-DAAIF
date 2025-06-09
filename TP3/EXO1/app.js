const express = require('express');
const requestLogger = require('./middleware/requestLogger');
const app = express();

// Middleware de logging personnalisé
app.use(requestLogger({
    logDirectory: './logs',
    logFileName: 'app.log',
    logFormat: '[:timestamp] :ip - ":method :url"'
}));

// Route de test
app.get('/', (req, res) => {
    res.send('Bonjour le monde!');
});

// Route avec paramètre
app.get('/posts/:id', (req, res) => {
    res.json({ postId: req.params.id });
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log('Testez les routes:');
    console.log(`- curl http://localhost:${PORT}`);
    console.log(`- curl http://localhost:${PORT}/posts/123`);
});