import { createRouter, createWebHistory } from 'vue-router';
import UsuariosView from '../views/UsuariosView.vue';
import EquiposView from '../views/EquiposView.vue';

const routes = [
  { path: '/usuarios', name: 'Usuarios', component: UsuariosView },
  { path: '/equipos', name: 'Equipos', component: EquiposView },
  {
    path: '/asignaciones',
    name: 'Asignaciones',
    component: () => import('../views/AsignacionesView.vue')
  },
  {
    path: '/',
    name: 'Inicio',
    component: () => import('../views/InicioView.vue')
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;