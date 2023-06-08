<script setup>
</script>

<template>
  <header class="fixed-header">
    <h3>
      <router-link to="/" class="title-link">WTA Project Seppe de craene</router-link>
    </h3>
  </header>
  <router-view/>
</template>

<style scoped>
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  z-index: 999; 
}

.title-link {
  text-decoration: underline;
  color: black;
}
h3{
  margin: 5px;

}
</style>