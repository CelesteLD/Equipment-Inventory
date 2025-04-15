<template>
  <nav class="navbar">
    <div class="logo-area">
      <img src="../assets/logo-gestia.png" alt="Gestia Logo" class="logo" />
      <span class="titulo">Gestia</span>
    </div>
    <ul class="menu">
      <li><router-link to="/" exact-active-class="active">INICIO</router-link></li>
      <li><router-link to="/equipos" exact-active-class="active">EQUIPOS</router-link></li>
      <li><router-link to="/usuarios" exact-active-class="active">USUARIOS</router-link></li>
      <li><router-link to="/asignaciones" exact-active-class="active">ASIGNACIONES</router-link></li>
      <li><router-link to="/documentos" exact-active-class="active">DOCUMENTOS</router-link></li>
    </ul>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

.navbar {
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.logo {
  height: 40px;
  margin-right: 0.5rem;
}

.titulo {
  font-weight: 700;
  font-size: 1.3rem;
  color: #1f2937;
}

.menu {
  list-style: none;
  display: flex;
  gap: 1.8rem;
  margin: 0;
  padding: 0;
}

.menu li a {
  text-decoration: none;
  font-weight: 600;
  color: #374151;
  position: relative;
  transition: color 0.3s ease;
}

.menu li a:hover {
  color: #1d4ed8;
}

.menu li a.active {
  color: #1d4ed8;
  font-weight: 700;
}
</style>
