const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {id: decoded.userId};
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
