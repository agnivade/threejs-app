// Gloval variables required
var scene, camera, renderer, controls;
var p_by_b = 4.242 // just a HACK for now, need to be actually computed

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
  camera.position.set(300,300,-150);
  camera.lookAt(0,0,0)
  camera.name = "camera";
  scene.add(camera);



  //create a light
  var ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);


  // add a spotlight to illuminate the cube and cause shadows
  /*spotLight = new THREE.SpotLight("red");
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

  scene.add(spotLight);*/

  var object = new THREE.Object3D();
  var extrusionSettings = {
    amount: 20,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.5,
    bevelSegments: 8,
    material: 0,
    extrudeMaterial: 1
  };
  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    // XXX: ideally, an object will be returned based on the path and we should
    // do getShape() and getHole() on that path. eg - if obj.hasHoles.
    var shape;
    // This returns the first index of z, and hence an indication to split the svg path into shapes and holes
    var indexOfz = path.indexOf('z');
    // Checking if the svg path has holes in it
    if (indexOfz != -1 && indexOfz != path.length-1) {
      var path_main = path.substr(0, indexOfz+1).trim();
      var path_hole = path.substr(indexOfz+1).trim();
      shape = transformSVGPath(path_main);
      var hole = transformSVGPath(path_hole);
      shape.holes.push(hole);
    } else {
      shape = transformSVGPath(path);
    }
    var geometry = new THREE.ExtrudeGeometry(shape, extrusionSettings);
    var material = new THREE.MeshLambertMaterial({ color: 0xb00000, wireframe: false } );
    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    object.add(mesh);
  }
  scene.add(object);

  // Adding a orbit controls element
  controls = new THREE.OrbitControls(camera, renderer.domElement);

}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();
}


// Make the calls and init the render loop
init();
animate();
