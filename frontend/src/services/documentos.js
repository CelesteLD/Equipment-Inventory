import api from './api';

const API = '/documentos';

export const generarDocumento = (id, tipo) => {
  return api.post(`${API}/${tipo}/${id}`, {}, { responseType: 'blob' });
};
