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
      <!-- Activos -->
      <div
        v-for="usuario in usuariosActivos"
        :key="usuario.id_usuario"
        :class="['usuario-card', getDepartamentoClass(usuario.departamento)]"
        @click="toggleActivo(usuario)"
      >
        <strong>📝 {{ usuario.nombre }} {{usuario.apellidos}}</strong>
        <p>👤 {{ usuario.usuario_servidor.toUpperCase() }}</p>
        <p class="correo">{{ usuario.correo }}</p>
        <p>🏢 {{ usuario.departamento }}</p>
      </div>

      <!-- Separador -->
      <div class="separador">Usuarios dados de baja</div>

      <!-- Inactivos -->
      <div
        v-for="usuario in usuariosInactivos"
        :key="usuario.id_usuario"
        :class="['usuario-card', getDepartamentoClass(usuario.departamento), 'baja']"
        @click="toggleActivo(usuario)"
      >
      <strong>📝 {{ usuario.nombre }}</strong>
      <p>👤 {{ usuario.usuario_servidor.toUpperCase() }}</p>
      <p class="correo">{{ usuario.correo }}</p>
      <p>🏢 {{ usuario.departamento }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { obtenerUsuarios, crearUsuario, actualizarEstadoUsuario } from '../services/usuarios';
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
        await crearUsuario(nuevoUsuario);
        await cargarUsuarios();
        mostrarFormulario.value = false;
      } catch (error) {
        alert('Hubo un error al guardar el usuario.');
        console.error(error);
      }
    };

    const toggleActivo = async (usuario) => {
      try {
        const nuevoEstado = usuario.activo ? 0 : 1;
        await actualizarEstadoUsuario(usuario.id_usuario, nuevoEstado);
        await cargarUsuarios();
      } catch (error) {
        alert('Error al cambiar estado del usuario');
        console.error(error);
      }
    };

    const usuariosFiltrados = computed(() =>
      usuarios.value.filter((u) => {
        const coincideNombre = u.nombre.toLowerCase().includes(filtros.value.nombre.toLowerCase());
        const coincideDepto =
          !filtros.value.departamento || u.departamento === filtros.value.departamento;
        return coincideNombre && coincideDepto;
      })
    );

    const usuariosActivos = computed(() =>
      usuariosFiltrados.value.filter((u) => u.activo)
    );

    const usuariosInactivos = computed(() =>
      usuariosFiltrados.value.filter((u) => !u.activo)
    );

    const getDepartamentoClass = (depto) => {
      const mapa = {
        'FORMACIÓN': 'depto-formacion',
        'PSICOLOGÍA': 'depto-psicologia',
        'SERVICIOS GENERALES': 'depto-informatica',
        'ADMINISTRACIÓN': 'depto-administracion',
        'ATENCIÓN SOCIAL': 'depto-social',
        'DIRECCIÓN': 'depto-direccion',
        'COMERCIAL': 'depto-comercial',
        'PRÁCTICAS': 'depto-practicas'
      };
      return mapa[depto] || 'depto-default';
    };

    onMounted(() => {
      cargarUsuarios();
    });

    return {
      usuariosActivos,
      usuariosInactivos,
      aplicarFiltros,
      mostrarFormulario,
      guardarUsuario,
      toggleActivo,
      getDepartamentoClass
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');


.usuarios-layout {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 2rem;
  gap: 2rem;  background-color: #f5f7fa;
}

.sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.usuarios-grid {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  align-self: flex-start;
}

.usuario-card {
  padding: 1rem;
  border-radius: 1rem;
  color: white;
  font-weight: 500;
  text-align: center;
  min-height: 160px; /* aumentado */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.07);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.4rem; /* añade separación entre líneas */
}

.usuario-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
}

.baja {
  filter: grayscale(100%) brightness(0.7);
}

.separador {
  grid-column: 1 / -1;
  text-align: left;
  font-weight: bold;
  font-size: 1rem;
  color: #555;
  margin: 1rem 0 0.3rem;
  padding-top: 0.5rem;
  border-top: 2px solid #ccc;
}

/* Colores por departamento */
.depto-formacion {
  background-color: #00b0f0;
}
.depto-psicologia {
  background-color: #f57c00;
}
.depto-informatica {
  background-color: #facc15;
  color: #000;
}
.depto-administracion {
  background-color: #388e3c;
}
.depto-social {
  background-color: #d32f2f;
}
.depto-direccion {
  background-color: #f8bbd0;
  color: #000;
}
.depto-comercial {
  background-color: #6a1b9a;
}
.depto-practicas {
  background-color: #dcdcdc;
  color: #000;
}
.depto-default {
  background-color: #607d8b;
}

.btn {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.2rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s ease;
}
.btn:hover {
  background: linear-gradient(135deg, #0056b3, #003e80);
}

.correo {
  font-size: 0.62rem;
  opacity: 0.85;
  word-break: break-word;
  overflow-wrap: break-word;
}


</style>
