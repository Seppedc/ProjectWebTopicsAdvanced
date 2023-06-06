import { reactive } from "vue";

export const store = reactive({
  dinosaur: {},
  setDinosaur(description) {
    console.log(description);
    this.dinosaur.description = description;
  },
});