// Gloval variables required
var scene, camera, renderer, controls;

// Initialising all the required elements to render the scene
function init() {
  scene = new THREE.Scene();
  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;

  // creating the renderer
  try {
    renderer = new THREE.WebGLRenderer({antialias: true});
  } catch (ex) {
    console.log("System does not support antialiasing- " + ex.message + ". Using a normal WebGL Renderer.");
    renderer = new THREE.WebGLRenderer();
  }
  renderer.shadowMapEnabled = true;
  //renderer.shadowMapSoft = true;
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);

  //create a camera
  camera = new THREE.PerspectiveCamera(45, // FOV
                            WIDTH / HEIGHT, //  Aspect ratio
                            0.1, // Near distance
                            10000); // Far distance
  camera.position.set(0,6,0);
  camera.name = "camera";
  scene.add(camera);
  
  renderer.setClearColor(0x333F47, // color
                          1); // opacity
 
  //create a light
  var light = new THREE.SpotLight(0xE8D04A);
  light.position.set(0,200,300);
  light.name = "light";
  light.castShadow = true;

  light.shadowMapWidth = 1024;
  light.shadowMapHeight = 1024;

  light.shadowCameraNear = 500;
  light.shadowCameraFar = 4000;
  light.shadowCameraFov = 30;
  scene.add(light);

  //add a cube to the scene  
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  var cube = new THREE.Mesh(geometry, material);
  cube.name = "cube";
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);

  // draw a floor (plane) for the cube to sit on 
  var planeGeometry = new THREE.PlaneBufferGeometry(20, 20);
  var planeMaterial = new THREE.MeshPhongMaterial({ color: "yellow" });  
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // make the plane recieve shadow from the cube
  plane.receiveShadow = true;
  plane.castShadow = true;
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.y = -1;
  scene.add(plane);

  // Adding a orbit controls element
  controls = new THREE.OrbitControls(camera, renderer.domElement);

}

function animate() {
  requestAnimationFrame(animate);

  // rotating the cube bit by bit
  scene.getObjectByName("cube").rotation.x += 0.1;
  scene.getObjectByName("cube").rotation.y += 0.1;

  renderer.render(scene, camera);
  controls.update();
}


// Make the calls and init the render loop
init();
animate();
