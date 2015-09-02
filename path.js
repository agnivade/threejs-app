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
  renderer.shadowMapSoft = true;
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
  var ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);

  // add a spotlight to illuminate the cube and cause shadows
  spotLight = new THREE.SpotLight("red");
  //spotLight = new THREE.DirectionalLight(0xdfebff, 1.75);
  spotLight.name = "spotLight";
  spotLight.position.set(3, 2, 3);
  spotLight.castShadow = true;
  spotLight.shadowMapWidth = 512;
  spotLight.shadowMapHeight = 512;
  spotLight.intensity = 2;
  spotLight.shadowDarkness = 0.3;
  spotLight.shadowCameraNear = true;

  //spotLight.shadowCameraNear = 500;
  spotLight.shadowCameraFar = 4000;
  spotLight.shadowCameraFov = 30;

  scene.add(spotLight);

  // Create a sine-like wave
var curve = new THREE.SplineCurve( [
  new THREE.Vector2( -10, 0 ),
  new THREE.Vector2( -5, 5 ),
  new THREE.Vector2( 0, 0 ),
  new THREE.Vector2( 5, -5 ),
  new THREE.Vector2( 10, 0 )
] );

var path = new THREE.Path( curve.getPoints( 50 ) );
var smileyShape = new THREE.Shape();
//smileyShape.moveTo( 8, 4 );
smileyShape.absarc( 4, 4, 4, 0, Math.PI*2, false );
smileyShape.holes.push(path);

  var extrusionSettings = {
    amount: 20,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.5,
    bevelSegments: 8,
    material: 0,
    extrudeMaterial: 1
  };
  var geometry1 = new THREE.ExtrudeGeometry(smileyShape, extrusionSettings);
  var materialFront = new THREE.MeshLambertMaterial({
    color: 0xffff00,
    ambient: 0xffff00
  });
  var mesh1 = new THREE.Mesh( geometry1, materialFront);
  mesh1.position.set(0,0,0);
  scene.add(mesh1);


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
  controls = new THREE.TrackballControls( camera, renderer.domElement );
  controls.minDistance = 100;
  controls.maxDistance = 600;

}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();
}


// Make the calls and init the render loop
init();
animate();
