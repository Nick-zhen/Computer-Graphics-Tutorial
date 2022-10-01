/**
 * UBC CPSC 314, Vsep2021
 * Earth texture demo
 */

// CHECK WEBGL VERSION
if ( WEBGL.isWebGL2Available() === false ) {
  document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
}

// SETUP RENDERER
const canvas = document.createElement("canvas");
const context = canvas.getContext( 'webgl2' );
const renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
renderer.setClearColor(0xffffff); // white background colour
document.body.appendChild(renderer.domElement);

// SCENE
const scene = new THREE.Scene();

// SETS: OBJECT(S) IN THE SCENE

// WORLD COORDINATE FRAME: other objects are defined with respect to it
const worldFrame = new THREE.AxesHelper(5) ;
scene.add(worldFrame);

// FLOOR 
const floorTexture = new THREE.TextureLoader().load('images/checkerboard.jpg');
// demo 
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(1,1);

// version 1
// const floorMaterial = new THREE.MeshBasicMaterial({ 
//   map: floorTexture, 
//   side: THREE.DoubleSide
// });

// version 2: Simple Shader Material
const floorMaterial = new THREE.ShaderMaterial( {
  side: THREE.DoubleSide,
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent,
  uniforms: {
      colorMap: { type: "t", value: floorTexture }}
} );
					  

// const floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
const floorGeometry = new THREE.BoxGeometry(50, 50, 5);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
worldFrame.add(floor);


// EARTH
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);

// version 1: Basic material
// const earthMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, wireframe: false } );

// version 2: Textured material
const earthColorTexture = 
    new THREE.TextureLoader().load('images/earthmap1k.jpg');

const earthBumpTexture = 
    new THREE.TextureLoader().load('images/earthbump1k.jpg');

const earthMaterial = new THREE.MeshPhongMaterial( 
    {
      // demo
    	map: earthColorTexture,
	    bumpMap: earthBumpTexture
    } );

const earth = new THREE.Mesh(earthGeometry, earthMaterial);

earth.position.set(0, 5, 0);
scene.add(earth);

// LIGHTS
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(-70,100,-70);
scene.add(pointLight);    

// CAMERA
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
//const camera = new THREE.OrthographicCamera(-10,10,10,-10,1,1000); // l,r,t,b,n,f
//camera.position.set(10,15,40);
camera.position.set(-10,15,-40);
camera.lookAt(scene.position); 
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// Input
const keyboard = new THREEx.KeyboardState();

function checkKeyboard() {
  if (keyboard.pressed("A"))
    pointLight.position.x += 10.0;
  if (keyboard.pressed("D"))
    pointLight.position.x -= 10.0;
  if (keyboard.pressed("W"))
    pointLight.position.y += 10.0;
  if (keyboard.pressed("S"))
    pointLight.position.y -= 10.0;
}



// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

update();
