const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;

// Format personnalisé avec metadata
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let log = `${timestamp} [${level.toUpperCase()}] ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    log += ` | ${JSON.stringify(metadata)}`;
  }
  return log;
});

// Configuration des transports
const transports = [
  new winston.transports.Console({
    level: 'debug',
    format: combine(
      colorize(),
      logFormat
    )
  }),
  new winston.transports.File({ 
    filename: 'logs/app.log', 
    level: 'info',
    maxsize: 1024,
    //maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 3
  })
];

// Création du logger principal
const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports,
});

module.exports = logger;