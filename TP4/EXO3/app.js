const express = require('express');
const app = express();
const port = 3000;

// Données de démonstration
const books = [
  { id: 1, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", year: 1943 },
  { id: 2, title: "1984", author: "George Orwell", year: 1949 },
  { id: 3, title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien", year: 1954 }
];

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Accept: ${req.get('Accept')}`);
  next();
});

// Route principale
app.get('/', (req, res) => {
  res.format({
    'text/html': () => {
      res.send(`
        <h1>API de livres</h1>
        <p>Endpoints disponibles:</p>
        <ul>
          <li><a href="/books">/books</a> - Liste des livres</li>
          <li><a href="/books/1">/books/:id</a> - Détail d'un livre</li>
        </ul>
        <p>Utilisez les en-têtes Accept pour changer le format:</p>
        <ul>
          <li>application/json</li>
          <li>application/xml</li>
          <li>text/html</li>
        </ul>
      `);
    },
    'application/json': () => {
      res.json({ 
        message: "API de livres",
        endpoints: ["/books", "/books/:id"] 
      });
    },
    'application/xml': () => {
      const xml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <api>
          <message>API de livres</message>
          <endpoints>
            <endpoint>/books</endpoint>
            <endpoint>/books/:id</endpoint>
          </endpoints>
        </api>
      `;
      res.type('application/xml').send(xml);
    },
    default: () => {
      res.status(406).send('Format non supporté');
    }
  });
});

// Liste des livres
app.get('/books', (req, res) => {
  res.format({
    'application/json': () => {
      res.json(books);
    },
    'application/xml': () => {
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<books>`;
      
      books.forEach(book => {
        xml += `
          <book>
            <id>${book.id}</id>
            <title>${book.title}</title>
            <author>${book.author}</author>
            <year>${book.year}</year>
          </book>
        `;
      });
      
      xml += `</books>`;
      res.type('application/xml').send(xml);
    },
    'text/html': () => {
      res.sendFile(__dirname + '/views/books.html');
    },
    default: () => {
      res.status(406).send('Format non supporté');
    }
  });
});

// Détail d'un livre
app.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  
  if (!book) {
    return res.format({
      'application/json': () => res.status(404).json({ error: "Livre non trouvé" }),
      'application/xml': () => {
        const xml = `
          <?xml version="1.0" encoding="UTF-8"?>
          <error>Livre non trouvé</error>
        `;
        res.type('application/xml').status(404).send(xml);
      },
      'text/html': () => res.status(404).send('<h1>Livre non trouvé</h1>'),
      default: () => res.status(406).send('Format non supporté')
    });
  }
  
  res.format({
    'application/json': () => {
      res.json(book);
    },
    'application/xml': () => {
      const xml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <book>
          <id>${book.id}</id>
          <title>${book.title}</title>
          <author>${book.author}</author>
          <year>${book.year}</year>
        </book>
      `;
      res.type('application/xml').send(xml);
    },
    'text/html': () => {
      res.send(`
        <h1>${book.title}</h1>
        <p><strong>Auteur:</strong> ${book.author}</p>
        <p><strong>Année:</strong> ${book.year}</p>
        <a href="/books">Retour à la liste</a>
      `);
    },
    default: () => {
      res.status(406).send('Format non supporté');
    }
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
  
});