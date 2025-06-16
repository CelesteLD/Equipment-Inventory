<template>
  <div class="carteles-view">
    <h1>📋 Gestión de Carteles</h1>

    <!-- Panel de subida -->
    <div class="upload-panel">
      <label for="csv-upload">
        📁 <span>Subir archivo CSV:</span>
      </label>
      <input type="file" id="csv-upload" accept=".csv" @change="handleFileUpload" />
      <button v-if="eventos.length" @click="generarTodos" class="btn btn-verde">
        📦 Generar todos los carteles
      </button>

      <button @click="generarCartelesRedes" class="btn btn-verde">
        📲 Generar carteles de redes
      </button>

    </div>

    <!-- Tabla de eventos -->
    <div v-if="eventos.length" class="tabla-contenedor">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th @click="ordenarPorFechaInicio" class="sortable">
              Fecha Inicio <span>{{ ordenAscendente ? '⬆️' : '⬇️' }}</span>
            </th>
            <th>Fecha Fin</th>
            <th>Horario</th>
            <th>Modalidad</th>
            <th>Importe</th>
            <th>Prácticas</th>
            <th>Proyecto</th>
            <th>Cartel</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(evento, index) in eventosOrdenados"
            :key="index"
            @click="generarCartelDesdeEvento(evento)"
          >
            <td :class="['titulo-curso', getProyectoTextClase(evento.Proyecto)]">
              🎓 {{ evento.Nombre }}
            </td>
            <td>{{ evento['Fecha de inicio'] }}</td>
            <td>{{ evento['Fecha de finalización'] }}</td>
            <td>{{ evento.Horario }}</td>
            <td>{{ evento['Subtipo curso'] }}</td>
            <td>{{ parseFloat(evento.Importe) === 0 ? 'Gratuito' : evento.Importe + ' €' }}</td>
            <td>{{ evento['Prácticas en empresa'] }}</td>
            <td>
              <span :class="['badge-proyecto', getProyectoClase(evento.Proyecto)]">
                {{ evento.Proyecto }}
              </span>
            </td>
            <td>
              <button
                @click="generarCartelDesdeEvento(evento)"
                class="btn-cartel"
                :title="`Generar cartel para ${evento.Nombre}`"
              >
                📄
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Papa from 'papaparse';
import { generarCartelEvento } from '../services/carteles';

export default {
  name: 'CartelesView',
  data() {
    return {
      eventos: [],
      ordenAscendente: true
    };
  },
  computed: {
    eventosOrdenados() {
      return [...this.eventos].sort((a, b) => {
        const fechaA = this.convertirFecha(a['Fecha de inicio']);
        const fechaB = this.convertirFecha(b['Fecha de inicio']);
        return this.ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
      });
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            this.eventos = results.data;
          }
        });
      };
      reader.readAsText(file, 'ISO-8859-1');
    },

    async generarCartelDesdeEvento(evento) {
  try {
    const response = await generarCartelEvento({
        nombre: evento.Nombre,
        fechaInicio: evento['Fecha de inicio'],
        fechaFin: evento['Fecha de finalización'],
        horario: evento.Horario,
        modalidad: evento['Subtipo curso'],
        importe: evento.Importe,
        practicas: evento['Prácticas en empresa'],
        proyecto: evento.Proyecto
      });
      window.open(response.url, '_blank');
    } catch (err) {
      alert(`Error generando el cartel para "${evento.Nombre}". Revisa consola.`);
      console.error(err);
    }
  },
  async generarCartelesRedes() {
    try {
      await fetch('/api/carteles/generar-redes', { method: 'POST' });
      alert('Carteles adaptados para redes generados correctamente.');
    } catch (error) {
      alert('Error al generar carteles de redes.');
      console.error(error);
    }
  },
  async generarTodos() {
    for (const evento of this.eventosOrdenados) {
      await this.generarCartelDesdeEvento(evento);
    }
  },
    ordenarPorFechaInicio() {
      this.ordenAscendente = !this.ordenAscendente;
    },
    convertirFecha(fechaStr) {
      const [dia, mes, anio] = fechaStr.split('/');
      return new Date(`${anio}-${mes}-${dia}`);
    },
    getProyectoClase(nombre) {
      const n = nombre?.toLowerCase() || '';
      if (n.includes('privado')) return 'proyecto-privado';
      if (n.includes('digitaliza-t')) return 'proyecto-digitalizat';
      if (n.includes('naturaleza')) return 'proyecto-naturaleza';
      if (n.includes('cuidar')) return 'proyecto-cuidar';
      return 'proyecto-default';
    },
    getProyectoTextClase(nombre) {
      const n = nombre?.toLowerCase() || '';
      if (n.includes('privado')) return 'text-privado';
      if (n.includes('digitaliza-t')) return 'text-digitalizat';
      if (n.includes('naturaleza')) return 'text-naturaleza';
      if (n.includes('cuidar')) return 'text-cuidar';
      return 'text-default';
    },
    getProyectoFilaClase(nombre) {
      const n = nombre?.toLowerCase() || '';
      if (n.includes('privado')) return 'fila-privado';
      if (n.includes('digitaliza-t')) return 'fila-digitalizat';
      if (n.includes('naturaleza')) return 'fila-naturaleza';
      if (n.includes('cuidar')) return 'fila-cuidar';
      return 'fila-default';
    }
  }
};
</script>

<style scoped>
.carteles-view {
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  max-width: 1200px;
  margin: auto;
}

.upload-panel {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

label {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

input[type='file'] {
  border: 1px solid #ccc;
  padding: 0.4rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.btn {
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
}

.btn:hover {
  background-color: #2563eb;
}

.btn-verde {
  background-color: #10b981;
}

.btn-verde:hover {
  background-color: #059669;
}

.tabla-contenedor {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

th,
td {
  padding: 0.75rem;
  text-align: center;
  font-size: 0.9rem;
  vertical-align: middle;
}

th {
  background-color: #f3f4f6;
  font-weight: 600;
}

tbody tr:hover {
  background-color: #f9fafb;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

/* 🎨 Fila como tarjeta suave con borde lateral */
.evento-row {
  transition: background-color 0.2s ease;
  border-left: 6px solid transparent;
}

.fila-privado {
  border-left-color: #3b82f6;
}

.fila-digitalizat {
  border-left-color: #f97316;
}

.fila-naturaleza {
  border-left-color: #22c55e;
}

.fila-cuidar {
  border-left-color: #f67dfb;
}

.fila-default {
  border-left-color: #9ca3af;
}

/* Títulos con color de proyecto */
.titulo-curso {
  font-weight: 600;
  font-size: 0.92rem;
  text-align: left;
}

.text-privado {
  color: #3b82f6;
}

.text-digitalizat {
  color: #f97316;
}

.text-naturaleza {
  color: #22c55e;
}

.text-cuidar {
  color: #f67dfb;
}

.text-default {
  color: #111827;
}

/* Badges proyecto */
.badge-proyecto {
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  display: inline-block;
  white-space: nowrap;
  text-transform: uppercase;
}

.proyecto-privado {
  background-color: #3b82f6;
}

.proyecto-digitalizat {
  background-color: #f97316;
}

.proyecto-naturaleza {
  background-color: #22c55e;
}

.proyecto-cuidar {
  background-color: #f67dfb;
}

.proyecto-default {
  background-color: #6b7280;
}

/* Botón de cartel visualmente atractivo */
.btn-cartel {
  background-color: #090b08;
  border: 2px solid #d1d5db;
  color: #1f2937;
  font-size: 1rem;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cartel:hover {
  background-color: #ccdf55;
  border-color: #9ca3af;
  color: #111827;
}

</style>
