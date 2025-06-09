// Middleware de vérification de token
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Vérifier si le header Authorization est présent
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Accès non autorisé',
            message: 'Token manquant ou format invalide. Utilisez: Bearer <token>'
        });
    }

    // Extraire le token
    const token = authHeader.split(' ')[1];
    
    // Vérifier le token (dans un vrai projet, on utiliserait JWT ou une DB)
    const validToken = "secret-token"; // Token valide pour l'exemple
    
    if (token !== validToken) {
        return res.status(403).json({
            error: 'Accès refusé',
            message: 'Token invalide ou expiré'
        });
    }

    // Token valide - passer à la suite
    next();
};

module.exports = authenticate;