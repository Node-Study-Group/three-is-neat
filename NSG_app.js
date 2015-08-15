/*
 *        WELCOME TO THREE!!!
 */

// window constants
WIDTH = window.innerWidth;
HEIGHT = window.innerHeight;

// create clock to assist animation timing
var clock = new THREE.Clock();

// create instance of framerate tracker
var stats = initStats();

// create scene, camera, and renderer
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45         // view angle
                                  , WIDTH/HEIGHT    // aspect ratio
                                  , 1               // near plane
                                  , 500);           // far plane
camera.position.set(-30, 40, 30);
camera.lookAt(scene.position);
scene.add(camera);

var renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xeeeeee);
renderer.shadowMapEnabled = true;

// ADD SCENE ELEMENTS

var axes = new THREE.AxisHelper(20);
scene.add(axes);

// create a mesh by first defining geometry and material
var planeGeo = new THREE.PlaneBufferGeometry(100, 50, 1, 1);
var planeMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
plane = new THREE.Mesh( planeGeo, planeMat );
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

var baseMat = new THREE.MeshLambertMaterial({color: 0x777777 });
cube = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), baseMat);
cube.position.y = 2;
scene.add(cube);

spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -20)
scene.add(spotLight);

sphere = new THREE.Mesh(new THREE.SphereGeometry(4, 20, 20), baseMat);
sphere.position.x = 20
sphere.position.y = 4;
scene.add(sphere);

// enable shadows by flagging scene elements as casting or receiving shadows
// define shadow map resolution for crisper edges
spotLight.shadowMapHeight = 2048;
spotLight.shadowMapWidth = 2048;
spotLight.castShadow = true
plane.receiveShadow = true;
cube.castShadow = true;
sphere.castShadow = true;

// define camera controls, which are updated in render loop
// disabled because even defining them messes with dat.GUI

// cameraControls = new THREE.FlyControls(camera);
// cameraControls.movementSpeed = 135;
// cameraControls.rollSpeed = Math.PI / 12;
// cameraControls.autoForward = false;
// cameraControls.dragToLook = true;

// create controls object for dat.GUI
controls = new function() {
  this.rotationSpeed = 0.02;
  this.bouncingSpeed = 0.03;
  this.addCube = function() {
    var cubeSize = Math.ceil(Math.random() * 3);
    var cube = new THREE.Mesh(
      new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
      new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
    )
    cube.position.x = Math.ceil(Math.random() * 60 - 20);
    cube.position.z = Math.ceil(Math.random() * 20 - 10);
    cube.position.y = Math.ceil(Math.random() * 5 + 2)
    cube.castShadow = true;

    scene.add(cube);
  }
}

// create dat.GUI and match control names, also set ranges
var gui = new dat.GUI();
gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'bouncingSpeed', 0, 0.5);
gui.add(controls, 'addCube');

// finally, add the renderer to the DOM
document.getElementById('WebGL-output').appendChild(renderer.domElement);

// timing variables
var step = 0;
var frame = 0;

render();

function render() {
  frame++;
  stats.update();

  // get time since last rendered frame and use to update controls
  delta = clock.getDelta();
  // cameraControls.update(delta);

  // Animate cubes
  rotateCubes();

  // Animate sphere
  bounceBall();

  // Add cubes like crazy
  if (!(frame % 5)) {
    // controls.addCube();
  }

  // Ask browser for frame and render
  requestAnimationFrame( render );
  renderer.render( scene, camera );
}



function initStats() {
  // attach stats window to DOM
  var stats = new Stats();
  stats.setMode(0); // 0 for FPS, 1 for rendering time
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.right = '0px';
  $('#Stats-output').append(stats.domElement);

  return stats;
};

function bounceBall() {
  step += controls.bouncingSpeed;
  sphere.position.y = 4 + 10 * Math.abs(Math.sin(step));
}

function rotateCubes() {
  scene.traverse(function(e){
    if ( e instanceof THREE.Mesh && e != plane ) {
      e.rotation.x += controls.rotationSpeed;
      e.rotation.y += controls.rotationSpeed;
      e.rotation.z += controls.rotationSpeed;
    }
  });
}
