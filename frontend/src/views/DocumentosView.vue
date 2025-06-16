<template>
  <div class="documentos-layout">
    <h1 class="titulo">📄 Generar documentos de usuarios</h1>

    <div v-if="cargando" class="mensaje-cargando">Cargando usuarios...</div>
    <div v-else>
      <div class="usuarios-grid">
        <div
          v-for="usuario in usuariosActivos"
          :key="usuario.id_usuario"
          class="usuario-card"
        >
          <strong class="nombre">👤 {{ usuario.nombre }} {{ usuario.apellidos }}</strong>
          <p class="servidor">🧩 {{ usuario.usuario_servidor }}</p>

          <div class="acciones">
            <button
              @click="descargarDocumento(usuario.id_usuario, usuario.usuario_servidor)"
              class="btn btn-entrega"
            >
              📄 Generar entrega inicial
            </button>
          </div>
        </div>
      </div>

      <div v-if="usuariosActivos.length === 0" class="mensaje-vacio">
        No hay usuarios activos disponibles.
      </div>
    </div>
  </div>
</template>

<script>
import { generarDocumento } from '../services/documentos'
import { obtenerUsuarios } from '../services/usuarios'

export default {
  name: 'DocumentosView',
  data() {
    return {
      usuarios: [],
      cargando: true,
    }
  },
  async mounted() {
    try {
      const res = await obtenerUsuarios()
      this.usuarios = res
    } catch (err) {
      console.error('Error al obtener usuarios:', err)
      this.usuarios = []
    } finally {
      this.cargando = false
    }
  },
  computed: {
    usuariosActivos() {
      return this.usuarios.filter(u => u.activo)
    }
  },
  methods: {
    async descargarDocumento(id, usuarioServidor) {
      try {
        const tipo = 'entrega_inicial'
        const response = await generarDocumento(id, tipo)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${tipo}_${usuarioServidor}.docx`)
        document.body.appendChild(link)
        link.click()
      } catch (err) {
        console.error(`Error generando documento:`, err)
        alert(`Error al generar el documento.`)
      }
    }
  }
}
</script>

<style scoped>
.documentos-layout {
  padding: 2rem;
  background-color: #f9fafb;
}

.titulo {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.mensaje-cargando,
.mensaje-vacio {
  font-size: 1rem;
  color: #555;
  padding: 1rem;
}

.usuarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.usuario-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: transform 0.2s ease;
}
.usuario-card:hover {
  transform: translateY(-4px);
}

.nombre {
  font-weight: bold;
  font-size: 1.05rem;
}

.servidor {
  font-size: 0.95rem;
  color: #666;
}

.acciones {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn {
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.btn-entrega {
  background-color: #6f42c1;
}
.btn-entrega:hover {
  background-color: #5936a7;
}
</style>
