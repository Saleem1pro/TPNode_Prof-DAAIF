# Exo1 : Serveur Express basique

## 📸 Capture d'écran  
![Description de l'image](./images/capture-exo1.png)  

## 📝 Description  
Cet exercice consiste à créer un serveur Express qui répond à la route `/` avec un message "Hello World".  

## 🛠️ Code  
```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});