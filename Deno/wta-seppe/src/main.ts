import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import Controls from './components/Controls.vue';
import Game from './components/Game.vue'
import { createApp } from 'vue';

const app = createApp(App);

app.use(router);
app.component('Controls', Controls);
app.component('Game', Game);

app.mount("#app");