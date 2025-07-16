const db = require('../config/db');

// GET /equipos
const obtenerEquipos = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM equipos');
    res.status(200).json(results);
  } catch (err) {
    console.error('Error al obtener equipos:', err);
    res.status(500).json({ error: 'Error al obtener equipos' });
  }
};

// POST /equipos
const crearEquipo = async (req, res) => {
  const {
    referencia,
    marca,
    modelo,
    mac_lan,
    mac_wifi,
    numero_serie,
    sistema_operativo,
    imagen,
    estado
  } = req.body;

  if (!referencia || !marca || !modelo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  const query = `
    INSERT INTO equipos 
    (referencia, marca, modelo, mac_lan, mac_wifi, numero_serie, sistema_operativo, imagen, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(query, [
      referencia,
      marca,
      modelo,
      mac_lan || null,
      mac_wifi || null,
      numero_serie || null,
      sistema_operativo || null,
      imagen || null,
      estado || 'disponible'
    ]);

    res.status(201).json({ mensaje: 'Equipo creado correctamente', id: result.insertId });
  } catch (err) {
    console.error('Error al crear equipo:', err);
    res.status(500).json({ error: 'No se pudo crear el equipo.' });
  }
};

// PUT /equipos/:id
const actualizarEquipo = async (req, res) => {
  const { id } = req.params;
  const {
    referencia,
    marca,
    modelo,
    mac_lan,
    mac_wifi,
    numero_serie,
    sistema_operativo,
    imagen,
    estado
  } = req.body;

  const query = `
    UPDATE equipos SET 
      referencia = ?, 
      marca = ?, 
      modelo = ?, 
      mac_lan = ?, 
      mac_wifi = ?, 
      numero_serie = ?, 
      sistema_operativo = ?, 
      imagen = ?, 
      estado = ?
    WHERE id_equipo = ?
  `;

  try {
    await db.query(query, [
      referencia,
      marca,
      modelo,
      mac_lan || null,
      mac_wifi || null,
      numero_serie || null,
      sistema_operativo || null,
      imagen || null,
      estado || 'disponible',
      id
    ]);

    res.status(200).json({ mensaje: 'Equipo actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar equipo:', err);
    res.status(500).json({ error: 'No se pudo actualizar el equipo.' });
  }
};

module.exports = {
  obtenerEquipos,
  crearEquipo,
  actualizarEquipo
};
