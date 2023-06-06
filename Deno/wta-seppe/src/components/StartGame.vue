<template>
    <div>
      <Controls />
      <Game />
    </div>
  </template>
  
  <script>
  import { createApp } from "vue";
  import Controls from "./Controls.vue";
  import Game from "./Game.vue";
  
  const app = createApp({
    // Your component options
  });
  
  
  app.component("Controls", Controls); // Register the Controls component
  app.component("Game", Game); // Register the Game component
  
  app.mount("#app");
  </script>
  
  <style scoped>
  /* Your main component's style */
  </style>
  