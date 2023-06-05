<template>
    <div ref="container" class="container"></div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import * as CANNON from '../../lib/cannon-es';
  import * as THREE from '../../lib/three.module';
  import { OrbitControls } from '../../lib/OrbitControls';
  import CannonDebugger from '../../lib/cannon-es-debugger';
 // import { throttle } from '../../lib/lodash-es/throttle';

  export default {
  name: 'Game',
  mounted() {
    const resizeUpdateInterval = 500;
    let level = 1;

    // Initialize Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.$refs.container.appendChild(renderer.domElement);

    // Initialize Cannon.js world and debugger
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    const cannonDebugger = new CannonDebugger(scene, world);

    // Initialize controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Create objects, lights, and materials
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    // this.$on('resize', throttle(() => {
    //   const width = window.innerWidth;
    //   const height = window.innerHeight;
    //   camera.aspect = width / height;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(width, height);
    // }, resizeUpdateInterval, { trailing: true }));

    // Handle keydown event
    this.$on('keydown', (event) => {
      switch (event.key) {
        case 'a':
        case 'ArrowLeft':
          if (cube.position.x >= -19) {
            cube.position.x -= 0.5;
          }
          break;
        case 'd':
        case 'ArrowRight':
          if (cube.position.x <= 19) {
            cube.position.x += 0.5;
          }
          break;
        case 'v':
          // Perform some action
          break;
      }
    });

    // Handle component destruction
    this.$once('hook:beforeDestroy', () => {
      renderer.dispose();
      controls.dispose();
      cannonDebugger.destroy();
      this.$el.removeChild(renderer.domElement);
    });
  },
};
</script>

<style>
.container {
  width: 100%;
  height: 100%;
}
</style>