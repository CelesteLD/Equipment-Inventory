<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  components: { Navbar }
}
</script>

<style>
/* ✅ Fuente global */
* {
  font-family: 'Poppins', sans-serif;
}
</style>