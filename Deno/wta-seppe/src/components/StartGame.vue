<template>
    <div>
      <Game />
      <Controls />
    </div>
  </template>
  
  <script>
  import { createApp } from "vue";
  import Controls from "./Controls.vue";
  import Game from "./Game.vue";
  
  const app = createApp({
  });
  
  app.component("Controls", Controls); 
  app.component("Game", Game);

  app.mount("#app");
  </script>
  
  <style scoped>
  </style>
  