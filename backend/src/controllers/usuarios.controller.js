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

// POST /usuarios
const crearUsuario = (req, res) => {
  const {
    nombre,
    apellidos,
    correo,
    usuario_servidor,
    departamento,
    activo
  } = req.body;

  if (!nombre || !apellidos || !correo || !usuario_servidor || !departamento) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  const query = `
    INSERT INTO usuarios (nombre, apellidos, correo, usuario_servidor, departamento, activo)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [nombre, apellidos, correo, usuario_servidor, departamento, activo],
    (err, result) => {
      if (err) {
        console.error('Error al crear usuario:', err);
        return res.status(500).json({ error: 'No se pudo crear el usuario.' });
      }

      res.status(201).json({ mensaje: 'Usuario creado correctamente', id: result.insertId });
    }
  );
};


const cambiarEstadoUsuario = (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;

  const query = `UPDATE usuarios SET activo = ? WHERE id_usuario = ?`;

  db.query(query, [activo, id], (err, result) => {
    if (err) {
      console.error('Error al cambiar estado:', err);
      return res.status(500).json({ error: 'Error al actualizar estado del usuario' });
    }

    res.status(200).json({ mensaje: 'Estado actualizado correctamente' });
  });
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  cambiarEstadoUsuario
};
