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
      >
        <strong>{{ equipo.referencia }}</strong>
        <p>{{ equipo.marca }} {{ equipo.modelo }}</p>
        <p>{{ equipo.sistema_operativo }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { obtenerEquipos, crearEquipo } from '../services/equipos';
import FiltroEquipos from '../components/FiltroEquipos.vue';
import FormularioEquipo from '../components/FormularioEquipo.vue';

export default {
  name: 'EquiposView',
  components: { FiltroEquipos, FormularioEquipo },
  setup() {
    const equipos = ref([]);
    const filtros = ref({ referencia: '', marca: '', modelo: '' });
    const mostrarFormulario = ref(false);

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

    const equiposFiltrados = computed(() => {
      return equipos.value.filter((e) => {
        const r = e.referencia.toLowerCase().includes(filtros.value.referencia.toLowerCase());
        const m = e.marca.toLowerCase().includes(filtros.value.marca.toLowerCase());
        const mo = e.modelo.toLowerCase().includes(filtros.value.modelo.toLowerCase());
        return r && m && mo;
      });
    });

    onMounted(() => {
      cargarEquipos();
    });

    return {
      equiposFiltrados,
      mostrarFormulario,
      aplicarFiltros,
      guardarEquipo
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
  min-height: 120px;
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
