<template>
    <div class="modal-overlay" @click.self="$emit('cerrar')">
      <div class="modal">
        <h3>Editar equipo: {{ equipo.referencia }}</h3>
  
        <div class="formulario">
          <div class="campo" v-for="campo in camposTexto" :key="campo.nombre">
            <label>{{ campo.label }}:</label>
            <input v-model="equipoLocal[campo.nombre]" type="text" />
          </div>
  
          <div class="campo">
            <label>Estado:</label>
            <select v-model="equipoLocal.estado">
              <option value="disponible">Disponible</option>
              <option value="asignado">Asignado</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
  
        <div class="acciones">
          <button @click="emitirGuardado">Guardar</button>
          <button @click="$emit('cerrar')">Cancelar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ModalEquipo',
    props: {
      equipo: Object
    },
    emits: ['guardar', 'cerrar'],
    data() {
      return {
        equipoLocal: { ...this.equipo },
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
      emitirGuardado() {
        this.$emit('guardar', { ...this.equipoLocal });
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    width: 400px;
    max-width: 90%;
  }
  
  .formulario .campo {
    margin-bottom: 1rem;
  }
  
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.3rem;
  }
  
  input, select {
    width: 100%;
    padding: 0.4rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
  
  .acciones {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    font-weight: bold;
    cursor: pointer;
  }
  
  button:first-child {
    background-color: #0d6efd;
    color: white;
  }
  
  button:last-child {
    background-color: #ddd;
  }
  </style>
  