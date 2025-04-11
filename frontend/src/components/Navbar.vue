<template>
    <nav class="navbar">
      <div class="logo-area">
        <img src="/vite.svg" alt="logo" class="logo" />
        <span class="titulo">Inventario</span>
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
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background-color: white;
    border-bottom: 1px solid #ddd;
  }
  
  .logo-area {
    display: flex;
    align-items: center;
  }
  
  .logo {
    height: 40px;
    margin-right: 0.5rem;
  }
  
  .titulo {
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .menu {
    list-style: none;
    display: flex;
    gap: 1.5rem;
    margin: 0;
    padding: 0;
  }
  
  .menu li a {
    text-decoration: none;
    color: black;
    font-weight: bold;
  }
  
  .menu li a.active {
    color: #007bff;
  }
  </style>
  