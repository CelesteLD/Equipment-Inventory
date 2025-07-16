const db = require('../config/db');

// POST /proyectos
const crearProyecto = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del proyecto es obligatorio.' });
  }

  try {
    const query = `INSERT INTO proyectos (nombre) VALUES (?)`;
    const [result] = await db.query(query, [nombre]);
    res.status(201).json({ mensaje: 'Proyecto creado correctamente', id: result.insertId });
  } catch (err) {
    console.error('Error al crear proyecto:', err);
    res.status(500).json({ error: 'No se pudo crear el proyecto.' });
  }
};

// GET /proyectos
const obtenerProyectos = async (req, res) => {
  try {
    const query = `SELECT * FROM proyectos ORDER BY nombre`;
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error al obtener proyectos:', err);
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
};

module.exports = {
  crearProyecto,
  obtenerProyectos
};
