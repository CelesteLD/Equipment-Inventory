<template>
  <div class="equipos-layout">
    <!-- Panel lateral -->
    <div class="sidebar">
      <button class="btn" @click="mostrarFormulario = !mostrarFormulario">
        ➕ Añadir dispositivo
      </button>

      <FiltroEquipos @filtrar="aplicarFiltros" />

      <FormularioEquipo
        v-if="mostrarFormulario"
        @guardar="guardarEquipo"
        @cancelar="mostrarFormulario = false"
      />
    </div>

    <!-- Tarjetas -->
    <div class="equipos-grid">
      <div
        v-for="equipo in equiposFiltrados"
        :key="equipo.id_equipo"
        :class="['equipo-card', equipo.estado]"
        @click="verDetalleEquipo(equipo)"
      >
        <img
          v-if="equipo.imagen"
          :src="getImagenUrl(equipo.imagen)"
          :alt="equipo.marca"
          class="equipo-img"
        />
        <strong>{{ equipo.referencia }}</strong>
        <p>{{ equipo.marca }} {{ equipo.modelo }}</p>
        <p>{{ equipo.sistema_operativo }}</p>
      </div>
    </div>

    <!-- Modal con detalle e historial -->
    <ModalEquipo
      v-if="equipoSeleccionado"
      :equipo="equipoSeleccionado"
      :historial="historialEquipo"
      @guardar="editarEquipo"
      @cerrar="equipoSeleccionado = null"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import {
  obtenerEquipos,
  crearEquipo,
  actualizarEquipo
} from '../services/equipos';
import { obtenerHistorialEquipo } from '../services/asignaciones';
import FiltroEquipos from '../components/FiltroEquipos.vue';
import FormularioEquipo from '../components/FormularioEquipo.vue';
import ModalEquipo from '../components/ModalEquipo.vue';

export default {
  name: 'EquiposView',
  components: { FiltroEquipos, FormularioEquipo, ModalEquipo },
  setup() {
    const equipos = ref([]);
    const filtros = ref({ referencia: '', marca: '', modelo: '' });
    const mostrarFormulario = ref(false);
    const equipoSeleccionado = ref(null);
    const historialEquipo = ref([]);

    const cargarEquipos = async () => {
      equipos.value = await obtenerEquipos();
    };

    const aplicarFiltros = (nuevosFiltros) => {
      filtros.value = nuevosFiltros;
    };

    const guardarEquipo = async (nuevoEquipo) => {
      try {
        await crearEquipo(nuevoEquipo);
        await cargarEquipos();
        mostrarFormulario.value = false;
      } catch (error) {
        console.error('Error al guardar el equipo:', error);
      }
    };

    const editarEquipo = async (equipoEditado) => {
      try {
        await actualizarEquipo(equipoEditado.id_equipo, equipoEditado);
        equipoSeleccionado.value = null;
        await cargarEquipos();
      } catch (error) {
        console.error('Error al actualizar el equipo:', error);
      }
    };

    const verDetalleEquipo = async (equipo) => {
      equipoSeleccionado.value = equipo;
      try {
        historialEquipo.value = await obtenerHistorialEquipo(equipo.id_equipo);
      } catch (error) {
        console.error('Error al cargar historial:', error);
        historialEquipo.value = [];
      }
    };

    const equiposFiltrados = computed(() => {
      return equipos.value.filter((e) => {
        const r = e.referencia.toLowerCase().includes(filtros.value.referencia.toLowerCase());
        const m = e.marca.toLowerCase().includes(filtros.value.marca.toLowerCase());
        const mo = e.modelo.toLowerCase().includes(filtros.value.modelo.toLowerCase());
        return r && m && mo;
      });
    });

    const getImagenUrl = (nombre) => `http://localhost:3000/imagenes-equipos/${nombre}`;

    onMounted(() => {
      cargarEquipos();
    });

    return {
      equiposFiltrados,
      mostrarFormulario,
      aplicarFiltros,
      guardarEquipo,
      getImagenUrl,
      equipoSeleccionado,
      editarEquipo,
      historialEquipo,
      verDetalleEquipo
    };
  }
};
</script>

<style scoped>
.equipos-layout {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 1rem;
  gap: 2rem;
}

.sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn {
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.6rem 1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  font-size: 0.95rem;
}

.equipos-grid {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.equipo-card {
  padding: 1rem;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  text-align: center;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.equipo-card:hover {
  transform: scale(1.03);
}

.equipo-img {
  max-width: 100%;
  max-height: 60px;
  object-fit: contain;
  margin: 0 auto 0.3rem;
}

/* Estados */
.disponible {
  background-color: #22c55e;
}

.asignado {
  background-color: #f59e0b;
}

.baja {
  background-color: #6b7280;
}
</style>
