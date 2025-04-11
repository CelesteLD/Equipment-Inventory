<template>
    <div class="filtros">
      <h4>Panel de Filtros</h4>
  
      <div class="campo">
        <label>Referencia:</label>
        <input v-model="filtros.referencia" placeholder="Referencia..." />
      </div>
  
      <div class="campo">
        <label>Marca:</label>
        <input v-model="filtros.marca" placeholder="Marca..." />
      </div>
  
      <div class="campo">
        <label>Modelo:</label>
        <input v-model="filtros.modelo" placeholder="Modelo..." />
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
  .filtros {
    border: 1px solid #ccc;
    padding: 1rem 1.2rem;
    border-radius: 10px;
    background-color: white;
    font-size: 0.9rem;
  }
  
  .campo {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.3rem;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
  </style>
  