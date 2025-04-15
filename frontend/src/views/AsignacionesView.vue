<template>
  <div class="asignaciones-layout">
    <h2>Asignaciones activas</h2>

    <button class="btn" @click="mostrarFormulario = !mostrarFormulario">
      ➕ Añadir asignación
    </button>

    <FormularioAsignacion
      v-if="mostrarFormulario"
      :usuarios="usuariosDisponibles"
      :equipos="equiposDisponibles"
      :proyectos="proyectos"
      :asignaciones="asignacionesActivas"
      @guardar="guardarAsignacion"
      @cancelar="mostrarFormulario = false"
    />

    <table class="asignaciones-table">
      <thead>
        <tr>
          <th>REF</th>
          <th>MARCA</th>
          <th>MODELO</th>
          <th>MAC LAN</th>
          <th>MAC WIFI</th>
          <th>S/N</th>
          <th>S.O</th>
          <th>ASIGNADO A</th>
          <th>FECHA ENTREGA</th>
          <th>OBSERVA</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in asignacionesActivas" :key="a.id_asignacion">
          <td :style="{ backgroundColor: '#e0d5f9', fontWeight: '600' }">{{ a.referencia }}</td>
          <td :style="{ backgroundColor: getMarcaColor(a.marca) }">{{ a.marca }}</td>
          <td :style="{ backgroundColor: getModeloColor(a.marca, a.modelo) }">{{ a.modelo }}</td>
          <td>{{ a.mac_lan }}</td>
          <td>{{ a.mac_wifi }}</td>
          <td>{{ a.numero_serie }}</td>
          <td :style="{ backgroundColor: getSOColor(a.sistema_operativo) }">
            {{ a.sistema_operativo }}
          </td>
          <td style="background-color: #e3f2fd;">
            <span v-if="a.usuario">👤{{ a.usuario }}</span>
            <span v-else-if="a.proyecto">📁{{ a.proyecto }}</span>
            <span v-else class="sin-asignar">Sin asignar</span>
          </td>
          <td style="background-color: #cce5ff; font-weight: 600;">
            {{ formatearDia(a.fecha_asignacion) }}
          </td>          
          <td>{{ a.observaciones }}</td>
          <td><button class="btn-x" @click="finalizarAsignacion(a.id_asignacion)">❌</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import {
  obtenerAsignaciones,
  crearAsignacion,
  finalizarAsignacion as finalizarAsignacionAPI
} from '../services/asignaciones';
import { obtenerUsuarios } from '../services/usuarios';
import { obtenerEquipos } from '../services/equipos';
import { obtenerProyectos } from '../services/proyectos';
import FormularioAsignacion from '../components/FormularioAsignacion.vue';

export default {
  name: 'AsignacionesView',
  components: { FormularioAsignacion },
  setup() {
    const asignaciones = ref([]);
    const mostrarFormulario = ref(false);
    const todosLosUsuarios = ref([]);
    const equiposDisponibles = ref([]);
    const proyectos = ref([]);

    const asignacionesActivas = computed(() =>
      asignaciones.value
        .filter(a => a.activa === 1)
        .sort((a, b) => a.referencia.localeCompare(b.referencia, undefined, { numeric: true }))
    );

    const usuariosDisponibles = computed(() => {
      const usados = asignacionesActivas.value.map(a => a.usuario);
      return todosLosUsuarios.value.filter(
        u => u.activo && !usados.includes(u.usuario_servidor)
      );
    });

    const cargarDatos = async () => {
      asignaciones.value = await obtenerAsignaciones();
      todosLosUsuarios.value = await obtenerUsuarios();
      equiposDisponibles.value = (await obtenerEquipos()).filter(e => e.estado === 'disponible');
      proyectos.value = await obtenerProyectos();
    };

    const guardarAsignacion = async (nueva) => {
      try {
        await crearAsignacion(nueva);
        mostrarFormulario.value = false;
        await cargarDatos();
      } catch (error) {
        console.error('Error al guardar la asignación:', error);
      }
    };

    const finalizarAsignacion = async (id) => {
      if (confirm('¿Finalizar esta asignación?')) {
        try {
          await finalizarAsignacionAPI(id);
          await cargarDatos();
        } catch (error) {
          alert('No se pudo finalizar.');
        }
      }
    };

    const getMarcaColor = (marca) => ({
      'Acer': '#ffe0b2',
      'HP': '#f3e5f5',
      'ASUS': '#dcedc8',
      'Gigabyte': '#f8bbd0',
      'Lenovo': '#c5cae9',
      'TTL': '#ffe082'
    }[marca] || '#f5f5f5');

    const getModeloColor = (marca, modelo) => {
      const clave = `${marca} ${modelo}`;
      return {
        'Acer EX-215-54-57VY': '#d0f0c0',
        'HP HP ProBook 450 G10': '#ffd6d6',
        'HP HP250-G9': '#ffe0b2',
        'ASUS F1504Z': '#d0e9ff',
        'Gigabyte G6X 9KG 2024': '#fce4ec',
        'Lenovo B50-70': '#c8e6c9',
        'TTL TTLN1501i7': '#e1bee7'
      }[clave] || '#e8f5e9';
    };

    const getSOColor = (so) => {
      const colores = {
        'W10': '#ffecb3',
        'W11 PRO': '#fff176',
        'W11 HOME': '#e1f5fe',
        'Linux': '#c8e6c9',
        'Ubuntu': '#f8bbd0'
      };
      return colores[so] || '#eeeeee'; // color por defecto
    };

    const formatearDia = (fechaStr) => {
      const fecha = new Date(fechaStr);
      if (isNaN(fecha)) return '';
      
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha.getFullYear();

      return `${dia}/${mes}/${año}`;
    };


    onMounted(() => {
      cargarDatos();
    });

    return {
      asignacionesActivas,
      mostrarFormulario,
      usuariosDisponibles,
      equiposDisponibles,
      proyectos,
      guardarAsignacion,
      finalizarAsignacion,
      getMarcaColor,
      getModeloColor,
      getSOColor,
      formatearDia
    };

  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.asignaciones-layout {
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
  background-color: #f5f7fa;
}

h2 {
  margin-bottom: 1rem;
  font-weight: 600;
  color: #333;
}

.btn {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn:hover {
  background: linear-gradient(135deg, #0056b3, #003e80);
}

.btn-x {
  background: none;
  border: none;
  color: #e53935;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.btn-x:hover {
  transform: scale(1.2);
}

.asignaciones-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

th,
td {
  padding: 0.75rem 1rem;
  text-align: center;
  font-size: 0.9rem;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #0d1117;
  color: #ffffff;
  font-weight: 600;
}

.asignaciones-table td span {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  background-color: #007bff;
  color: white;
}

.asignaciones-table td span.sin-asignar {
  background-color: #9e9e9e;
}
</style>
