const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const db = require('../config/db'); // conexión sin promesas

const generarDocumentoUsuario = (req, res) => {
  const id = req.params.id;
  const plantilla = 'entrega_inicial'; // siempre usaremos esta

  const query = 'SELECT nombre, apellidos, usuario_servidor FROM usuarios WHERE id_usuario = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener usuario:', err);
      return res.status(500).json({ error: 'Error al obtener el usuario' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = results[0];

    const inicialNombre = usuario.nombre?.charAt(0).toLowerCase() || '';
    const inicialApellido = usuario.apellidos?.charAt(0).toLowerCase() || '';
    const contrasenaPersonalizada = `1234.abcd${inicialNombre}${inicialApellido}`;

    const data = {
      usuario: usuario.usuario_servidor,
      contrasena: contrasenaPersonalizada
    };

    try {
      const templatePath = path.join(__dirname, '../../templates/documentos/entrega_inicial.docx');
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
  });
};

module.exports = { generarDocumentoUsuario };
