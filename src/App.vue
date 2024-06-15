<script >
import { RouterView } from 'vue-router'; // Importa apenas RouterView do vue-router

export default {
  components: {
    RouterView
  }
};

</script>

<template>
  <div id="app">
    <RouterView /> <!-- Aqui é onde os componentes de rotas serão renderizados -->
  </div>

</template>

<style scoped>

</style>
