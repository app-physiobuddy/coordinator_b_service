
class ErrorTypes {
  static ValidationError(message) {
    const error = new Error(
      typeof message === 'object' 
        ? JSON.stringify(message) 
        : message
    );
    if (typeof message === 'object') {
      error.message = message;
    }
    error.name = 'ValidationError';
    error.statusCode = 400;
    return error;
  }

  static AuthError(message) {
    const error = new Error(
      typeof message === 'object' 
        ? JSON.stringify(message) 
        : message
    );
    if (typeof message === 'object') {
      error.message = message;
    }
    error.name = 'AuthError';
    error.statusCode = 401;
    return error;
  }

  static UnauthorizedAcess(message) {
    const error = new Error(
      typeof message === 'object' 
        ? JSON.stringify(message) 
        : message
    );
    if (typeof message === 'object') {
      error.message = message;
    }
    error.name = 'UnauthorizedAcess';
    error.statusCode = 403;
    return error;
  }

  static NotFoundError(message) {
    const error = new Error(
      typeof message === 'object' 
        ? JSON.stringify(message) 
        : message
    );
    if (typeof message === 'object') {
      error.message = message;
    }
    error.name = 'NotFoundError';
    error.statusCode = 404;
    return error;
  }

  static ConflictError(message) {
    const error = new Error(
      typeof message === 'object' 
        ? JSON.stringify(message) 
        : message
    );
    if (typeof message === 'object') {
      error.message = message;
    }
    error.name = 'ConflictError';
    error.statusCode = 409;
    return error;
  }

  static ServerError(message) {
    const error = new Error(
      typeof message === 'object' 
        ? JSON.stringify(message) 
        : message
    );
    if (typeof message === 'object') {
      error.message = message;
    }
    error.name = 'ServerError';
    error.statusCode = 500;
    return error;
  }
  static DatabaseError(message) {
    const error = new Error(
      typeof message === 'object' 
        ? JSON.stringify(message) 
        : message
    );
    if (typeof message === 'object') {
      error.message = message;
    }
    error.name = 'DatabaseError';
    error.statusCode = 500;
    return error;
  }
  static AuthProviderError(message) {
    const error = new Error(
      typeof message === 'object' 
        ? JSON.stringify(message) 
        : message
    );
    if (typeof message === 'object') {
      error.message = message;
    }
    error.name = 'AuthProviderError';
    error.statusCode = 500;
    return error;
  }

}

module.exports = ErrorTypes;
  
