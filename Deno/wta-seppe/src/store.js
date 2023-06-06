import { reactive } from "vue";

export const store = reactive({
  movement: {},
  setMovement(description) {
    console.log(description);
    this.movement.description = description;
  },
});