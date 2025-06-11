const logger = require('../logger1');

module.exports = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info(`${req.method} ${req.originalUrl}`, {
      ip: req.ip,
      status: res.statusCode,
      duration: `${duration}ms`,
      user: req.user ? req.user.id : 'anonymous'
    });
  });
  
  next();
};