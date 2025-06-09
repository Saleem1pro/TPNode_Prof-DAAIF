const fs = require('fs');

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

function savePosts() {
  fs.writeFileSync('./posts.json', JSON.stringify(posts, null, 2));
}

module.exports = {
  posts,
  savePosts
};