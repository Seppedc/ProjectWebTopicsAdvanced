<script>
import { ref } from 'vue'
import { store } from '../store.js'

export default {
  setup() {
    const dinosaurs = ref([])

    const fetchData = async () => {
      const res = await fetch("http://localhost:8000/api")
      dinosaurs.value = await res.json();
    }

    fetchData()

    return {
      dinosaurs,
      store
    }
  }
}
</script>

<template>
  <div class="container">
    <div v-for="dinosaur in dinosaurs" class="dinosaur-wrapper">
      <span class="dinosaur">
        <router-link :to="{ name: 'Dinosaur', params: { dinosaur: `${dinosaur.name.toLowerCase()}` }}">
          <span @click="store.setDinosaur(dinosaur.name, dinosaur.description)">
            {{ dinosaur.name }}
          </span>
        </router-link>
      </span>
    </div>
  </div>
</template>

<style scoped>
.dinosaur-wrapper {
  display: inline-block;
  margin: 0.15rem 1rem;
  padding: 0.15rem 1rem;
}
.container {
  text-align: left;
}
</style>
