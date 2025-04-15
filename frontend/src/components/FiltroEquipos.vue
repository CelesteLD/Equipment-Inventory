<template>
  <div class="filtros">
    <h4 class="titulo">🔍 Filtros de búsqueda</h4>

    <div class="campo">
      <label for="referencia">Referencia:</label>
      <input id="referencia" v-model="filtros.referencia" placeholder="Ej: LT-001" />
    </div>

    <div class="campo">
      <label for="marca">Marca:</label>
      <input id="marca" v-model="filtros.marca" placeholder="Ej: Acer" />
    </div>

    <div class="campo">
      <label for="modelo">Modelo:</label>
      <input id="modelo" v-model="filtros.modelo" placeholder="Ej: EX-215" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FiltroEquipos',
  emits: ['filtrar'],
  data() {
    return {
      filtros: {
        referencia: '',
        marca: '',
        modelo: ''
      }
    };
  },
  watch: {
    filtros: {
      handler(nuevo) {
        this.$emit('filtrar', { ...nuevo });
      },
      deep: true
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.filtros {
  font-family: 'Poppins', sans-serif;
  border-radius: 1rem;
  background-color: #ffffff;
  padding: 1.5rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  font-size: 0.95rem;
}

.titulo {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.campo {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #444;
}

input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}
</style>
