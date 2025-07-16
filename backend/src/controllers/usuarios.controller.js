const db = require('../config/db');

// GET /usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const [filas] = await db.query('SELECT * FROM usuarios');
    res.status(200).json(filas);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// POST /usuarios
const crearUsuario = async (req, res) => {
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

  try {
    const query = `
      INSERT INTO usuarios (nombre, apellidos, correo, usuario_servidor, departamento, activo)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [nombre, apellidos, correo, usuario_servidor, departamento, activo]);

    res.status(201).json({ mensaje: 'Usuario creado correctamente', id: result.insertId });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ error: 'No se pudo crear el usuario.' });
  }
};

// PUT /usuarios/:id/estado
const cambiarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;

  try {
    const query = 'UPDATE usuarios SET activo = ? WHERE id_usuario = ?';
    await db.query(query, [activo, id]);
    res.status(200).json({ mensaje: 'Estado actualizado correctamente' });
  } catch (err) {
    console.error('Error al cambiar estado:', err);
    res.status(500).json({ error: 'Error al actualizar estado del usuario' });
  }
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  cambiarEstadoUsuario
};
