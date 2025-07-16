import api from './api';

export const obtenerEquipos = async () => {
  try {
    const res = await api.get('/equipos');
    return res.data;
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    return [];
  }
};

export const crearEquipo = async (equipo) => {
  try {
    const res = await api.post('/equipos', equipo);
    return res.data;
  } catch (error) {
    console.error('Error al crear equipo:', error);
    throw error;
  }
};

export const actualizarEquipo = async (id, equipo) => {
  try {
    const res = await api.put(`/equipos/${id}`, equipo);
    return res.data;
  } catch (error) {
    console.error('Error al actualizar equipo:', error);
    throw error;
  }
};
