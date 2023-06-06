import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";
import StartGame from "../components/StartGame.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/Startgame",
    name: "Startgame",
    component: StartGame,
  },
  // {
  //   path: "/controls",
  //   name: "Controls",
  //   component: Controls,
  // },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;