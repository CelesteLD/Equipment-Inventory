import axios from 'axios'

const API = '/api/documentos'

export const generarDocumento = (id, tipo) => {
  return axios.post(`${API}/${tipo}/${id}`, {}, { responseType: 'blob' })
}
