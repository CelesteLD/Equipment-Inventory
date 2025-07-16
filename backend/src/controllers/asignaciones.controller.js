const db = require('../config/db');

// GET /asignaciones
const obtenerAsignaciones = async (req, res) => {
  const query = `
    SELECT 
      a.id_asignacion,
      a.fecha_asignacion,
      a.observaciones,
      a.activa,
      a.id_usuario,
      a.id_proyecto,
      u.usuario_servidor AS usuario,
      p.nombre AS proyecto,
      e.referencia,
      e.marca,
      e.modelo,
      e.mac_lan,
      e.mac_wifi,
      e.numero_serie,
      e.sistema_operativo
    FROM asignaciones a
    LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
    LEFT JOIN proyectos p ON a.id_proyecto = p.id_proyecto
    JOIN equipos e ON a.id_equipo = e.id_equipo
    ORDER BY a.fecha_asignacion DESC
  `;

  try {
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error al obtener asignaciones:', err);
    res.status(500).json({ error: 'Error al obtener asignaciones' });
  }
};

// POST /asignaciones
const crearAsignacion = async (req, res) => {
  const { id_usuario, id_proyecto, id_equipo, fecha_asignacion, observaciones } = req.body;

  if (!id_equipo || !fecha_asignacion || (!id_usuario && !id_proyecto)) {
    return res.status(400).json({ error: 'Faltan campos obligatorios o no se ha definido destino.' });
  }

  const queryInsert = `
    INSERT INTO asignaciones (id_usuario, id_proyecto, id_equipo, fecha_asignacion, observaciones, activa)
    VALUES (?, ?, ?, ?, ?, true)
  `;

  const queryUpdate = `UPDATE equipos SET estado = 'asignado' WHERE id_equipo = ?`;

  try {
    const [result] = await db.query(queryInsert, [
      id_usuario || null,
      id_proyecto || null,
      id_equipo,
      fecha_asignacion,
      observaciones || null
    ]);

    await db.query(queryUpdate, [id_equipo]);

    res.status(201).json({ mensaje: 'Asignación creada correctamente', id: result.insertId });
  } catch (err) {
    console.error('Error al crear asignación:', err);
    res.status(500).json({ error: 'No se pudo crear la asignación.' });
  }
};

// PUT /asignaciones/:id/finalizar
const finalizarAsignacion = async (req, res) => {
  const id_asignacion = req.params.id;

  const querySelect = 'SELECT id_equipo FROM asignaciones WHERE id_asignacion = ? AND activa = true';
  const queryUpdateAsignacion = 'UPDATE asignaciones SET activa = false WHERE id_asignacion = ?';
  const queryUpdateEquipo = 'UPDATE equipos SET estado = \'disponible\' WHERE id_equipo = ?';

  try {
    const [results] = await db.query(querySelect, [id_asignacion]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Asignación no encontrada o ya finalizada.' });
    }

    const id_equipo = results[0].id_equipo;

    await db.query(queryUpdateAsignacion, [id_asignacion]);
    await db.query(queryUpdateEquipo, [id_equipo]);

    res.status(200).json({ mensaje: 'Asignación finalizada y equipo liberado.' });
  } catch (err) {
    console.error('Error al finalizar asignación:', err);
    res.status(500).json({ error: 'Error al finalizar la asignación.' });
  }
};

// GET /asignaciones/usuario/:id
const obtenerAsignacionesPorUsuario = async (req, res) => {
  const id_usuario = req.params.id;

  const query = `
    SELECT 
      a.id_asignacion,
      a.fecha_asignacion,
      a.observaciones,
      a.activa,
      e.id_equipo,
      e.referencia,
      e.marca,
      e.modelo
    FROM asignaciones a
    JOIN equipos e ON a.id_equipo = e.id_equipo
    WHERE a.id_usuario = ?
    ORDER BY a.fecha_asignacion DESC
  `;

  try {
    const [results] = await db.query(query, [id_usuario]);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error al obtener asignaciones del usuario:', err);
    res.status(500).json({ error: 'Error al obtener asignaciones del usuario' });
  }
};

// GET /asignaciones/equipo/:id
const obtenerAsignacionesPorEquipo = async (req, res) => {
  const id_equipo = req.params.id;

  const query = `
    SELECT 
      a.id_asignacion,
      a.fecha_asignacion,
      a.observaciones,
      a.activa,
      u.id_usuario,
      u.nombre,
      u.apellidos,
      u.departamento,
      p.nombre AS proyecto
    FROM asignaciones a
    LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
    LEFT JOIN proyectos p ON a.id_proyecto = p.id_proyecto
    WHERE a.id_equipo = ?
    ORDER BY a.fecha_asignacion DESC
  `;

  try {
    const [results] = await db.query(query, [id_equipo]);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error al obtener historial del equipo:', err);
    res.status(500).json({ error: 'Error al obtener historial del equipo' });
  }
};

module.exports = {
  obtenerAsignaciones,
  crearAsignacion,
  finalizarAsignacion,
  obtenerAsignacionesPorEquipo,
  obtenerAsignacionesPorUsuario
};
