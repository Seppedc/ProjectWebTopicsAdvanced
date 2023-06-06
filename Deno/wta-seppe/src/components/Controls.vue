<script>
import { ref, onMounted,inject } from "vue";
import { store } from '../store.js'

export default {
  setup() {
    const video = ref(null);
    let poses = [];
    let capture;
    let poseNet;


    onMounted(() => {
      const sketch = (p) => {
        p.setup = () => {
          // Create canvas object
          p.createCanvas(250, 250);
  
          // Link video (P5 CreateCapture function)
          capture = p.createCapture(p.VIDEO);
          capture.hide();
          // Initialize poseNet instance (load TensorFlow.js model)
          poseNet = ml5.poseNet(capture, p.modelReady);
          poseNet.on("pose", p.poseResults);
        };
  
        p.poseResults = (results) => {
          poses = results;
        };
  
        p.draw = () => {
          p.image(
            capture,
            0,
            0,
            p.width,
            (p.width * capture.height) / capture.width
          );
          p.drawPoseKeypoints();
        };
  
        p.drawPoseKeypoints = () => {
          for (let i = 0; i < poses.length; i += 1) {
            const pose = poses[i].pose;
            // Update direction value
            if (pose.rightEar.confidence > 0.8 && pose.leftEar.confidence > 0.8) {
              console.log("stand still")
              store.setDinosaur("stand still")
            } else if (pose.rightEar.confidence > 0.8) {
              console.log("go left")
              store.setDinosaur("go left")
            } else if (pose.leftEar.confidence > 0.8) {
              console.log("go right")
              store.setDinosaur("go right")
            }
          }
        };
      };
  
      new p5(sketch);
    });
  
    return {
      video,
      store
    };
  },
};
</script>

<template>
 
</template>

<style scoped>
</style>