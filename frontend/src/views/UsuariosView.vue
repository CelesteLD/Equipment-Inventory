<template>
  <div class="usuarios-layout">
    <!-- Panel lateral -->
    <div class="sidebar">
      <button class="btn" @click="mostrarFormulario = !mostrarFormulario">
        ➕ Añadir usuario
      </button>

      <FiltroUsuarios @filtrar="aplicarFiltros" />

      <FormularioUsuario
        v-if="mostrarFormulario"
        @guardar="guardarUsuario"
        @cancelar="mostrarFormulario = false"
      />
    </div>

    <!-- Tarjetas de usuario -->
    <div class="usuarios-grid">
      <div
        v-for="usuario in usuariosFiltrados"
        :key="usuario.id_usuario"
        :class="['usuario-card', usuario.activo ? 'disponible' : 'en-uso']"
      >
        <strong>{{ usuario.usuario_servidor.toUpperCase() }}</strong>
        <p>{{ usuario.nombre }}</p>
        <p>{{ usuario.departamento }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { obtenerUsuarios, crearUsuario } from '../services/usuarios';
import FiltroUsuarios from '../components/FiltroUsuarios.vue';
import FormularioUsuario from '../components/FormularioUsuario.vue';

export default {
  components: { FiltroUsuarios, FormularioUsuario },
  setup() {
    const usuarios = ref([]);
    const filtros = ref({ nombre: '', departamento: '' });
    const mostrarFormulario = ref(false);

    const cargarUsuarios = async () => {
      usuarios.value = await obtenerUsuarios();
    };

    const aplicarFiltros = (nuevosFiltros) => {
      filtros.value = nuevosFiltros;
    };

    const guardarUsuario = async (nuevoUsuario) => {
      try {
        await crearUsuario(nuevoUsuario);        // ✅ Guardar en backend
        await cargarUsuarios();                  // ✅ Volver a cargar la lista
        mostrarFormulario.value = false;         // ✅ Ocultar el formulario
      } catch (error) {
        alert('Hubo un error al guardar el usuario.');
        console.error(error);
      }
    };

    const usuariosFiltrados = computed(() => {
      return usuarios.value.filter((u) => {
        const coincideNombre = u.nombre.toLowerCase().includes(filtros.value.nombre.toLowerCase());
        const coincideDepto =
          !filtros.value.departamento || u.departamento === filtros.value.departamento;
        return coincideNombre && coincideDepto;
      });
    });

    onMounted(() => {
      cargarUsuarios();
    });

    return {
      usuariosFiltrados,
      aplicarFiltros,
      mostrarFormulario,
      guardarUsuario
    };
  }
};
</script>

<style scoped>
.usuarios-layout {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 1rem;
  gap: 2rem;
}

.sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.usuarios-grid {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  align-self: flex-start;
}

.usuario-card {
  padding: 1rem;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  text-align: center;
  min-height: 120px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.en-uso {
  background-color: #ef4444; /* rojo = baja */
}

.disponible {
  background-color: #22c55e; /* verde = activo */
}

.btn {
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}
</style>
