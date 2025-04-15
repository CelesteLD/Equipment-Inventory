<template>
  <div class="filtro-panel">
    <h3>🔍 Filtros</h3>

    <div class="filtro-grupo">
      <label for="nombre">Nombre del usuario:</label>
      <input
        id="nombre"
        type="text"
        v-model="filtroLocal.nombre"
        @input="emitirFiltros"
        placeholder="Ej: Juan Pérez"
      />
    </div>

    <div class="filtro-grupo">
      <label for="departamento">Departamento:</label>
      <select id="departamento" v-model="filtroLocal.departamento" @change="emitirFiltros">
        <option value="">Todos</option>
        <option value="ADMINISTRACIÓN">Administración</option>
        <option value="ATENCIÓN SOCIAL">Atención social</option>
        <option value="FORMACIÓN">Formación</option>
        <option value="PSICOLOGÍA">Psicología</option>
        <option value="DIRECCIÓN">Dirección</option>
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.filtro-panel {
  font-family: 'Poppins', sans-serif;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
}

input,
select {
  padding: 0.5rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  background-color: #f9f9f9;
  transition: border 0.2s ease;
}

input:focus,
select:focus {
  border-color: #007bff;
  outline: none;
  background-color: #fff;
}
</style>
