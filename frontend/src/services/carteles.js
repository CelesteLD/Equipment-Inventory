import api from './api';

export async function generarCartelEvento(evento) {
  try {
    const response = await api.post('/carteles/generar', evento);

    return response.data; // data.url
  } catch (error) {
    console.error('Error en generarCartelEvento:', error.response?.data || error.message);
    throw error;
  }
}

export async function generarCartelesRedes() {
  try {
    const response = await api.post('/carteles/generar-redes');
    return response.data;
  } catch (error) {
    console.error('Error en generarCartelesRedes:', error.response?.data || error.message);
    throw error;
  }
}
