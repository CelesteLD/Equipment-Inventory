<template>
  <div class="modal-backdrop">
    <div class="modal-contenido">
      <h3>Editar equipo</h3>

      <form @submit.prevent="emitirEdicion">
        <div class="campo" v-for="campo in camposTexto" :key="campo.nombre">
          <label>{{ campo.label }}:</label>
          <input v-model="equipoEditado[campo.nombre]" type="text" />
        </div>

        <div class="campo">
          <label>Estado:</label>
          <select v-model="equipoEditado.estado">
            <option value="disponible">Disponible</option>
            <option value="asignado">Asignado</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <div class="acciones">
          <button type="submit">Guardar</button>
          <button type="button" class="cancelar" @click="$emit('cerrar')">Cerrar</button>
        </div>
      </form>

      <div class="historial">
        <h4>📜 Historial de Asignaciones</h4>
        <p v-if="!historial || historial.length === 0">Este equipo no tiene asignaciones previas.</p>
        <ul v-else>
          <li v-for="a in historial" :key="a.id_asignacion">
            <span v-if="a.nombre">
              👤 {{ a.nombre }} <span v-if="a.departamento">({{ a.departamento }})</span>
            </span>
            <span v-else-if="a.proyecto">
              📁 {{ a.proyecto }}
            </span>
            <span v-else>
              📍 Asignación desconocida
            </span>
            — {{ formatearFecha(a.fecha_asignacion) }}
            <span v-if="!a.activa">✅</span>
          </li>          
        </ul>        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalEquipo',
  props: {
    equipo: Object,
    historial: Array
  },
  data() {
    return {
      equipoEditado: { ...this.equipo },
      camposTexto: [
        { nombre: 'referencia', label: 'Referencia' },
        { nombre: 'marca', label: 'Marca' },
        { nombre: 'modelo', label: 'Modelo' },
        { nombre: 'mac_lan', label: 'MAC LAN' },
        { nombre: 'mac_wifi', label: 'MAC WIFI' },
        { nombre: 'numero_serie', label: 'Nº Serie' },
        { nombre: 'sistema_operativo', label: 'S.O.' },
        { nombre: 'imagen', label: 'Imagen' }
      ]
    };
  },
  methods: {
    emitirEdicion() {
      this.$emit('guardar', { ...this.equipoEditado });
    },
    formatearFecha(fechaStr) {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5vh;
  z-index: 1000;
}

.modal-contenido {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  max-height: 90vh;
}

.campo {
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.3rem;
}

input,
select {
  width: 100%;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

.acciones {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

button {
  padding: 0.5rem 1rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button[type='submit'] {
  background-color: #0d6efd;
  color: white;
}

button.cancelar {
  background-color: #ccc;
}

.historial {
  margin-top: 2rem;
  font-size: 0.95rem;
}

.historial ul {
  padding-left: 1rem;
}

.historial li {
  margin-bottom: 0.5rem;
}
</style>
