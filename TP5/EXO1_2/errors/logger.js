const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({ 
      filename: path.join(__dirname, 'logs', 'error.log'),
      level: 'error' 
    }),
    new transports.File({ 
      filename: path.join(__dirname, 'logs', 'combined.log') 
    })
  ]
});

if (process.env.NODE_ENV === 'development') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = (err, req) => {
  const meta = {
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent')
  };
  
  if (err.statusCode >= 500) {
    logger.error(err.message, { 
      ...meta, 
      stack: err.stack,
      type: err.errorType
    });
  } else if (err.statusCode >= 400) {
    logger.warn(err.message, { 
      ...meta,
      type: err.errorType
    });
  } else {
    logger.info(err.message, meta);
  }
};