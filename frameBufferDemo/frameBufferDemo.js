/**
 * UBC CPSC 314, Vjan2022
 * Multi-pass texture demo
 */

// CHECK WEBGL VERSION
if ( WEBGL.isWebGL2Available() === false ) {
  document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
}
var blur = false;

// SETUP RENDERER
const canvas = document.createElement("canvas");
const context = canvas.getContext( 'webgl2' );
const renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, antialias: true } );
renderer.setClearColor(0xffffff); // white background colour
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

// 1D length 7, sigma = 1.0
const gaussianWeights = [0.00456569, 0.05399113, 0.24197145, 0.39894347, 0.24197145, 0.05399113, 0.00456569]; 

// SCENE
const scene = new THREE.Scene();
const h_blurScene = new THREE.Scene();

var w = window.innerWidth;
var h = window.innerHeight;
var aspect = w / h;

const renderTarget1 = setupRenderTarget(true);
const renderTarget2 = setupRenderTarget(true);
// For multi-pass visual
const postCam = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
const postScene = new THREE.Scene();

// Materials
const postMaterial = new THREE.ShaderMaterial({
  uniforms: {
    tDiffuse: {type: "t", value: null},
    tDepth: { type: "t", value: null }
  }
});

const h_blurMaterial = new THREE.ShaderMaterial({
  uniforms: {
    sceneInput: {type: "t", value: null},
    screenWidth: {type: "float", value: null},
    weights: {type: "1fv", value: gaussianWeights}
  }
});

const postPlane = new THREE.PlaneGeometry( 2, 2 );
const postQuad = new THREE.Mesh( postPlane, postMaterial );
postScene.add( postQuad );

// Load shaders
const shaderFiles = [
  'glsl/render.vs.glsl',
  'glsl/render.fs.glsl',
  'glsl/gaussian.vs.glsl',
  'glsl/horiz_gaussian.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  h_blurMaterial.vertexShader = shaders['glsl/gaussian.vs.glsl'];
  h_blurMaterial.fragmentShader = shaders['glsl/horiz_gaussian.fs.glsl'];

  postMaterial.vertexShader = shaders['glsl/render.vs.glsl'];
  postMaterial.fragmentShader = shaders['glsl/render.fs.glsl'];
});
// SETS: OBJECT(S) IN THE SCENE

// h Blur scene
const h_postBlurQuad = new THREE.Mesh( postPlane, h_blurMaterial );
h_blurScene.add( h_postBlurQuad );

// WORLD COORDINATE FRAME: other objects are defined with respect to it
const worldFrame = new THREE.AxesHelper(5) ;
scene.add(worldFrame);


// EARTH
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);

// Textured material
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
const sunLight = new THREE.DirectionalLight(0xffffff,1.0);
sunLight.position.set(-7,10,-7);
sunLight.target.position.set(earth.position); // look at center of earth
scene.add(sunLight);

// CAMERA
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
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
    sunLight.position.x += 0.2;
  if (keyboard.pressed("D"))
    sunLight.position.x -= 0.2;
  if (keyboard.pressed("W"))
    sunLight.position.y += 0.2;
  if (keyboard.pressed("S"))
    sunLight.position.y -= 0.2;
  if (keyboard.pressed("1"))
    blur = true;
  if (keyboard.pressed("0"))
    blur = false;
  
}

function updateMaterials() {
  earthMaterial.needsUpdate = true;
  postMaterial.needsUpdate = true;
  h_blurMaterial.needsUpdate = true;
}


// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  updateMaterials();
  requestAnimationFrame(update);
  
  // First-pass: render scene and save render result in renderTarget1.texture
  renderer.setRenderTarget(renderTarget1);
  renderer.render(scene, camera);
  
  
  if (blur)
  {
    // Second-pass: apply a blur effect to the previous render's output saved in renderTarget1.texture
    h_blurMaterial.uniforms.sceneInput.value = renderTarget1.texture;
    h_blurMaterial.uniforms.screenWidth.value = screenSize.x; 
    renderer.setRenderTarget( null ); // To do a third pass you could set renderTarget2 here
    renderer.render( h_blurScene, postCam );
  }
  else
  {
    // Second-pass: simply render the saved texture onto a quad.
    postMaterial.uniforms.tDiffuse.value = renderTarget1.texture;
    postMaterial.uniforms.tDepth.value = renderTarget1.depthTexture;
    renderer.setRenderTarget( null );
    renderer.render( postScene, postCam );
  }
  renderer.setRenderTarget(renderTarget1);
  renderer.clear();
}

var screenSize = new THREE.Vector2();
renderer.getSize(screenSize); 
update();
