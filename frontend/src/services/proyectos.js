import api from './api';

export const obtenerProyectos = async () => {
  try {
    const res = await api.get('/proyectos');
    return res.data;
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return [];
  }
};

export const crearProyecto = async (datos) => {
  try {
    const res = await api.post('/proyectos', datos);
    return res.data;
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    throw error;
  }
};
