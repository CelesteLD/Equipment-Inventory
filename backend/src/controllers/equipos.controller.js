const db = require('../config/db');

// GET /equipos
const obtenerEquipos = (req, res) => {
  const query = 'SELECT * FROM equipos';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener equipos:', err);
      return res.status(500).json({ error: 'Error al obtener equipos' });
    }

    res.status(200).json(results);
  });
};

const crearEquipo = (req, res) => {
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
  
    db.query(
      query,
      [
        referencia,
        marca,
        modelo,
        mac_lan || null,
        mac_wifi || null,
        numero_serie || null,
        sistema_operativo || null,
        imagen || null,
        estado || 'disponible'
      ],
      (err, result) => {
        if (err) {
          console.error('Error al crear equipo:', err);
          return res.status(500).json({ error: 'No se pudo crear el equipo.' });
        }
  
        res.status(201).json({ mensaje: 'Equipo creado correctamente', id: result.insertId });
      }
    );
  };
  

  const actualizarEquipo = (req, res) => {
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
  
    db.query(
      query,
      [
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
      ],
      (err, result) => {
        if (err) {
          console.error('Error al actualizar equipo:', err);
          return res.status(500).json({ error: 'No se pudo actualizar el equipo.' });
        }
  
        res.status(200).json({ mensaje: 'Equipo actualizado correctamente' });
      }
    );
  };
  

module.exports = {
    obtenerEquipos,
    crearEquipo,
    actualizarEquipo
};
  