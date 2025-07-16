const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usuariosRoutes = require('./routes/usuarios.routes');

app.use('/api/usuarios', usuariosRoutes);

const equiposRoutes = require('./routes/equipos.routes');
app.use('/api/equipos', equiposRoutes);

const asignacionesRoutes = require('./routes/asignaciones.routes');
app.use('/api/asignaciones', asignacionesRoutes);

const proyectosRoutes = require('./routes/proyectos.routes');
app.use('/api/proyectos', proyectosRoutes);

const cartelesRoutes = require('./routes/carteles.routes');
app.use('/api', cartelesRoutes);
app.use('/carteles', express.static(path.join(__dirname, '../public/carteles')));

const documentosRoutes = require('./routes/documentos.routes');
app.use('/api/documentos', documentosRoutes);


// Servir archivos estáticos
app.use('/imagenes-equipos', express.static(path.join(__dirname, '../public/imagenes-equipos')));

// Conectar a DB
require('./config/db');

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Loggin
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);
