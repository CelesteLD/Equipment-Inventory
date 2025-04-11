<template>
  <div class="asignaciones-layout">
    <h2>Asignaciones activas</h2>

    <button class="btn" @click="mostrarFormulario = !mostrarFormulario">
      ➕ Añadir asignación
    </button>

    <!-- Formulario para nueva asignación -->
    <FormularioAsignacion
      v-if="mostrarFormulario"
      :usuarios="usuariosDisponibles"
      :equipos="equiposDisponibles"
      @guardar="guardarAsignacion"
      @cancelar="mostrarFormulario = false"
    />

    <!-- Tabla -->
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
          <th>USUARIO</th>
          <th>FECHA ENTREGA</th>
          <th>OBSERVA</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in asignacionesActivas" :key="a.id_asignacion">
          <td>{{ a.referencia }}</td>
          <td>{{ a.marca }}</td>
          <td>{{ a.modelo }}</td>
          <td>{{ a.mac_lan }}</td>
          <td>{{ a.mac_wifi }}</td>
          <td>{{ a.numero_serie }}</td>
          <td>{{ a.sistema_operativo }}</td>
          <td>{{ a.usuario }}</td>
          <td>{{ a.fecha_asignacion }}</td>
          <td>{{ a.observaciones }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { obtenerAsignaciones, crearAsignacion } from '../services/asignaciones';
import { obtenerUsuarios } from '../services/usuarios';
import { obtenerEquipos } from '../services/equipos';
import FormularioAsignacion from '../components/FormularioAsignacion.vue';

export default {
  name: 'AsignacionesView',
  components: { FormularioAsignacion },
  setup() {
    const asignaciones = ref([]);
    const mostrarFormulario = ref(false);

    const usuariosDisponibles = ref([]);
    const equiposDisponibles = ref([]);

    const cargarAsignaciones = async () => {
      asignaciones.value = await obtenerAsignaciones();
    };

    const cargarUsuariosYEquipos = async () => {
      const usuarios = await obtenerUsuarios();
      usuariosDisponibles.value = usuarios.filter(u => u.activo === 1);

      const equipos = await obtenerEquipos();
      equiposDisponibles.value = equipos.filter(e => e.estado === 'disponible');
    };

    const asignacionesActivas = computed(() =>
      asignaciones.value.filter(a => a.activa === 1)
    );

    const guardarAsignacion = async (nueva) => {
      try {
        await crearAsignacion(nueva);           // 🔧 LLAMADA REAL AL BACKEND
        mostrarFormulario.value = false;        // Oculta el formulario
        await cargarAsignaciones();             // Vuelve a cargar la tabla
      } catch (error) {
        console.error('Error al guardar la asignación:', error);
      }
    };


    onMounted(() => {
      cargarAsignaciones();
      cargarUsuariosYEquipos();
    });

    return {
      asignacionesActivas,
      mostrarFormulario,
      usuariosDisponibles,
      equiposDisponibles,
      guardarAsignacion
    };
  }
};
</script>

<style scoped>
.asignaciones-layout {
  padding: 1.5rem;
}

.btn {
  background-color: #0d6efd;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
}

.asignaciones-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}
</style>
