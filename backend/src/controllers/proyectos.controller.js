const db = require('../config/db');

// POST /proyectos
const crearProyecto = (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del proyecto es obligatorio.' });
  }

  const query = `INSERT INTO proyectos (nombre) VALUES (?)`;

  db.query(query, [nombre], (err, result) => {
    if (err) {
      console.error('Error al crear proyecto:', err);
      return res.status(500).json({ error: 'No se pudo crear el proyecto.' });
    }

    res.status(201).json({ mensaje: 'Proyecto creado correctamente', id: result.insertId });
  });
};

// GET /proyectos
const obtenerProyectos = (req, res) => {
  const query = `SELECT * FROM proyectos ORDER BY nombre`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener proyectos:', err);
      return res.status(500).json({ error: 'Error al obtener proyectos' });
    }
    res.status(200).json(results);
  });
};

module.exports = {
  crearProyecto,
  obtenerProyectos
};
