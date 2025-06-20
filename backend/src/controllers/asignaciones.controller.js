const db = require('../config/db');

// GET /asignaciones
const obtenerAsignaciones = (req, res) => {
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

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener asignaciones:', err);
      return res.status(500).json({ error: 'Error al obtener asignaciones' });
    }
    res.status(200).json(results);
  });
};


// POST /asignaciones
const crearAsignacion = (req, res) => {
  const { id_usuario, id_proyecto, id_equipo, fecha_asignacion, observaciones } = req.body;

  if (!id_equipo || !fecha_asignacion || (!id_usuario && !id_proyecto)) {
    return res.status(400).json({ error: 'Faltan campos obligatorios o no se ha definido destino.' });
  }

  const queryInsert = `
    INSERT INTO asignaciones (id_usuario, id_proyecto, id_equipo, fecha_asignacion, observaciones, activa)
    VALUES (?, ?, ?, ?, ?, true)
  `;

  db.query(
    queryInsert,
    [
      id_usuario || null,
      id_proyecto || null,
      id_equipo,
      fecha_asignacion,
      observaciones || null
    ],
    (err, result) => {
      if (err) {
        console.error('Error al crear asignación:', err);
        return res.status(500).json({ error: 'No se pudo crear la asignación.' });
      }

      const queryUpdate = `UPDATE equipos SET estado = 'asignado' WHERE id_equipo = ?`;
      db.query(queryUpdate, [id_equipo], (err2) => {
        if (err2) {
          console.error('Error al actualizar equipo:', err2);
          return res.status(500).json({ error: 'Asignación creada, pero fallo al actualizar equipo.' });
        }

        res.status(201).json({ mensaje: 'Asignación creada correctamente', id: result.insertId });
      });
    }
  );
};

// PUT /asignaciones/:id/finalizar
const finalizarAsignacion = (req, res) => {
  const id_asignacion = req.params.id;

  const querySelect = 'SELECT id_equipo FROM asignaciones WHERE id_asignacion = ? AND activa = true';

  db.query(querySelect, [id_asignacion], (err, results) => {
    if (err) {
      console.error('Error al buscar asignación:', err);
      return res.status(500).json({ error: 'Error al buscar la asignación.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Asignación no encontrada o ya finalizada.' });
    }

    const id_equipo = results[0].id_equipo;

    const queryUpdateAsignacion = `
      UPDATE asignaciones SET activa = false WHERE id_asignacion = ?
    `;

    db.query(queryUpdateAsignacion, [id_asignacion], (err2) => {
      if (err2) {
        console.error('Error al finalizar asignación:', err2);
        return res.status(500).json({ error: 'No se pudo finalizar la asignación.' });
      }

      const queryUpdateEquipo = `
        UPDATE equipos SET estado = 'disponible' WHERE id_equipo = ?
      `;

      db.query(queryUpdateEquipo, [id_equipo], (err3) => {
        if (err3) {
          console.error('Error al actualizar estado del equipo:', err3);
          return res.status(500).json({ error: 'Asignación finalizada, pero error al liberar equipo.' });
        }

        res.status(200).json({ mensaje: 'Asignación finalizada y equipo liberado.' });
      });
    });
  });
};

const obtenerAsignacionesPorUsuario = (req, res) => {
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

  db.query(query, [id_usuario], (err, results) => {
    if (err) {
      console.error('Error al obtener asignaciones del usuario:', err);
      return res.status(500).json({ error: 'Error al obtener asignaciones del usuario' });
    }

    res.status(200).json(results);
  });
};

const obtenerAsignacionesPorEquipo = (req, res) => {
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

  db.query(query, [id_equipo], (err, results) => {
    if (err) {
      console.error('Error al obtener historial del equipo:', err);
      return res.status(500).json({ error: 'Error al obtener historial del equipo' });
    }

    res.status(200).json(results);
  });
};


module.exports = {
  obtenerAsignaciones,
  crearAsignacion,
  finalizarAsignacion,
  obtenerAsignacionesPorEquipo,
  obtenerAsignacionesPorUsuario
};
