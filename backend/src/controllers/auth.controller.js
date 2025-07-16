const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  const { nombre_usuario, password } = req.body;

  if (!nombre_usuario || !password) {
    return res.status(400).json({ mensaje: 'Faltan credenciales' });
  }

  try {
    const [filas] = await pool.query('SELECT * FROM usuarios_app WHERE nombre_usuario = ?', [nombre_usuario]);

    if (filas.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuario = filas[0];

    if (!usuario.activo) {
      return res.status(403).json({ mensaje: 'Usuario inactivo' });
    }

    const coincide = await bcrypt.compare(password, usuario.password_hash);

    if (!coincide) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre_usuario: usuario.nombre_usuario, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

