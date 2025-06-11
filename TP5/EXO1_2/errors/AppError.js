class AppError extends Error {
  constructor(message, statusCode, errorType) {
    super(message);
    
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.errorType = errorType || 'internal';
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;