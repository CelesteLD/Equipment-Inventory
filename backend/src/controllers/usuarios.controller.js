const db = require('../config/db');

// GET /usuarios
const obtenerUsuarios = (req, res) => {
  const query = 'SELECT * FROM usuarios';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }

    res.status(200).json(results);
  });
};

const crearUsuario = (req, res) => {
  const {
    nombre,
    apellidos,
    correo,
    usuario_servidor,
    identificacion,
    departamento,
    activo
  } = req.body;

  if (!nombre || !apellidos || !correo || !usuario_servidor || !identificacion || !departamento) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  const query = `
    INSERT INTO usuarios (nombre, apellidos, correo, usuario_servidor, identificacion, departamento, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [nombre, apellidos, correo, usuario_servidor, identificacion, departamento, activo],
    (err, result) => {
      if (err) {
        console.error('Error al crear usuario:', err);
        return res.status(500).json({ error: 'No se pudo crear el usuario.' });
      }

      res.status(201).json({ mensaje: 'Usuario creado correctamente', id: result.insertId });
    }
  );
};

  
  module.exports = {
    obtenerUsuarios,
    crearUsuario,
  };