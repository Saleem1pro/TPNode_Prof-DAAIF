const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware pour parser les données du formulaire
app.use(express.urlencoded({ extended: true }));

// Route pour afficher le formulaire
app.get('/inscription', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

// Traitement de la soumission du formulaire
app.post('/inscription', (req, res) => {
    const { nom, email, password } = req.body;
    
    // Validation simple
    if (!nom || !email || !password) {
        return res.status(400).send('Tous les champs sont obligatoires');
    }
    
    // Validation email basique
    if (!email.includes('@')) {
        return res.status(400).send('Email invalide');
    }
    
    // Confirmation réussie
    res.send(`
        <h1>Inscription réussie !</h1>
        <p>Nom: ${nom}</p>
        <p>Email: ${email}</p>
    `);
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});