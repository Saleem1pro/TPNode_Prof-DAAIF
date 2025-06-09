const express = require('express');
const app = express();
const fs = require('fs');

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Base de données des articles (normalement chargée depuis un fichier)
const posts = [
  {
    id: 1,
    title: "Introduction à Node.js",
    content: "Node.js est un environnement d'exécution JavaScript...",
    date: "2023-03-15",
    categories: ["programmation", "javascript"]
  },
  {
    id: 2,
    title: "Les bases d'Express",
    content: "Express est un framework web pour Node.js...",
    date: "2023-04-02",
    categories: ["programmation", "backend"]
  },
  {
    id: 3,
    title: "Nouvelles tendances en IA",
    content: "L'intelligence artificielle évolue rapidement...",
    date: "2023-04-18",
    categories: ["technologie", "IA"]
  },
  {
    id: 4,
    title: "Guide complet de React",
    content: "React est une bibliothèque JavaScript pour créer des UIs...",
    date: "2022-11-30",
    categories: ["frontend", "javascript"]
  },
  {
    id: 5,
    title: "Les meilleures pratiques REST",
    content: "Concevoir des APIs RESTful efficaces...",
    date: "2022-12-10",
    categories: ["programmation", "backend"]
  },
  {
    id: 6,
    title: "L'avenir du Web 3.0",
    content: "Le Web décentralisé est la prochaine évolution...",
    date: "2023-05-22",
    categories: ["technologie", "blockchain"]
  }
];

// Fonction pour sauvegarder les articles (si modification)
function savePosts() {
  fs.writeFileSync('./posts.json', JSON.stringify(posts, null, 2));
}

// Route 1: GET /posts/:year/:month? - Récupérer les articles par année/mois
app.get('/posts/:year/:month?', (req, res) => {
  const year = parseInt(req.params.year);
  const month = req.params.month ? parseInt(req.params.month) : null;

  // Validation des paramètres
  if (isNaN(year) || (month && (month < 1 || month > 12))) {
    return res.status(400).json({
      error: "Paramètres invalides",
      message: "L'année doit être un nombre et le mois entre 1 et 12"
    });
  }

  // Filtrer les articles
  const filteredPosts = posts.filter(post => {
    const postDate = new Date(post.date);
    const postYear = postDate.getFullYear();
    const postMonth = postDate.getMonth() + 1; // Les mois commencent à 0
    
    if (month) {
      return postYear === year && postMonth === month;
    }
    return postYear === year;
  });

  // Formatage de la réponse
  const response = {
    year: year,
    month: month || "tous les mois",
    count: filteredPosts.length,
    posts: filteredPosts.map(post => ({
      id: post.id,
      title: post.title,
      date: post.date,
      categories: post.categories
    }))
  };

  res.json(response);
});

// Route 2: GET /categories/:categoryName/posts - Articles par catégorie
app.get('/categories/:categoryName/posts', (req, res) => {
  const categoryName = req.params.categoryName.toLowerCase();
  
  // Trouver les articles de la catégorie
  const categoryPosts = posts.filter(post => 
    post.categories.map(c => c.toLowerCase()).includes(categoryName)
  );

  if (categoryPosts.length === 0) {
    return res.status(404).json({
      error: "Catégorie non trouvée",
      message: `Aucun article trouvé pour la catégorie "${categoryName}"`,
      availableCategories: [...new Set(posts.flatMap(p => p.categories))]
    });
  }

  // Formatage de la réponse
  const response = {
    category: categoryName,
    count: categoryPosts.length,
    posts: categoryPosts.map(post => ({
      id: post.id,
      title: post.title,
      date: post.date
    }))
  };

  res.json(response);
});

// Route pour lister toutes les catégories disponibles
app.get('/categories', (req, res) => {
  const categories = [...new Set(posts.flatMap(post => post.categories))];
  res.json({
    count: categories.length,
    categories: categories.sort()
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur de blog démarré sur le port ${PORT}`);
  console.log(`Endpoints disponibles:`);
  console.log(`- GET http://localhost:${PORT}/posts/:year/:month?`);
  console.log(`- GET http://localhost:${PORT}/categories/:categoryName/posts`);
  console.log(`- GET http://localhost:${PORT}/categories`);
});