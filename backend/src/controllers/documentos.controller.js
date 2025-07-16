const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const db = require('../config/db'); // conexión con mysql2/promise

const generarDocumentoUsuario = async (req, res) => {
  const id = req.params.id;
  const plantilla = 'entrega_inicial'; // nombre de la plantilla Word

  try {
    // Consulta usuario + última asignación (ordenada por fecha_entrega)
    const query = `
      SELECT u.nombre, u.apellidos, u.usuario_servidor, a.observaciones
      FROM usuarios u
      LEFT JOIN asignaciones a ON u.id_usuario = a.id_usuario
      WHERE u.id_usuario = ?
      ORDER BY a.fecha_asignacion DESC
      LIMIT 1
    `;

    const [results] = await db.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = results[0];

    const inicialNombre = usuario.nombre?.charAt(0).toLowerCase() || '';
    const inicialApellido = usuario.apellidos?.charAt(0).toLowerCase() || '';
    const contrasenaPersonalizada = `1234.abcd${inicialNombre}${inicialApellido}`;

    const data = {
      usuario: usuario.usuario_servidor,
      contrasena: contrasenaPersonalizada,
      observaciones: usuario.observaciones || 'Sin observaciones'
    };

    const templatePath = path.join(__dirname, '../../templates/documentos', `${plantilla}.docx`);
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: '[[', end: ']]' },
    });

    doc.setData(data);
    doc.render();
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    const fileName = `entrega_inicial_${data.usuario}.docx`;
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    res.send(buffer);

  } catch (error) {
    console.error('Error generando documento:', error);
    res.status(500).json({ error: 'Error generando el documento' });
  }
};

module.exports = { generarDocumentoUsuario };
