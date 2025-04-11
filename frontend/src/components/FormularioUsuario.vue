<template>
    <div class="formulario">
      <h3>Nuevo Usuario</h3>
  
      <form @submit.prevent="emitirUsuario">
        <div class="campo">
          <label>Nombre:</label>
          <input v-model="usuario.nombre" type="text" required />
        </div>
  
        <div class="campo">
          <label>Apellidos:</label>
          <input v-model="usuario.apellidos" type="text" required />
        </div>
  
        <div class="campo">
          <label>Correo:</label>
          <input v-model="usuario.correo" type="email" required />
        </div>
  
        <div class="campo">
          <label>Usuario del servidor:</label>
          <input v-model="usuario.usuario_servidor" type="text" required />
        </div>
  
        <div class="campo">
          <label>Identificación:</label>
          <input v-model="usuario.identificacion" type="text" required />
        </div>
  
        <div class="campo">
          <label>Departamento:</label>
          <select v-model="usuario.departamento" required>
            <option disabled value="">Seleccione uno</option>
            <option v-for="d in departamentos" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
  
        <div class="campo">
          <label>
            <input type="checkbox" v-model="usuario.activo" />
            Usuario activo
          </label>
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
    name: 'FormularioUsuario',
    emits: ['guardar', 'cancelar'],
    data() {
      return {
        usuario: {
          nombre: '',
          apellidos: '',
          correo: '',
          usuario_servidor: '',
          identificacion: '',
          departamento: '',
          activo: true
        },
        departamentos: [
          'ADMINISTRACION',
          'AT.SOCIAL',
          'COMERCIAL',
          'DIRECCION',
          'FORMACION',
          'PRACTICAS',
          'PSICOLOGIA',
          'SECRETARÍA',
          'SERVICIOS GENERALES'
        ]
      };
    },
    methods: {
      emitirUsuario() {
        this.$emit('guardar', { ...this.usuario });
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
    max-width: 500px;
  }
  
  .campo {
    margin-bottom: 1rem;
  }
  
  .campo label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.3rem;
  }
  
  input,
  select {
    width: 100%;
    padding: 0.4rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .acciones {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: none;
    font-weight: bold;
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
  