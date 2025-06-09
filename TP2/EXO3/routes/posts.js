const express = require('express');
const router = express.Router();
const { posts } = require('../data/posts');

// GET /posts/:year/:month? - Articles par année/mois
router.get('/:year/:month?', (req, res) => {
  const year = parseInt(req.params.year);
  const month = req.params.month ? parseInt(req.params.month) : null;

  if (isNaN(year) || (month && (month < 1 || month > 12))) {
    return res.status(400).json({
      error: "Paramètres invalides",
      message: "L'année doit être un nombre et le mois entre 1 et 12"
    });
  }

  const filteredPosts = posts.filter(post => {
    const postDate = new Date(post.date);
    const postYear = postDate.getFullYear();
    const postMonth = postDate.getMonth() + 1;
    
    return month 
      ? (postYear === year && postMonth === month)
      : (postYear === year);
  });

  res.json({
    year,
    month: month || "tous les mois",
    count: filteredPosts.length,
    posts: filteredPosts.map(post => ({
      id: post.id,
      title: post.title,
      date: post.date,
      categories: post.categories
    }))
  });
});

module.exports = router;