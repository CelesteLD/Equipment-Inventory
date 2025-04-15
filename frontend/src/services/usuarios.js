import axios from 'axios';

const API_URL = 'http://localhost:3000/api/usuarios';

export const obtenerUsuarios = async () => {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const crearUsuario = async (usuario) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });

    if (!res.ok) throw new Error('Error al crear usuario');
    return await res.json();
  } catch (error) {
    console.error('Error desde servicio:', error);
    throw error;
  }
};

export const actualizarEstadoUsuario = async (id, nuevoEstado) => {
  await axios.put(`${API_URL}/${id}/estado`, { activo: nuevoEstado });
};