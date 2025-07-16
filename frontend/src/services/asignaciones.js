import api from './api';

const API_URL = '/asignaciones';

export const obtenerAsignaciones = async () => {
  const res = await api.get(API_URL);
  return res.data;
};

export const crearAsignacion = async (datos) => {
  const res = await api.post(API_URL, datos);
  return res.data;
};

export const finalizarAsignacion = async (id) => {
  const res = await api.put(`${API_URL}/${id}`);
  return res.data;
};

export const obtenerHistorialEquipo = async (id_equipo) => {
  const res = await api.get(`${API_URL}/equipo/${id_equipo}`);
  return res.data;
};
