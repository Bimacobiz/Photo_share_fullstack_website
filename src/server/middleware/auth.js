import cognito from '../config/cognito.js';

// Middleware to authenticate JWT token
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }
    
    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = await cognito.verifyToken(token);
    
    // Add user to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

// Middleware to check if user is a creator
export const isCreator = (req, res, next) => {
  if (req.user && req.user.role === 'creator') {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden - Creator access required' });
  }
};

// Middleware to check if user is accessing their own resource or is a creator
export const isOwnerOrCreator = (req, res, next) => {
  if (req.user && (req.user.id === req.params.userId || req.user.role === 'creator')) {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
  }
};