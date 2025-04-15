<template>
  <div class="formulario">
    <h3>Nueva Asignación</h3>
    <form @submit.prevent="emitirAsignacion">
      <div class="campo">
        <label>Asignar a:</label>
        <select v-model="tipoAsignacion" required>
          <option disabled value="">Seleccione tipo</option>
          <option value="usuario">Usuario</option>
          <option value="proyecto">Proyecto</option>
        </select>
      </div>

      <!-- Si se asigna a usuario -->
      <div class="campo" v-if="tipoAsignacion === 'usuario'">
        <label>Usuario:</label>
        <select v-model="asignacion.id_usuario" required>
          <option disabled value="">Seleccione un usuario</option>
          <option v-for="u in usuarios" :key="u.id_usuario" :value="u.id_usuario">
            {{ u.nombre }} {{ u.apellidos }}
          </option>
        </select>
      </div>

      <!-- Si se asigna a proyecto -->
      <div v-if="tipoAsignacion === 'proyecto'">
        <div class="campo">
          <label>Proyecto existente:</label>
          <select v-model="asignacion.id_proyecto">
            <option disabled value="">Seleccione un proyecto</option>
            <option v-for="p in proyectos" :key="p.id_proyecto" :value="p.id_proyecto">
              {{ p.nombre }}
            </option>
          </select>
        </div>

        <div class="campo">
          <label>O crear nuevo proyecto:</label>
          <input type="text" v-model="nuevoProyecto" placeholder="Nombre del nuevo proyecto" />
        </div>
      </div>

      <!-- Equipo -->
      <div class="campo">
        <label>Equipo:</label>
        <select v-model="asignacion.id_equipo" required>
          <option disabled value="">Seleccione un equipo</option>
          <option v-for="e in equipos" :key="e.id_equipo" :value="e.id_equipo">
            {{ e.referencia }} - {{ e.marca }} {{ e.modelo }}
          </option>
        </select>
      </div>

      <!-- Fecha y Observaciones -->
      <div class="campo">
        <label>Fecha de asignación:</label>
        <input type="date" v-model="asignacion.fecha_asignacion" required />
      </div>

      <div class="campo">
        <label>Observaciones:</label>
        <textarea v-model="asignacion.observaciones" rows="3"></textarea>
      </div>

      <div class="acciones">
        <button type="submit">Guardar</button>
        <button type="button" @click="$emit('cancelar')">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script>
import { crearProyecto } from '../services/proyectos'; // servicio nuevo

export default {
  name: 'FormularioAsignacion',
  emits: ['guardar', 'cancelar'],
  props: {
    usuarios: Array,
    equipos: Array,
    proyectos: Array,
    asignaciones: Array
  },
  data() {
    return {
      tipoAsignacion: '',
      nuevoProyecto: '',
      asignacion: {
        id_usuario: '',
        id_proyecto: '',
        id_equipo: '',
        fecha_asignacion: new Date().toISOString().slice(0, 10),
        observaciones: ''
      }
    };
  },
  methods: {
    async emitirAsignacion() {
      const datos = { ...this.asignacion };

      if (this.tipoAsignacion === 'usuario') {
        datos.id_proyecto = null;
      } else if (this.tipoAsignacion === 'proyecto') {
        datos.id_usuario = null;

        if (this.nuevoProyecto.trim() !== '') {
          try {
            const nuevo = await crearProyecto({ nombre: this.nuevoProyecto.trim() });
            datos.id_proyecto = nuevo.id; // suponemos que el backend responde con el id insertado
          } catch (error) {
            alert('No se pudo crear el proyecto.');
            return;
          }
        }
      }

      this.$emit('guardar', datos);
    }
  }
};
</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.formulario {
  font-family: 'Poppins', sans-serif;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin-top: 1.5rem;
}

h3 {
  margin-bottom: 1.2rem;
  color: #333;
  font-weight: 600;
  font-size: 1.2rem;
}

.campo {
  margin-bottom: 1.2rem;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: 'Poppins', sans-serif;
  background-color: #f9f9f9;
  transition: border 0.2s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
  background-color: #fff;
}

textarea {
  resize: vertical;
}

.acciones {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

button {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

button[type='submit'] {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
}

button[type='submit']:hover {
  background: linear-gradient(135deg, #0056b3, #003e80);
}

button[type='button'] {
  background-color: #e0e0e0;
  color: #333;
}

button[type='button']:hover {
  background-color: #ccc;
}
</style>
