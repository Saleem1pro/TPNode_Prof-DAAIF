// Middleware CORS basique
const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Autoriser toutes les origines
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Répondre immédiatement aux requêtes OPTIONS
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
};

module.exports = corsMiddleware;