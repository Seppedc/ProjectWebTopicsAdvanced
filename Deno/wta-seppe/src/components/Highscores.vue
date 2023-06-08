
  <script>
  import { ref } from 'vue'

  export default {
    data() {
        const scores = ref([])
        const fetchData = async () => {
            const res = await fetch("http://localhost:8000/api")
            scores.value = await res.json();
        }

        fetchData()
      return {
        scores
      };
    },
  };
  </script>
  <template>
    <div class="highscores">
      <h2>Highscores</h2>
      <ul>
        <li v-for="(score, index) in scores" :key="index">
          <span>{{ score.name }}</span>
          <span>{{ score.score }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <style>
  .highscores {
    margin-top: 20px;
  }
  
  .highscores h2 {
    font-size: 20px;
  }
  
  .highscores ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .highscores li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  </style>
  