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
  var light = new THREE.PointLight(0xffffff);
  light.position.set(0,200,300);
  light.name = "light";
  scene.add(light);

  //add a cube to the scene  
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  var cube = new THREE.Mesh(geometry, material);
  cube.name = "cube";
  scene.add(cube);

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
