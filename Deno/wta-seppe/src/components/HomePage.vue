<script>
export default {
  methods: {
    navigateTo(endpoint) {
      this.$router.push(endpoint);
    }
  }
};
//biggest part of the html and css of the homepage component has been written by chatgpt as a demonstration to a group of peaple on how easy anyone can create a website
</script>

<template>
  <div class="container">
    <h2 class="subtitle-left">Uitleg over dit project</h2>
    <p class="description ">In dit project was het de bedoeling om de game breakout na te maken. </p>
    <p class="description ">De besturing zou niet worden gedaan via de muis of keyboard maar via de persoon zijn lichaams beweging aan de hand van een camera.</p>
    <p class="description ">Na het spelen van de game en als de gebruiker in de top 5 staat van spelers qua punten dan kan die zijn naam opgeven en wordt deze toegevoegd aan de top5 </p>

    <p class="description"></p>
    <div class="content">
      <p class="subtitle">Beschikbare functionaliteiten:</p>
      <div class="button-container">
        <button class="button" @click="navigateTo('/StartGame')">Game</button>
        <button class="button" @click="navigateTo('/Highscores')">Highscores</button>
        <button class="button disabled">Multiplayer</button>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  height: 100vh;
  padding-top: 20px;
  max-width: 80%;
  margin: 0 auto; 
}

.title {
  font-size: 28px;
  margin-bottom: 10px;
}

.subtitle-left {
  font-size: 18px;
  text-align: left;
  margin-bottom: 10px;
  align-self: flex-start; 
}

.description {
  font-size: 14px;
  text-align: left; 
  margin-bottom: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.subtitle {
  font-size: 18px;
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  flex-direction: row;
}

.button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.disabled {
  background-color: #888888;
  cursor: not-allowed;
}
</style>
