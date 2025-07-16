const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET ;

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Falta el token de autenticación' });
  }

  const token = authHeader.split(' ')[1]; // Esperamos formato: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no válido' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload; // puedes acceder a req.usuario en los controladores
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};

module.exports = verificarToken;
