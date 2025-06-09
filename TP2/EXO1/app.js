const express = require('express');
const fs = require('fs');
const app = express();

// Middleware pour parser les données de formulaire
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Charger les tâches depuis le fichier
let tasks = [];
try {
    tasks = require('./tasks.json');
} catch (error) {
    console.error("Erreur de chargement du fichier tasks.json:", error.message);
    tasks = [];
}

// Fonction pour sauvegarder les tâches
function saveTasks() {
    fs.writeFileSync('./tasks.json', JSON.stringify(tasks, null, 2));
}

// API RESTful
// GET /tasks - Récupérer toutes les tâches
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// GET /tasks/:id - Récupérer une tâche spécifique
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
        return res.status(404).json({ error: "Tâche non trouvée" });
    }
    
    res.status(200).json(task);
});

// POST /tasks - Créer une nouvelle tâche
app.post('/tasks', (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ error: "Le titre est obligatoire" });
    }

    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        title: req.body.title,
        description: req.body.description || "",
        completed: req.body.completed || false
    };

    tasks.push(newTask);
    saveTasks();
    res.status(201).json(newTask);
});

// PUT /tasks/:id - Mettre à jour une tâche existante
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Tâche non trouvée" });
    }

    const updatedTask = {
        ...tasks[taskIndex],
        ...req.body,
        id
    };

    tasks[taskIndex] = updatedTask;
    saveTasks();
    res.status(200).json(updatedTask);
});

// DELETE /tasks/:id - Supprimer une tâche
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = tasks.length;
    
    tasks = tasks.filter(t => t.id !== id);
    
    if (tasks.length === initialLength) {
        return res.status(404).json({ error: "Tâche non trouvée" });
    }

    saveTasks();
    res.status(204).send();
});

// Interface utilisateur avec formulaire
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gestionnaire de Tâches</title>
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                background-color: #f8f9fa;
                color: #343a40;
                padding: 20px;
                max-width: 1200px;
                margin: 0 auto;
            }
            header {
                background: linear-gradient(135deg, #3498db, #2c3e50);
                color: white;
                padding: 2rem;
                border-radius: 10px;
                margin-bottom: 30px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                text-align: center;
            }
            h1 {
                font-size: 2.8rem;
                margin-bottom: 0.5rem;
            }
            .subtitle {
                font-size: 1.2rem;
                opacity: 0.9;
            }
            .container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 25px;
                margin-bottom: 40px;
            }
            @media (max-width: 768px) {
                .container {
                    grid-template-columns: 1fr;
                }
            }
            .card {
                background: white;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                padding: 25px;
                margin-bottom: 25px;
                transition: transform 0.3s ease;
            }
            .card:hover {
                transform: translateY(-5px);
            }
            h2 {
                color: #2c3e50;
                margin-bottom: 1.5rem;
                padding-bottom: 0.8rem;
                border-bottom: 3px solid #3498db;
            }
            .form-group {
                margin-bottom: 1.5rem;
            }
            label {
                display: block;
                margin-bottom: 0.7rem;
                font-weight: 600;
                color: #2c3e50;
            }
            input, textarea, select {
                width: 100%;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 1rem;
                transition: border 0.3s;
            }
            input:focus, textarea:focus {
                border-color: #3498db;
                outline: none;
                box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
            }
            .checkbox-group {
                display: flex;
                align-items: center;
            }
            .checkbox-group input {
                width: auto;
                margin-right: 10px;
                transform: scale(1.3);
            }
            .btn {
                display: inline-block;
                background: #3498db;
                color: white;
                border: none;
                padding: 14px 25px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1.1rem;
                font-weight: 600;
                transition: all 0.3s;
                text-decoration: none;
                text-align: center;
            }
            .btn:hover {
                background: #2980b9;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .btn-block {
                display: block;
                width: 100%;
                padding: 15px;
            }
            .btn-danger {
                background: #e74c3c;
            }
            .btn-danger:hover {
                background: #c0392b;
            }
            .btn-success {
                background: #2ecc71;
            }
            .btn-success:hover {
                background: #27ae60;
            }
            .task-list {
                list-style: none;
                padding: 0;
            }
            .task-item {
                background: white;
                border-left: 5px solid #3498db;
                margin-bottom: 15px;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 3px 8px rgba(0,0,0,0.08);
                position: relative;
                transition: all 0.3s;
            }
            .task-item:hover {
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .task-item.completed {
                border-left-color: #2ecc71;
                background-color: #f8fff9;
            }
            .task-item .title {
                font-weight: 700;
                font-size: 1.3rem;
                margin-bottom: 8px;
                color: #2c3e50;
            }
            .task-item .id {
                position: absolute;
                top: 15px;
                right: 15px;
                background: #f1f8ff;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
                color: #3498db;
            }
            .task-item .description {
                margin-bottom: 15px;
                color: #555;
                line-height: 1.5;
            }
            .task-item .status {
                display: inline-block;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
            }
            .task-item .pending {
                background: #ffeaa7;
                color: #d35400;
            }
            .task-item .completed-status {
                background: #d4efdf;
                color: #27ae60;
            }
            .task-actions {
                margin-top: 15px;
                display: flex;
                gap: 12px;
            }
            .stats {
                display: flex;
                justify-content: space-around;
                text-align: center;
                margin: 25px 0;
            }
            .stat-card {
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.08);
                flex: 1;
                margin: 0 10px;
            }
            .stat-number {
                font-size: 2.5rem;
                font-weight: 700;
                color: #3498db;
                margin: 10px 0;
            }
            .stat-label {
                font-size: 1.1rem;
                color: #7f8c8d;
            }
            .empty-state {
                text-align: center;
                padding: 40px 20px;
                color: #7f8c8d;
            }
            .empty-state h3 {
                font-size: 1.8rem;
                margin-bottom: 15px;
                color: #2c3e50;
            }
            .empty-state p {
                font-size: 1.1rem;
                margin-bottom: 25px;
            }
            footer {
                text-align: center;
                margin-top: 50px;
                color: #7f8c8d;
                padding: 25px;
                border-top: 1px solid #ecf0f1;
            }
            .api-info {
                background: #e3f2fd;
                border-radius: 10px;
                padding: 20px;
                margin: 30px 0;
            }
            .api-info h3 {
                color: #2c3e50;
                margin-bottom: 15px;
            }
            .endpoint {
                background: white;
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 12px;
                font-family: monospace;
                font-size: 1.05rem;
            }
        </style>
    </head>
    <body>
        <header>
            <h1>Gestionnaire de Tâches</h1>
            <p class="subtitle">Organisez votre travail efficacement</p>
        </header>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${tasks.length}</div>
                <div class="stat-label">Tâches totales</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${tasks.filter(t => t.completed).length}</div>
                <div class="stat-label">Tâches complétées</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${tasks.filter(t => !t.completed).length}</div>
                <div class="stat-label">Tâches en attente</div>
            </div>
        </div>

        <div class="container">
            <div>
                <div class="card">
                    <h2>Ajouter une nouvelle tâche</h2>
                    <form action="/tasks" method="POST">
                        <div class="form-group">
                            <label for="title">Titre*</label>
                            <input type="text" id="title" name="title" required placeholder="Que devez-vous faire ?">
                        </div>
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea id="description" name="description" rows="4" placeholder="Détails de la tâche..."></textarea>
                        </div>
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="completed" name="completed">
                                <label for="completed">Marquer comme complétée</label>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-success btn-block">Ajouter la tâche</button>
                    </form>
                </div>

                <div class="card">
                    <h2>Rechercher & Filtrer</h2>
                    <form action="/" method="GET">
                        <div class="form-group">
                            <label for="search">Rechercher</label>
                            <input type="text" id="search" name="search" placeholder="Rechercher par titre ou description..." value="${req.query.search || ''}">
                        </div>
                        <div class="form-group">
                            <label for="status">Statut</label>
                            <select id="status" name="status">
                                <option value="">Toutes les tâches</option>
                                <option value="completed" ${req.query.status === 'completed' ? 'selected' : ''}>Complétées</option>
                                <option value="pending" ${req.query.status === 'pending' ? 'selected' : ''}>En attente</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-block">Appliquer les filtres</button>
                            <a href="/" class="btn btn-danger btn-block" style="margin-top:10px">Réinitialiser</a>
                        </div>
                    </form>
                </div>
            </div>

            <div>
                <div class="card">
                    <h2>Vos Tâches</h2>
                    ${tasks.length === 0 ? `
                        <div class="empty-state">
                            <h3>Aucune tâche trouvée</h3>
                            <p>Commencez par ajouter votre première tâche</p>
                            <a href="/" class="btn">Ajouter une tâche</a>
                        </div>
                    ` : `
                    <ul class="task-list">
                        ${tasks
                            .filter(task => {
                                const search = req.query.search ? req.query.search.toLowerCase() : '';
                                const status = req.query.status || '';
                                
                                // Filtre de recherche
                                if (search && !(
                                    task.title.toLowerCase().includes(search) ||
                                    (task.description && task.description.toLowerCase().includes(search))
                                )) {
                                    return false;
                                }
                                
                                // Filtre par statut
                                if (status === 'completed' && !task.completed) return false;
                                if (status === 'pending' && task.completed) return false;
                                
                                return true;
                            })
                            .map(task => `
                            <li class="task-item ${task.completed ? 'completed' : ''}">
                                <span class="id">#${task.id}</span>
                                <div class="title">${task.title}</div>
                                ${task.description ? `<div class="description">${task.description}</div>` : ''}
                                <div class="status ${task.completed ? 'completed-status' : 'pending'}">
                                    ${task.completed ? 'Complétée ✓' : 'En attente'}
                                </div>
                                <div class="task-actions">
                                    <a href="/tasks/delete/${task.id}" class="btn btn-danger" onclick="return confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')">Supprimer</a>
                                    <a href="/tasks/edit/${task.id}" class="btn">Modifier</a>
                                </div>
                            </li>
                            `).join('')}
                    </ul>
                    `}
                </div>
            </div>
        </div>

        <div class="api-info">
            <h3>API RESTful Endpoints</h3>
            <div class="endpoint">GET    /tasks          - Liste toutes les tâches</div>
            <div class="endpoint">GET    /tasks/:id      - Obtenir une tâche spécifique</div>
            <div class="endpoint">POST   /tasks          - Créer une nouvelle tâche</div>
            <div class="endpoint">PUT    /tasks/:id      - Mettre à jour une tâche</div>
            <div class="endpoint">DELETE /tasks/:id      - Supprimer une tâche</div>
        </div>

        <footer>
            <p>Gestionnaire de tâches &copy; ${new Date().getFullYear()} - Tous droits réservés</p>
            <p>${tasks.filter(t => t.completed).length} tâches complétées sur ${tasks.length}</p>
        </footer>

        <script>
            // Confirmation avant suppression
            document.querySelectorAll('.btn-danger').forEach(button => {
                button.addEventListener('click', (e) => {
                    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
                        e.preventDefault();
                    }
                });
            });
        </script>
    </body>
    </html>
    `;
    
    res.send(html);
});

// Routes pour l'interface utilisateur
app.get('/tasks/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
        return res.redirect('/');
    }

    const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Modifier Tâche #${task.id}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f8f9fa;
                color: #343a40;
                padding: 20px;
                max-width: 600px;
                margin: 0 auto;
            }
            .card {
                background: white;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                padding: 30px;
                margin: 50px 0;
            }
            h1 {
                color: #2c3e50;
                margin-bottom: 1.5rem;
                text-align: center;
                padding-bottom: 1rem;
                border-bottom: 3px solid #3498db;
            }
            .form-group {
                margin-bottom: 1.5rem;
            }
            label {
                display: block;
                margin-bottom: 0.7rem;
                font-weight: 600;
                color: #2c3e50;
            }
            input, textarea {
                width: 100%;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 1rem;
            }
            .checkbox-group {
                display: flex;
                align-items: center;
            }
            .checkbox-group input {
                width: auto;
                margin-right: 10px;
                transform: scale(1.3);
            }
            .btn {
                display: inline-block;
                background: #3498db;
                color: white;
                border: none;
                padding: 14px 25px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1.1rem;
                font-weight: 600;
                transition: all 0.3s;
                text-decoration: none;
                text-align: center;
            }
            .btn:hover {
                background: #2980b9;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .btn-block {
                display: block;
                width: 100%;
                padding: 15px;
            }
            .btn-danger {
                background: #e74c3c;
            }
            .btn-danger:hover {
                background: #c0392b;
            }
            .action-buttons {
                display: flex;
                gap: 15px;
                margin-top: 25px;
            }
            .task-id {
                text-align: center;
                margin-bottom: 20px;
                font-size: 1.2rem;
                color: #7f8c8d;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>Modifier la Tâche</h1>
            <div class="task-id">ID: #${task.id}</div>
            <form action="/tasks/${task.id}" method="POST" id="editForm">
                <input type="hidden" name="_method" value="PUT">
                <div class="form-group">
                    <label for="title">Titre*</label>
                    <input type="text" id="title" name="title" value="${task.title}" required>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="4">${task.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <div class="checkbox-group">
                        <input type="checkbox" id="completed" name="completed" ${task.completed ? 'checked' : ''}>
                        <label for="completed">Tâche complétée</label>
                    </div>
                </div>
                <div class="action-buttons">
                    <button type="submit" class="btn">Enregistrer</button>
                    <a href="/" class="btn btn-danger">Annuler</a>
                </div>
            </form>
        </div>
    </body>
    </html>
    `;
    
    res.send(html);
});

// Gestion de la méthode PUT via POST
app.post('/tasks/:id', (req, res) => {
    // Simuler une requête PUT
    req.method = 'PUT';
    app.handle(req, res);
});

// Route pour la suppression via l'interface
app.get('/tasks/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = tasks.length;
    
    tasks = tasks.filter(t => t.id !== id);
    
    if (tasks.length === initialLength) {
        return res.status(404).send('Tâche non trouvée');
    }

    saveTasks();
    res.redirect('/');
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Accédez à l'interface: http://localhost:${PORT}`);
});