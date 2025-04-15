import axios from 'axios';

const API_URL = 'http://localhost:3000/api/asignaciones';

export const obtenerAsignaciones = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const crearAsignacion = async (datos) => {
  const res = await axios.post(API_URL, datos);
  return res.data;
};

// ✅ Añade esta función:
export const finalizarAsignacion = async (id) => {
  const res = await axios.put(`${API_URL}/${id}`);
  return res.data;
};
