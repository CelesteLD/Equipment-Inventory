<template>
    <div class="formulario">
      <h3>Nueva Asignación</h3>
      <form @submit.prevent="emitirAsignacion">
        <div class="campo">
          <label>Usuario:</label>
          <select v-model="asignacion.id_usuario" required>
            <option disabled value="">Seleccione un usuario</option>
            <option v-for="u in usuarios" :key="u.id_usuario" :value="u.id_usuario">
              {{ u.nombre }} {{ u.apellidos }}
            </option>
          </select>
        </div>
  
        <div class="campo">
          <label>Equipo:</label>
          <select v-model="asignacion.id_equipo" required>
            <option disabled value="">Seleccione un equipo</option>
            <option v-for="e in equipos" :key="e.id_equipo" :value="e.id_equipo">
              {{ e.referencia }} - {{ e.marca }} {{ e.modelo }}
            </option>
          </select>
        </div>
  
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
  export default {
    name: 'FormularioAsignacion',
    emits: ['guardar', 'cancelar'],
    props: {
      usuarios: Array,
      equipos: Array
    },
    data() {
      return {
        asignacion: {
          id_usuario: '',
          id_equipo: '',
          fecha_asignacion: new Date().toISOString().slice(0, 10),
          observaciones: ''
        }
      };
    },
    methods: {
      emitirAsignacion() {
        this.$emit('guardar', { ...this.asignacion });
      }
    }
  };
  </script>
  
  <style scoped>
  .formulario {
    border: 1px solid #ccc;
    padding: 1.5rem;
    border-radius: 10px;
    background-color: #f9f9f9;
    max-width: 500px;
    margin-top: 1rem;
  }
  .campo {
    margin-bottom: 1rem;
  }
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.3rem;
  }
  input, select, textarea {
    width: 100%;
    padding: 0.4rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  .acciones {
    display: flex;
    justify-content: space-between;
  }
  button {
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-weight: bold;
    border: none;
    cursor: pointer;
  }
  button[type='submit'] {
    background-color: #0d6efd;
    color: white;
  }
  button[type='button'] {
    background-color: #ddd;
  }
  </style>
  