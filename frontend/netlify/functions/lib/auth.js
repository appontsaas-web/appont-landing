const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.REACT_APP_JWT_SECRET || 'test-secret-key-change-in-production';

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function protectedHandler(handler) {
  return async (event, context) => {
    const authHeader = event.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    
    const user = verifyToken(token);
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }
    
    event.user = user;
    return handler(event, context);
  };
}

module.exports = { verifyToken, protectedHandler, JWT_SECRET };
