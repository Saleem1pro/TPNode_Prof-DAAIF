const express = require('express');
const router = express.Router();
const { posts } = require('../data/posts');

// GET /categories - Liste des catégories
router.get('/', (req, res) => {
  const categories = [...new Set(posts.flatMap(post => post.categories))];
  res.json({
    count: categories.length,
    categories: categories.sort()
  });
});

// GET /categories/:categoryName/posts - Articles par catégorie
router.get('/:categoryName/posts', (req, res) => {
  const categoryName = req.params.categoryName.toLowerCase();
  const categoryPosts = posts.filter(post => 
    post.categories.map(c => c.toLowerCase()).includes(categoryName)
  );

  if (categoryPosts.length === 0) {
    return res.status(404).json({
      error: "Catégorie non trouvée",
      message: `Aucun article trouvé pour "${categoryName}"`,
      availableCategories: [...new Set(posts.flatMap(p => p.categories))]
    });
  }

  res.json({
    category: categoryName,
    count: categoryPosts.length,
    posts: categoryPosts.map(post => ({
      id: post.id,
      title: post.title,
      date: post.date
    }))
  });
});

module.exports = router;