const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

function dividirTextoEnLineas(ctx, texto, maxAncho) {
  const palabras = texto.split(' ');
  const lineas = [];
  let linea = '';

  for (let palabra of palabras) {
    const prueba = linea + palabra + ' ';
    if (ctx.measureText(prueba).width > maxAncho) {
      lineas.push(linea.trim());
      linea = palabra + ' ';
    } else {
      linea = prueba;
    }
  }
  lineas.push(linea.trim());
  return lineas;
}

const generarCartelRedes = async (req, res) => {
  try {
    const inputDir = path.join(__dirname, '../../public/carteles');
    const outputDir = path.join(__dirname, '../../public/carteles/con-fondo');

    // Asegurarse de que exista la carpeta de salida
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const archivos = fs.readdirSync(inputDir).filter(file => file.endsWith('.png'));

    const canvasSize = 1800; // Tamaño cuadrado recomendado para Instagram

    for (const archivo of archivos) {
      const inputPath = path.join(inputDir, archivo);
      const outputPath = path.join(outputDir, archivo);

      const cartel = await loadImage(inputPath);

      const canvas = createCanvas(canvasSize, canvasSize);
      const ctx = canvas.getContext('2d');

      // Fondo blanco
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Calcular posición centrada
      const x = (canvasSize - cartel.width) / 2;
      const y = (canvasSize - cartel.height) / 2;

      ctx.drawImage(cartel, x, y);

      // Guardar nuevo cartel con fondo blanco
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      await new Promise(resolve => out.on('finish', resolve));
    }

    res.json({ mensaje: '✅ Carteles adaptados para redes generados correctamente.', cantidad: archivos.length });

  } catch (error) {
    console.error('Error generando carteles de redes:', error);
    res.status(500).json({ error: '❌ Error generando carteles para redes' });
  }
};

const generarCartel = async (req, res) => {
  const {
    nombre,
    fechaInicio,
    fechaFin,
    horario,
    modalidad,
    importe,
    practicas,
    proyecto
  } = req.body;

  try {
    const width = 1240;
    let footerHeight = 200;

    const nombreBase = nombre.includes(' - ')
      ? nombre.split(' - ')[0].trim().toLowerCase()
      : nombre.trim().toLowerCase();

    const fondosPath = path.join(__dirname, '../../templates/fondos.json');
    const proyectosPath = path.join(__dirname, '../../templates/proyectos.json');
    const fondosData = JSON.parse(fs.readFileSync(fondosPath, 'utf8'));
    const proyectosData = JSON.parse(fs.readFileSync(proyectosPath, 'utf8'));

    const fondoFilename = fondosData[nombreBase];
    const proyectoKey = proyecto?.toLowerCase() || '';
    const requisitosTexto = proyectosData[proyectoKey]?.requisitos || '';
    const logos = proyectosData[proyectoKey]?.logo || [];

    if (!fondoFilename) throw new Error(`No se encontró imagen de fondo para: "${nombreBase}"`);

    // Ajustar altura del footer si hay múltiples logos
    if (Array.isArray(logos) && logos.length > 1) {
      footerHeight = 300;
    }

    const height = 1754;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    const fondoPath = path.join(__dirname, '../../templates/wallpaper-cursos', fondoFilename);
    const fondo = await loadImage(fondoPath);

    const fondoRatio = fondo.width / fondo.height;
    const areaRatio = width / (height - 300);
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

    if (fondoRatio > areaRatio) {
      drawHeight = height - 300;
      drawWidth = drawHeight * fondoRatio;
      offsetX = (width - drawWidth) / 2;
    } else {
      drawWidth = width;
      drawHeight = drawWidth / fondoRatio;
      offsetY = (height - 300 - drawHeight) / 2;
    }

    ctx.drawImage(fondo, offsetX, 300 + offsetY, drawWidth, drawHeight);

    // === Header
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, 300);

    const logoPath = path.join(__dirname, '../../templates/logo-aisa.png');
    const logo = await loadImage(logoPath);
    ctx.drawImage(logo, 40, 40, 160, 160);

    ctx.fillStyle = '#0d47a1';
    ctx.textAlign = 'center';
    ctx.font = 'bold 66px sans-serif';
    ctx.fillText('CENTRO DE FORMACIÓN', width / 2, 90);
    ctx.font = 'bold 90px sans-serif';
    ctx.fillText('AISA', width / 2, 165);

    if (proyecto) {
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(proyecto.toUpperCase(), width / 2, 220);
    }

    // === Flecha con título
    const tituloCurso = nombre.split(' - ')[0].trim().toUpperCase();
    const flechaX = 80, flechaY = 240, flechaWidth = width - flechaX, flechaHeight = 100, punta = 50;

    ctx.beginPath();
    ctx.moveTo(flechaX + punta, flechaY);
    ctx.lineTo(flechaX + flechaWidth, flechaY);
    ctx.lineTo(flechaX + flechaWidth, flechaY + flechaHeight);
    ctx.lineTo(flechaX + punta, flechaY + flechaHeight);
    ctx.lineTo(flechaX, flechaY + flechaHeight / 2);
    ctx.closePath();
    ctx.fillStyle = '#ff8a50';
    ctx.fill();

    // === Texto del título
    let fontSize = 60;
    let lineas = [], fits = false;
    while (fontSize >= 30 && !fits) {
      ctx.font = `bold ${fontSize}px sans-serif`;
      lineas = dividirTextoEnLineas(ctx, tituloCurso, flechaWidth - 60);
      const altura = lineas.length * fontSize + (lineas.length - 1) * 10;
      if (altura <= flechaHeight - 20) fits = true;
      else fontSize -= 2;
    }

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    const textX = flechaX + flechaWidth / 2;
    const textYStart = flechaY + flechaHeight / 2 - (lineas.length * fontSize + (lineas.length - 1) * 10) / 2 + fontSize * 0.7;
    lineas.forEach((linea, i) => ctx.fillText(linea, textX, textYStart + i * (fontSize + 10)));

    ctx.textAlign = 'start';

    // === Helpers
    const drawBox = (text, x, y, fontSize = 36, paddingX = 20, color = '#ff8a50') => {
      ctx.font = `bold ${fontSize}px sans-serif`;
      const lines = text.split('\n');
      const maxWidth = Math.max(...lines.map(l => ctx.measureText(l).width));
      const boxWidth = maxWidth + paddingX * 2;
      const boxHeight = 80 + (lines.length - 1) * 45;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, boxWidth, boxHeight);
      ctx.fillStyle = 'white';
      lines.forEach((l, i) => ctx.fillText(l, x + paddingX, y + 55 + i * 45));
    };

    const drawRequisitosBox = (text, x, y, fontSize = 38, paddingX = 30, minWidth = 620) => {
      ctx.font = `bold ${fontSize}px sans-serif`;
      const rawLines = text.split('\n');
      const finalLines = rawLines.flatMap(l => dividirTextoEnLineas(ctx, l, minWidth - paddingX * 2));
      const boxWidth = Math.max(minWidth, Math.max(...finalLines.map(l => ctx.measureText(l).width)) + paddingX * 2);
      const boxHeight = 80 + (finalLines.length - 1) * 45;
      ctx.fillStyle = '#ff8a50';
      ctx.fillRect(x, y, boxWidth, boxHeight);
      ctx.fillStyle = 'white';
      finalLines.forEach((l, i) => ctx.fillText(l, x + paddingX, y + 55 + i * 45));
    };

    // === Datos del curso
    drawBox(parseFloat(importe) === 0 ? 'Importe: Gratuito' : `Importe: ${importe} €`, 60, 360);
    drawBox(`Modalidad: ${modalidad || 'Presencial'}`, 60, 460);
    if (requisitosTexto.trim()) drawRequisitosBox(`Requisitos:\n${requisitosTexto}`, 60, 560);
    const yFecha = 1300;
    if (fechaInicio != fechaFin) {
      drawBox(`Fecha de impartición: Del ${fechaInicio} al ${fechaFin}\nHorario: ${horario}`, 60, yFecha, 34);
    } else {
      drawBox(`Fecha de impartición: El ${fechaInicio}\nHorario: ${horario}`, 60, yFecha, 34);
    }
    
    if (practicas === 'Si') drawBox('Posibilidad de prácticas en empresas', 60, yFecha + 160, 36);

    // === Footer
    ctx.fillStyle = 'white';
    ctx.fillRect(0, height - footerHeight, width, footerHeight);

    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.moveTo(0, height - footerHeight);
    ctx.lineTo(width, height - footerHeight);
    ctx.stroke();

    // Logos centrados en el footer si hay más de uno
if (Array.isArray(logos) && logos.length > 1) {
  const logoHeight = 50;
  const spacing = 40;
  const yLogo = height - footerHeight + 20;

  // Cargar todas las imágenes primero y calcular el ancho total
  const logoImages = await Promise.all(
    logos.map(async (logoFile) => {
      const fullPath = path.join(__dirname, '../../templates/logos', logoFile);
      if (fs.existsSync(fullPath)) {
        const img = await loadImage(fullPath);
        const logoWidth = logoHeight * (img.width / img.height);
        return { img, logoWidth };
      }
      return null;
    })
  );

  const validLogos = logoImages.filter(Boolean);
  const totalLogosWidth = validLogos.reduce((sum, l) => sum + l.logoWidth, 0);
  const totalSpacing = spacing * (validLogos.length - 1);
  const totalWidth = totalLogosWidth + totalSpacing;

  let xStart = (width - totalWidth) / 2;

  for (const { img, logoWidth } of validLogos) {
    ctx.drawImage(img, xStart, yLogo, logoWidth, logoHeight);
    xStart += logoWidth + spacing;
  }
    } else if (logos.length === 1) {
      const fullPath = path.join(__dirname, '../../templates/logos', logos[0]);
      if (fs.existsSync(fullPath)) {
        const img = await loadImage(fullPath);
        ctx.drawImage(img, 50, height - 130, 210, 120);
      }
    }

    // Datos de contacto
    ctx.fillStyle = '#0d47a1';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('📞 922 250 639', 90, height - 140);
    ctx.fillText('📱 627 340 214', 340, height - 140);
    ctx.fillText('✉️ formacion@asociacionaisa.org', 620, height - 140);

    // Web
    ctx.fillStyle = '#ff8a50';
    ctx.font = 'bold 38px sans-serif';
    const web = '🌐 www.asociacionaisa.org';
    ctx.fillText(web, (width - ctx.measureText(web).width) / 2, height - 60);

    // QR
    const qrPath = path.join(__dirname, '../../templates/qr-cartel.png');
    if (fs.existsSync(qrPath)) {
      const qr = await loadImage(qrPath);
      ctx.drawImage(qr, width - 110, height - 110, 80, 80);
    }

    // Guardar imagen
    const slugify = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const formatFecha = (f) => f.split('/').slice(0, 2).join('.');
    const fileName = `cartel-${slugify(nombre.split(' - ')[0])}-${formatFecha(fechaInicio)}-${formatFecha(fechaFin)}.png`;

    const outputPath = path.join(__dirname, '../../public/carteles', fileName);
    const out = fs.createWriteStream(outputPath);
    canvas.createPNGStream().pipe(out);
    out.on('finish', () => res.json({ url: `/carteles/${fileName}` }));

  } catch (err) {
    console.error('Error generando cartel:', err);
    res.status(500).send('Error generando cartel');
  }


};

module.exports = { generarCartel, generarCartelRedes };
