const fs = require('fs');
const path = require('path');

module.exports = function requestLogger(options = {}) {
    // Configuration avec valeurs par défaut
    const config = {
        logDirectory: options.logDirectory || path.join(__dirname, '../logs'),
        logFileName: options.logFileName || 'access.log',
        logFormat: options.logFormat || ':timestamp :method :url :ip',
        dateFormat: options.dateFormat || 'yyyy-MM-dd HH:mm:ss'
    };

    // Créer le répertoire de logs si inexistant
    if (!fs.existsSync(config.logDirectory)) {
        fs.mkdirSync(config.logDirectory, { recursive: true });
    }

    return (req, res, next) => {
        const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        const logData = {
            timestamp,
            method: req.method,
            url: req.originalUrl,
            ip: req.ip || req.connection.remoteAddress
        };

        // Formater le message de log
        const logMessage = config.logFormat
            .replace(':timestamp', logData.timestamp)
            .replace(':method', logData.method)
            .replace(':url', logData.url)
            .replace(':ip', logData.ip);

        // Chemin complet du fichier de log
        const logFilePath = path.join(config.logDirectory, config.logFileName);
        
        // Écrire dans le fichier (asynchrone)
        fs.appendFile(logFilePath, logMessage + '\n', (err) => {
            if (err) console.error('Erreur de journalisation:', err);
        });

        // Afficher dans la console
        console.log(logMessage);

        next();
    };
};