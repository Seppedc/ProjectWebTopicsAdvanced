<script>
import "https://unpkg.com/ml5@latest/dist/ml5.min.js";
import "https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.js"
export default {
  // Properties returned from data() become reactive state
  // and will be exposed on `this`.
  data() {
    return {
      position: "",
      video:null,
      poses :[],
    }
  },

  // Methods are functions that mutate state and trigger updates.
  // They can be bound as event handlers in templates.
  methods: {
    increment() {
      this.count++
    },
    setup() {
        // Create canvas object
        createCanvas(640, 480);

        // Link video (P5 CreateCapture function)
        capture = createCapture(VIDEO);
        capture.hide();
        // Initialize poseNet instance (load TensorFlow.js model)
        poseNet = ml5.poseNet(capture, modelReady);
        poseNet.on('pose', poseResults);


    },
  },
 
  // Lifecycle hooks are called at different stages
  // of a component's lifecycle.
  // This function will be called when the component is mounted.
  mounted() {
    
  }
}
</script>

<template>
  <div>
    <button @click="setup">start</button>
  </div>
</template>