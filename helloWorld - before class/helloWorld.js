/**
 * UBC CPSC 314, Vjan2022
 * Earth texture demo
 */

// CHECK WEBGL VERSION
if ( WEBGL.isWebGL2Available() === false ) {
  document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
}

// SETUP RENDERER
var canvas = document.createElement("canvas");
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
renderer.setClearColor(0xffffff); // white background colour
document.body.appendChild(renderer.domElement);

// SCENE
var scene = new THREE.Scene();

// SETS: OBJECT(S) IN THE SCENE

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxesHelper(5) ;
scene.add(worldFrame);

// EARTH
var earthGeometry = new THREE.SphereGeometry(5, 32, 32);

// version 1: Basic material
var earthMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, wireframe: false } );

// version 2: Textured material
// var earthColorTexture = 
//     new THREE.TextureLoader().load('images/earthmap1k.jpg');

// var earthBumpTexture = 
//     new THREE.TextureLoader().load('images/earthbump1k.jpg');

// var earthMaterial = new THREE.MeshPhongMaterial( 
//     {
//     	map: earthColorTexture,
// 	    bumpMap: earthBumpTexture
//     } );

// version 3: Simple Shader Material
// var earthMaterial = new THREE.ShaderMaterial( {
//   vertexShader: document.getElementById('vertexShader').textContent,
//   fragmentShader: document.getElementById('fragmentShader').textContent
// } );

var earth = new THREE.Mesh(earthGeometry, earthMaterial);

earth.position.set(0, 5, 0);
scene.add(earth);

// LIGHTS
var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(-70,100,-70);
scene.add(pointLight);    

// CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
//var camera = new THREE.OrthographicCamera(-10,10,10,-10,1,1000); // l,r,t,b,n,f
//camera.position.set(10,15,40);
camera.position.set(-10,15,-40);
camera.lookAt(scene.position); 
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();


// SETUP UPDATE CALL-BACK
function update() {
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

update();
