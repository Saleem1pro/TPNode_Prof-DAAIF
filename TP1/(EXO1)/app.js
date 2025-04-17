const express = require('express');
const app = express();
const port = 3000;

// Définition d'une route pour la méthode GET sur le chemin "/"
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/date', (req, res) => {
    const date = new Date();
    res.send(date);
  });
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});