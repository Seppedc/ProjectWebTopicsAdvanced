<script>
import { ref, onMounted, onBeforeUnmount} from 'vue';
import * as CANNON from '../../lib/cannon-es';
import * as THREE from '../../lib/three.module';
import { OrbitControls } from '../../lib/OrbitControls';
import CannonDebugger from '../../lib/cannon-es-debugger';
import { store } from '../store.js';
import { CSS2DRenderer, CSS2DObject } from '../../lib/CSS2DRenderer';


export default {
  name: 'Game',
  setup() {

    return {
      
    };
  },
  data() {
    return {
      store,
      points:0,
      lives:1,
      level:1,
    }
  },
  methods: {
    navigateTo(endpoint) {
      this.$router.push(endpoint);
    }
  },
  beforeDestroy() {
    console.log("test");
  },
  mounted() {
    const resizeUpdateInterval = 500;
    let level = this.level;
    let xSpeed = 0.2;
    let zSpeed = -0.4;
    let lives = this.lives;
    let gamestarted = false;
    let points = this.points;
    let GROUP1 = 1;
    let GROUP2 = 2;
    let GROUP3 = 4;
    let speedMultiplier = 1;
    let boxesVisual = [];
    let boxesPhysical = [];
    // Initialize Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.$refs.container.appendChild(renderer.domElement);
    scene.background = new THREE.Color("black");

    //extra help
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
    const axesHelper = new THREE.AxesHelper(8);
    scene.add(axesHelper);

    //camera 
    camera.position.x = 0;
    camera.position.y = 25;
    camera.position.z = 1;
    camera.lookAt(0,0,1);

    let texture = new THREE.TextureLoader().load("/assets/black.jpg")
    texture.anisotropy = 32
    texture.repeat.set(100, 100)
    texture.wrapT = THREE.RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping
    let geo = new THREE.PlaneBufferGeometry(50, 45)
    let mat = new THREE.MeshLambertMaterial({
      map: texture
    })
    let mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(0, -5, 0)
    mesh.rotation.set(Math.PI / -2, 0, 0)
    scene.add(mesh)
    //licht
    const sun = new THREE.DirectionalLight(0xffffff)
    sun.position.set(0, 20, 0)
    scene.add(sun)
    //fysieke wereld
    const physicsWorld = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0),
    });
    //vloer fysieke wereld
    const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
        
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    physicsWorld.addBody(groundBody);
    const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
        color: 0xff0000,
    });


    //fysieke muren
    var top = new CANNON.Box(new CANNON.Vec3(25.5, 0.5, 0.5));
    var bottum = new CANNON.Box(new CANNON.Vec3(25.5, 0.5, 0.5));
    var left = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 23));
    var right = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 23));

    var body = new CANNON.Body({ mass: 1000000 });
    body.addShape(top, new CANNON.Vec3(0, 0.5, -18));
    body.addShape(bottum, new CANNON.Vec3(0, 0.5, 23));
    body.addShape(left, new CANNON.Vec3(-25, 0.5, 0));
    body.addShape(right, new CANNON.Vec3(25, 0.5, 0));

    physicsWorld.addBody(body);
    //visuele muren
    const boxMaterial = new THREE.MeshNormalMaterial();

    const topGeometry = new THREE.BoxGeometry(50, 1, 0.5);
    const topVisual = new THREE.Mesh(topGeometry, boxMaterial);
    topVisual.position.copy(new THREE.Vector3(0,0,-17.75));
    scene.add(topVisual);

    const bottumGeometry = new THREE.BoxGeometry(50, 1, 0.5);
    const bottumVisual = new THREE.Mesh(bottumGeometry, boxMaterial);
    bottumVisual.position.copy(new THREE.Vector3(0,0,22.75));
    scene.add(bottumVisual);

    const leftGeometry = new THREE.BoxGeometry(0.5, 1, 40.);
    const leftVisual = new THREE.Mesh(leftGeometry, boxMaterial);
    leftVisual.position.copy(new THREE.Vector3(-24.75,0,2.5));
    scene.add(leftVisual);

    const rightGeometry = new THREE.BoxGeometry(0.5, 1, 40.5);
    const rightVisual = new THREE.Mesh(rightGeometry, boxMaterial);
    rightVisual.position.copy(new THREE.Vector3(24.75,0,2.5));
    scene.add(rightVisual);

    //create ball
    const balBody = new CANNON.Body({
        mass: 10,
        shape: new CANNON.Sphere(0.5),
    });
    balBody.position.set(0, 0.5, 16);
    physicsWorld.addBody(balBody);

    const geometry = new THREE.SphereGeometry(0.5);
    const material = new THREE.MeshNormalMaterial();
    const bal = new THREE.Mesh(geometry, material);
    scene.add(bal);

    //add balk 
    const balkGeometry = new THREE.BoxGeometry(10, 0.5, 0.5);
    const balkMaterial = new THREE.MeshNormalMaterial();
    const balkMesh = new THREE.Mesh(balkGeometry, balkMaterial);
    scene.add(balkMesh);

    const balkBody = new CANNON.Body({
        mass: 5000,
        shape: new CANNON.Box(new CANNON.Vec3(5, 0.5, 0.25)),
    });
    balkBody.position.set(0, 0.5, 18);
    balkBody.addEventListener("collide",function(e){
        zSpeed = -zSpeed;
    });
    physicsWorld.addBody(balkBody);
    generateLevel();


    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    document.body.appendChild(labelRenderer.domElement);


    function createLabel(text, x, y) {
        var div = document.createElement('div');
        div.className = 'label';
        div.textContent = text;
        div.style.position = 'absolute';
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        document.body.appendChild(div);
        
        var label = new CSS2DObject(div);
        scene.add(label);
        
        // Method to update the label text
        label.setText = function(newText) {
            div.textContent = newText;
        };
    
    return label;
    }
    var levelLabel = createLabel("Level: 1", -500, -375);
    var pointsLabel = createLabel("Points: 0", -500, -350);
    var livesLabel = createLabel("Lives: 3", -500, -325);
    levelLabel.setText("Level: "+level);
    pointsLabel.setText("Points: "+points);
    livesLabel.setText("Lives: "+lives);

    var StartGame = createLabel("Start the game by pressing V", 0, 75);

    // Animation loop
    function animate() {
      MoveBalk();
      checkEndLevel();
      if(lives !=0){
        requestAnimationFrame(animate);
      }
      //controls.update();
      physicsWorld.fixedStep();
      //link floors togheter
      mesh.position.copy(groundBody.position);
      mesh.quaternion.copy(groundBody.quaternion);
      //move ball 
      MoveBall();
      //sync balk
      balkMesh.position.copy(balkBody.position);
      //sync position
      bal.position.copy(balBody.position);
      bal.quaternion.copy(balBody.quaternion);
      labelRenderer.render(scene, camera);
      renderer.render( scene, camera );

      
    }
    animate();
    function MoveBalk(){
        console.log(store.movement.description);
        if(store.movement.description !== undefined){
            if(store.movement.description == "go right"){
                if(balkBody.position.x <= 19){
                    balkBody.position.x +=  0.5;
                }
            }else if(store.movement.description == "go left"){
                if(balkBody.position.x >= -19){
                    balkBody.position.x -=  0.5;
                }
            }
        }
    }
    // Handle window resize
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      setCanvasDimensions(renderer.domElement, width, height);

    });

    // Handle keydown event
    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'a':
        case 'ArrowLeft':
          if(balkBody.position.x >= -19){
              balkBody.position.x -=  0.5;
          }
          break

        case 'd':
        case 'ArrowRight':
          if(balkBody.position.x <= 19){
              balkBody.position.x +=  0.5;
          }
          break
        case 'v':
          gamestarted = true;
          StartGame.setText(" ");
          break
      }
    });
   
    // Handle component destruction
    onBeforeUnmount(() => {
      renderer.dispose();
      controls.dispose();
      this.$el.removeChild(renderer.domElement);
    });
    function setCanvasDimensions(canvas,width,height,set2dTransform = false){
        const ratio = window.devicePixelRatio;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        if (set2dTransform) {
            canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
        }
    }

    function CreateBlocksLevel1(){
        const offsetBoxes = new THREE.Vector3(-12.5,0,-12.5); 
        for (let i = 0; i < 5; i++) {
            for (let y = 0; y < 5; y++) {
                const boxGeometryLoop = new THREE.BoxGeometry(2.5, 0.5, 1);
                const boxMaterialLoop = new THREE.MeshNormalMaterial();
                const test = new THREE.Mesh(boxGeometryLoop, boxMaterialLoop);
                const spacebetween = new THREE.Vector3(i*5,0, y*2); 
                test.position.copy(new THREE.Vector3(i,0,y).add(offsetBoxes).add(spacebetween));
                boxesVisual.push({body:test,id:test.id});
                scene.add(test);
            }
        }
        for (let i = 0; i < 5; i++) {
            for (let y = 0; y < 5; y++) {
                const boxBodyLoop = new CANNON.Body({
                    mass: 1000000,
                    shape: new CANNON.Box(new CANNON.Vec3(1.25, 0.5, 0.5)),
                    
                });
                boxBodyLoop.position.set(i -12.5 + (i*5), 0.5, y-12.5 +(y*2));
                boxBodyLoop.addEventListener("collide",function(e){
                    if(gamestarted){
                        let place = 0;
                        for (let index = 0; index < boxesPhysical.length; index++) {
                            if(boxesPhysical[index].id == boxBodyLoop.id){
                                place = index;
                            }
                        }
                        let a = boxesPhysical[place].body;
                        let b = boxesVisual[place].body;
                        physicsWorld.removeBody(a);
                        scene.remove(b);
                        zSpeed = -zSpeed;
                        points += 100;
                        boxesPhysical.splice(place,1);
                        boxesVisual.splice(place,1);
                        pointsLabel.setText("Points: "+points);
                    }
                });          
                physicsWorld.addBody(boxBodyLoop);
                boxesPhysical.push({body:boxBodyLoop,id:boxBodyLoop.id});

                
            }
        }
    }

    function MoveBall(){
        if(!gamestarted){
            return;
        }
        if(lives > 0){
            balBody.position.x += xSpeed*speedMultiplier ;
            if(balBody.position.x <= -23.8 || balBody.position.x >= 23.8){
                xSpeed = -xSpeed;
            }
            balBody.position.z += zSpeed;
            if(balBody.position.z <= -17){
                zSpeed = -zSpeed;
            }
            if(balBody.position.z > 21){
                LoseLife();
            }
        }else{
            gameOver();
        }
    }
    async function gameOver(){
        console.log("death");
        balBody.position.x =0;
        balBody.position.z = 16;
        zSpeed = -0.4;
        xSpeed = 0.2
        gamestarted = false;
        const scores = ref([])
        const res = await fetch("https://wta.deno.dev/api")
        scores.value = await res.json();
        if(points>scores.value[4].score){
            var popup = createPopup();
        }else{
            // Assuming you have a container element with an id of "myContainer"
            const container = document.getElementById("canvas");

            // Remove the container element from the DOM
            container.parentNode.removeChild(container);

        }
    }
    function createPopup() {
        var popup = document.createElement("div");
        popup.classList.add("popup");
        var h1 = document.createElement("h1");
        h1.textContent = "Proficiat! U heeft de top 5 behaald";
        popup.appendChild(h1);

        var title = document.createElement("h2");
        title.textContent = "Voornaam";
        title.style.textAlign = "left"; 

        popup.appendChild(title);

        var input = document.createElement("input");
        input.type = "text";
        input.id = "nameInput";
        input.placeholder = "Vul uw naam in";
        popup.appendChild(input);

        var submitBtn = document.createElement("button");
        submitBtn.id = "submitBtn";
        submitBtn.textContent = "Submit";
        popup.appendChild(submitBtn);

        document.body.appendChild(popup);


        submitBtn.addEventListener("click", function() {
            var name = input.value;
            if (name.trim() !== "") {
                submitData(name,points);
            }
        });
    }
    async function submitData(name, points){
    const data = { name, points };
    try {
        const res = await fetch("https://wta.deno.dev/api/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            console.log("Data sent successfully!");
            this.navigateTo('/Highscores');
        } else {
            console.log("Failed to send data!");
        }
    } catch (error) {
        console.log("error", error);
    }
    };
    function LoseLife(){
        lives --;
        gamestarted = false;
        balBody.position.x =0;
        balBody.position.z = 16;
        zSpeed = -0.4;
        xSpeed = 0.2;
        if(lives == 0){
            gameOver();
        }else{
            StartGame.setText("Start the game by pressing V");

        }
        livesLabel.setText("Lives: "+lives);
    }

    function TextOnScreen() {
        const labels = document.getElementsByClassName('label');
        while (labels.length > 0) {
            labels[0].parentNode.removeChild(labels[0]);
        }

        puntenText();
        levelText();
        levensText();
    }

    
    function checkEndLevel(){
        if(boxesPhysical.length == 0){
            gamestarted = false;
            level++;
            balBody.position.x =0;
            balBody.position.z = 16;
            zSpeed = -0.4;
            xSpeed = 0.2
            levelLabel.setText("Level: "+level);
            levelClear();
            generateLevel();
        }
    }
    function levelClear(){
        //add transition text
    }
    function generateLevel(){
        if(level == 1){
            CreateBlocksLevel1();
        }else if(level ==2){
            CreateBlocksLevel1();
            speedMultiplier = 2;
        }else if(level ==3){
            CreateBlocksLevel1();
            speedMultiplier = 2.5;
        }
    }
    function puntenText() {
        const puntenDiv = document.createElement('div');
        puntenDiv.className = 'label';
        puntenDiv.textContent = 'Punten: ' + points;

        const puntenLabel = new CSS2DObject(puntenDiv);
        puntenLabel.position.set(0, 10, 0);
        scene.add(puntenLabel);
    }

    function levensText() {
        const levensDiv = document.createElement('div');
        levensDiv.className = 'label';
        levensDiv.textContent = 'Levens: ' + lives;

        const levensLabel = new CSS2DObject(levensDiv);
        levensLabel.position.set(0, 10, 0.5);
        scene.add(levensLabel);
    }

    function levelText() {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'label';
        levelDiv.textContent = 'Level: ' + level;

        const levelLabel = new CSS2DObject(levelDiv);
        levelLabel.position.set(0, 10, -0.5);
        scene.add(levelLabel);
    }
  },
};
</script>
<template>
     
    <div ref="container" class="containerGame"></div>
</template>
<style>
.text-fields {
  position: absolute;
  top: 125px;
  left: 10px;
  text-align: left;
  color: aliceblue;
  z-index: 1;
}

.text-field {
  margin: 0px;
}
.containerGame{
    position: absolute;
    left: 0;
    top: 0;
    
}
.label {
  position: absolute;
  color: white;
  font-size: 16px;
  font-family: Arial, sans-serif;
  pointer-events: none;
}
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 200px;
  background-color: #fff;
  padding: 20px;
  border: 2px solid #000;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  font-size: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.popup h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.popup h2 {
  margin-top: 0;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-align: left;
}

.popup input {
  margin-bottom: 10px;
  padding: 5px;
  width: 200px;
  height: 30px;
}

.popup button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.popup button:hover {
  background-color: #45a049;
}
</style>