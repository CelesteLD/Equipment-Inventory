<template>
  <div class="formulario">
    <h3 class="titulo">🖥️ Nuevo Equipo</h3>

    <form @submit.prevent="emitirEquipo">
      <div class="campo" v-for="campo in camposTexto" :key="campo.nombre">
        <label :for="campo.nombre">{{ campo.label }}:</label>
        <input
          :id="campo.nombre"
          v-model="equipo[campo.nombre]"
          type="text"
          required
          :placeholder="`Ingrese ${campo.label.toLowerCase()}`"
        />
      </div>

      <div class="campo">
        <label for="estado">Estado:</label>
        <select v-model="equipo.estado" id="estado" required>
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.formulario {
  font-family: 'Poppins', sans-serif;
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
  max-width: 600px;
  font-size: 0.95rem;
}

.titulo {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
}

.campo {
  margin-bottom: 1.3rem;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #444;
}

input,
select {
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

input:focus,
select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}

.acciones {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

button {
  padding: 0.5rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 600;
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
