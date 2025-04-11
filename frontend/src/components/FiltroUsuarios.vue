<template>
    <div class="filtro-panel">
      <h3>Panel de Filtros</h3>
  
      <div class="filtro-grupo">
        <label for="nombre">Buscar por nombre:</label>
        <input
          id="nombre"
          type="text"
          v-model="filtroLocal.nombre"
          @input="emitirFiltros"
          placeholder="Nombre del usuario"
        />
      </div>
  
      <div class="filtro-grupo">
        <label for="departamento">Departamento:</label>
        <select id="departamento" v-model="filtroLocal.departamento" @change="emitirFiltros">
          <option value="">Todos</option>
          <option value="Administración">Administración</option>
          <option value="Trabajo Social">Trabajo Social</option>
          <option value="Educación">Educación</option>
          <option value="Otros">Otros</option>
        </select>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FiltroUsuarios',
    emits: ['filtrar'],
    data() {
      return {
        filtroLocal: {
          nombre: '',
          departamento: ''
        }
      };
    },
    methods: {
      emitirFiltros() {
        this.$emit('filtrar', { ...this.filtroLocal });
      }
    }
  };
  </script>
  
  <style scoped>
  .filtro-panel {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    width: 250px;
    margin-bottom: 1rem;
    background-color: white;
  }
  
  .filtro-grupo {
    margin-bottom: 1rem;
  }
  
  .filtro-grupo label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.3rem;
  }
  </style>
  