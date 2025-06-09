const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    console.warn('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.warn('Invalid token:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
}


module.exports = authMiddleware;
