
let video;
let poses = [];
let nose;
let currentPose;
let skeleton;
let capture;
function setup() {
  // Create canvas object
  createCanvas(640, 480);

  // Link video (P5 CreateCapture function)
  capture = createCapture(VIDEO);
  capture.hide();
  // Initialize poseNet instance (load TensorFlow.js model)
  poseNet = ml5.poseNet(capture, modelReady);
  poseNet.on('pose', poseResults);  


}

function modelReady() {
  select("#status").html("Model loaded");
}

function poseResults(results) {
  poses = results;
}

function draw() {
  image(capture, 0, 0, width, width * capture.height / capture.width);
  //drawNoseKeyPoint();
  drawPoseKeypoints();
  //drawPoseSkeleton();
}

// A function to draw an ellipse over the visible nose keypoint
function drawNoseKeyPoint() {
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
    if(pose.nose.confidence >= 0.6){
      fill(255, 0, 0);
      noStroke();
      ellipse(pose.nose.x, pose.nose.y, 10, 10);
    }
   
  }
}

// A function to draw ellipses over the visible pose keypoints
function drawPoseKeypoints() {
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
    console.log(pose.rightEar.confidence);
    if(pose.rightEar.confidence > 0.8 && pose.leftEar.confidence >0.8){
      console.log("stqnd still");
    }else if(pose.rightEar.confidence > 0.8){
      console.log("go left");

    }else if(pose.leftEar.confidence > 0.8){
      console.log("go right");
    }
    
  }
}

// A function to draw the pose skeleton
function drawPoseSkeleton() {
  for (let i = 0; i < poses.length; i += 1) {
    const skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j += 1) {
      const partA = skeleton[j][0];
      const partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
function test(){
  for (let j = 0; j < pose.keypoints.length; j += 1) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    const keypoint = pose.keypoints[j];
    // Only draw an ellipse is the pose probability is bigger than 0.2
    if (keypoint.score > 0.8) {
      fill(255, 0, 0);
      noStroke();
      ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    }
  }
}