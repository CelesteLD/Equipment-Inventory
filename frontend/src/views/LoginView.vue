<template>
  <div class="login-layout">
    <div class="login-card">
      <img src="/logo-aisa.png" alt="Logo AISA" class="login-logo" />
      <h2 class="login-title">Iniciar sesión en <span class="text-blue-700">Gestia</span></h2>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="usuario">Nombre de usuario</label>
          <input v-model="nombre_usuario" type="text" id="usuario" required />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input v-model="password" type="password" id="password" required />
        </div>

        <button type="submit" class="btn-login">Entrar</button>
        <p v-if="error" class="login-error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nombre_usuario: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      try {
        const res = await axios.post('http://localhost:3000/api/auth/login', {
          nombre_usuario: this.nombre_usuario,
          password: this.password
        });

        localStorage.setItem('token', res.data.token);
        this.$router.push('/');
      } catch (err) {
        this.error = 'Usuario o contraseña incorrectos';
      }
    }
  }
};
</script>

<style scoped>
.login-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f5f9;
  padding: 2rem;
}

.login-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.login-logo {
  max-height: 120px;
  margin-bottom: 1rem;
}

.login-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
}

.btn-login {
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-login:hover {
  background-color: #1d4ed8;
}

.login-error {
  color: #dc2626;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
</style>
