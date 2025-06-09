const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routeurs
const postsRouter = require('./routes/posts');
const categoriesRouter = require('./routes/categories');

// Routes principales
app.use('/posts', postsRouter);
app.use('/categories', categoriesRouter);

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: "API Blog - Bienvenue!",
    endpoints: {
      posts: "/posts/:year/:month?",
      categories: "/categories",
      categoryPosts: "/categories/:categoryName/posts"
    }
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint non trouvé" });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Endpoints:`);
  console.log(`- http://localhost:${PORT}/posts/:year/:month?`);
  console.log(`- http://localhost:${PORT}/categories`);
  console.log(`- http://localhost:${PORT}/categories/:categoryName/posts`);
});