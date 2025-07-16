import { createRouter, createWebHistory } from 'vue-router';
import UsuariosView from '../views/UsuariosView.vue';
import EquiposView from '../views/EquiposView.vue';
import CartelesView from '../views/CartelesView.vue';
import DocumentosView from '../views/DocumentosView.vue';
import LoginView from '../views/LoginView.vue';

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/', name: 'Inicio', component: () => import('../views/InicioView.vue'), meta: { requiereAuth: true } },
  { path: '/usuarios', name: 'Usuarios', component: UsuariosView, meta: { requiereAuth: true } },
  { path: '/equipos', name: 'Equipos', component: EquiposView, meta: { requiereAuth: true } },
  { path: '/asignaciones', name: 'Asignaciones', component: () => import('../views/AsignacionesView.vue'), meta: { requiereAuth: true } },
  { path: '/carteles', component: CartelesView, meta: { requiereAuth: true } },
  { path: '/documentos', component: DocumentosView, meta: { requiereAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiereAuth && !token) {
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/');
  } else {
    next();
  }
});

export default router;
