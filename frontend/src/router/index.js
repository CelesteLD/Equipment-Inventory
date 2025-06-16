import { createRouter, createWebHistory } from 'vue-router';
import UsuariosView from '../views/UsuariosView.vue';
import EquiposView from '../views/EquiposView.vue';
import CartelesView from '../views/CartelesView.vue';
import DocumentosView from '../views/DocumentosView.vue'

const routes = [
  { path: '/usuarios', name: 'Usuarios', component: UsuariosView },
  { path: '/equipos', name: 'Equipos', component: EquiposView },
  { path: '/asignaciones', name: 'Asignaciones', component: () => import('../views/AsignacionesView.vue') },
  { path: '/carteles', component: CartelesView },
  { path: '/documentos', component: DocumentosView },
  { path: '/', name: 'Inicio',component: () => import('../views/InicioView.vue') }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;