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
  renderer.setClearColor(0x333F47, // color
                          1); // opacity
  document.body.appendChild(renderer.domElement);

  //create a camera
  camera = new THREE.PerspectiveCamera(45, // FOV
                            WIDTH / HEIGHT, //  Aspect ratio
                            0.1, // Near distance
                            10000); // Far distance
  camera.position.set(1,1,1);
  camera.name = "camera";
  scene.add(camera);
  
  
 
  //create a light
  var ambient = new THREE.AmbientLight("white");
  scene.add(ambient);


  // add a spotlight to illuminate the cube and cause shadows            
  spotLight = new THREE.SpotLight("green");

  //spotLight = new THREE.DirectionalLight(0xdfebff, 1.75);
  spotLight.name = "spotLight";
  spotLight.position.set(4, 4, 1);

  

  spotLight.castShadow = true;
  spotLight.shadowMapWidth = 512;
  spotLight.shadowMapHeight = 512;
  spotLight.intensity = 1;
  spotLight.shadowDarkness = 0.1;
  spotLight.shadowCameraNear = true;   // this line makes the shadow appear, hooray!

  scene.add(spotLight);

  //add a cube to the scene  
  var geometry = new THREE.CubeGeometry(0.5, 0.5, 0.5);
  var material = new THREE.MeshPhongMaterial({ color: "yellow", ambient: "white", shininess: 9, metal: true, reflectivity: 9 });
  var cube = new THREE.Mesh(geometry, material);
  cube.name = "cube";
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);

  // draw a floor (plane) for the cube to sit on 
  var planeGeometry = new THREE.PlaneBufferGeometry(5, 5);
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
  scene.getObjectByName("cube").rotation.x += 0.01 * 0.3;
  scene.getObjectByName("cube").rotation.y += 0.01 * 0.5;

  renderer.render(scene, camera);
  controls.update();
}


// Make the calls and init the render loop
init();
animate();
