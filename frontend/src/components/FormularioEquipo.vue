<template>
    <div class="formulario">
      <h3>Nuevo Equipo</h3>
  
      <form @submit.prevent="emitirEquipo">
        <div class="campo" v-for="campo in camposTexto" :key="campo.nombre">
          <label>{{ campo.label }}:</label>
          <input v-model="equipo[campo.nombre]" type="text" required />
        </div>
  
        <div class="campo">
          <label>Estado:</label>
          <select v-model="equipo.estado" required>
            <option disabled value="">Seleccione uno</option>
            <option value="disponible">Disponible</option>
            <option value="asignado">Asignado</option>
            <option value="baja">Baja</option>
          </select>
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
    name: 'FormularioEquipo',
    emits: ['guardar', 'cancelar'],
    data() {
      return {
        equipo: {
          referencia: '',
          marca: '',
          modelo: '',
          mac_lan: '',
          mac_wifi: '',
          numero_serie: '',
          sistema_operativo: '',
          imagen: '',
          estado: ''
        },
        camposTexto: [
          { nombre: 'referencia', label: 'Referencia' },
          { nombre: 'marca', label: 'Marca' },
          { nombre: 'modelo', label: 'Modelo' },
          { nombre: 'mac_lan', label: 'MAC LAN' },
          { nombre: 'mac_wifi', label: 'MAC WIFI' },
          { nombre: 'numero_serie', label: 'Nº Serie' },
          { nombre: 'sistema_operativo', label: 'Sistema Operativo' },
          { nombre: 'imagen', label: 'Nombre de imagen' }
        ]
      };
    },
    methods: {
      emitirEquipo() {
        this.$emit('guardar', { ...this.equipo });
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
    margin-top: 1rem;
    max-width: 100%;
    font-size: 0.95rem;
  }
  
  .campo {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.3rem;
  }
  
  input,
  select {
    width: 100%;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 0.95rem;
  }
  
  .acciones {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    font-size: 0.95rem;
  }
  
  button[type='submit'] {
    background-color: #0d6efd;
    color: white;
  }
  
  button[type='button'] {
    background-color: #ddd;
  }
  </style>
  