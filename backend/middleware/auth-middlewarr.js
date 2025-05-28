const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  
  if (!token) {
    return res.status(401).send({
      error: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, "Piyush");
    console.log(decoded); // Optionally attach to req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send({
      error: 'Access denied. Invalid token.',
    });
  }
}

module.exports = { verifyToken };
