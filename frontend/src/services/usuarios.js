// src/services/usuarios.js
import api from './api';

// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  try {
    const res = await api.get('/usuarios');
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Crear nuevo usuario
export const crearUsuario = async (usuario) => {
  try {
    const res = await api.post('/usuarios', usuario);
    return res.data;
  } catch (error) {
    console.error('Error desde servicio:', error);
    throw error;
  }
};

// Actualizar estado del usuario
export const actualizarEstadoUsuario = async (id, nuevoEstado) => {
  try {
    await api.put(`/usuarios/${id}/estado`, { activo: nuevoEstado });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    throw error;
  }
};
