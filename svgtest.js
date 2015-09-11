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
  camera.position.set(850,51,529);
  //camera.lookAt(0,0,0)
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

  // load svg
  //create base converter classes
  //make the polygon and other classes inherit from them
  // define the functions of each of the classes
  /*
  load svg
  handle layers - in each layer
  get child_elements for that layer -> compute child element
  this will keep on adding to the scene
  for (i=0; i<layers.length; i++) {
    var object = new THREE.Object3D();
    var layer = layers[i];
    childElements = getChildElements(layer);
    for (var j = 0; j < childElements.length; j++) {
      var element = childElements[j];
      var obj = getObject(element);
      var shape = obj.getShape();
      if (obj.hasHoles) {
        var hole = obj.getHole();
        shape.holes.push(hole);
      }
      // apply mesh
      // add the mesh to the object
    }
    // add the object to the scene
  }
  function getObject(element) {
    if element.type == polygon
      // return polygon handler
    else if element.type == path
      // return path object handler
  }
  */

  loader = new THREE.SVGLoader();

  loader.load('ForPro.svg', function(element) {
    var layer0element = element.getElementById('Layer_0');
    handleSVGLayers(layer0element);
  });

  var planeGeometry = new THREE.PlaneBufferGeometry(500, 500);
  var planeMaterial = new THREE.MeshPhongMaterial({ color: "yellow" });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // make the plane recieve shadow from the cube
  plane.receiveShadow = true;
  plane.castShadow = true;
  plane.name = "floor";
  plane.position.set(800,-5,0);
  scene.add(plane);

  // Adding a orbit controls element
  controls = new THREE.OrbitControls(camera, renderer.domElement);

}

function handleSVGLayers(element) {
  var object = new THREE.Object3D();
  var extrusionSettings = {
    amount: 20,
    bevelEnabled: false
  };

  var nodes = element.querySelectorAll('polygon,path');

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    // XXX: ideally, an object will be returned based on the path and we should
    // do getShape() and getHole() on that path. eg - if obj.hasHoles.
    if (node.nodeName == "polygon") {
      var points = node.getAttribute("points").split(' ');
      var color1 = node.getAttribute("style");
      color1 = color1.substr(color1.indexOf('#'), 7);
      var vectorArray = [];
      for (var j = 0; j< points.length; j++) {
        var point = points[j];
        // If there is any unencessary gap, it will result in empty points like this
        if (point == '') {
          continue;
        }
        var x = point.split(',')[0];
        var y = point.split(',')[1];
        vectorArray.push(new THREE.Vector2(x,y));
      }
      var shape = new THREE.Shape();
      shape.fromPoints(vectorArray);
      var geometry = new THREE.ExtrudeGeometry(shape, extrusionSettings);
      var material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(color1),
        wireframe: false,
        reflectivity: 0.5 } );
      var mesh = new THREE.Mesh(geometry, material);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      object.add(mesh);
    } else if (node.nodeName == "path") {
      var shape;
      var path = node.getAttribute("d");
      var color2 = node.getAttribute("style");
      color2 = color2.substr(color2.indexOf('#'), 7);
      // This returns the first index of z, and hence an indication to split the svg path into shapes and holes
      var indexOfz = path.indexOf('z');
      // Checking if the svg path has holes in it
      if (indexOfz != -1 && indexOfz != path.length-1) {
        var path_main = path.substr(0, indexOfz+1).trim();
        var path_hole = path.substr(indexOfz+1).trim();
        shape = transformSVGPath(path_main, 'shape');
        var hole = transformSVGPath(path_hole, 'path');
        shape.holes.push(hole);
      } else {
        shape = transformSVGPath(path, 'shape');
      }
      var geometry = new THREE.ExtrudeGeometry(shape, extrusionSettings);
      var material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(color2),
        wireframe: false,
        reflectivity: 0.5 } );
      var mesh = new THREE.Mesh(geometry, material);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      object.add(mesh);
    } else {
      continue;
    }
  }
  scene.add(object);
  scene.getObjectByName("camera").position.set(850,51,529);
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();
}
