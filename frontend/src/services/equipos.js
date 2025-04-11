import axios from 'axios';

const API_URL = 'http://localhost:3000/api/equipos';

export const obtenerEquipos = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const crearEquipo = async (equipo) => {
  const res = await axios.post(API_URL, equipo);
  return res.data;
};
