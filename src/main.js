import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import postit from '/src/assets/models/PROD3.glb'
import SplitText from '/src/js/splittext'

const menu = document.querySelector('.menu')
const close = document.querySelector('.close')
const launch = document.querySelector('.loader_btn')
const intro = document.querySelector('.loader')
const raycaster = new THREE.Raycaster();

function homeLaunch() {
  const tl = gsap.timeline()

  tl
  .fromTo('.loader_logo',{y:'20%', autoAlpha:0}, {autoAlpha:1, duration:1.6, y:'0%', ease:"power3.out", stagger:0.1}, 1)
  .to('.loader_text span', {duration:1, y:'0%', ease:"power3.out", stagger:0.1}, "-=1")
  .fromTo('.loader_btn',{y:'20%', autoAlpha:0}, {autoAlpha:1, duration:1.6, y:'0%', ease:"power3.out"},"-=0.8")

  launch.addEventListener('click', function(){
    var Introduction = new SplitText(".introduction", {type:"chars, words"})
    var numChars = Introduction.chars.length;
    tl
    .set(objects[2], {intensity:0})
    .to(intro, {autoAlpha:0, duration: 1.15, ease:'power3.out', onComplete:done})
    .from(camera.position, {x:-150, duration:5, ease:'power3.inOut'}, "-=2")
    .to(objects[2], {intensity:1, duration:3, ease:'power3.inOut', onComplete:rand}, "-=3")
    const done = function(){intro.style = 'diplay:none'}
    const rand = function(){
      console.log(numChars)
      for(var i = 0; i < numChars; i++){
        tl.to(Introduction.chars[i], {opacity:1, duration:1, ease:"power3.out"});
      }
    }
  })

  menu.addEventListener('click', function(){
    tl
    .to('.wrapper', {duration:1.15,height:'100vh', ease:'power3.inOut'})
    .to('.overlay li a', {duration:1, y:'0%', ease:'power3.out', stagger:0.1}, "-=0.8")
  })

  close.addEventListener('click', function(){
    const tl = gsap.timeline()
    tl
    .to('.overlay li a', {duration:1, y:'-100%', ease:'power3.in', stagger:0.1})
    .to('.wrapper', {duration:1.15,height:'0vh', ease:'power3.inOut'}, "-=0.8")
  })

}

homeLaunch()

const loader = new GLTFLoader()

// Cursor
const mouse = { x: 0, y: 0, target: null }
const cursor = new THREE.Vector2();

function onMouseMove( event ) {
  cursor.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  cursor.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
window.addEventListener( 'mousemove', onMouseMove, false );

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX / window.innerWidth * 2 - 1
  mouse.y = e.clientY / window.innerHeight * 2 - 1
  mouse.target = e.target
})

// Lerp
function lerp (start, end, amt) { return (1 - amt) * start + amt * end }

let scene = new THREE.Scene()
let renderer = new THREE.WebGLRenderer({ antialias: true })
let objects = []
const body = document.querySelector('body')
const MAP_NAMES = [
  'map',
  'aoMap',
  'emissiveMap',
  'glossinessMap',
  'metalnessMap',
  'normalMap',
  'roughnessMap',
  'specularMap',
];

// Light
// Settings

// Camera
let camera = new THREE.PerspectiveCamera( 22, window.innerWidth / window.innerHeight )
camera.position.x = -65
camera.position.y = -8
camera.position.z = -15
camera.rotation._x = 0
camera.rotation._y = 0
camera.rotation._z = 0
camera.far = 1000

const cameraLookingAt = new THREE.Vector3(mouse.x, mouse.y, 0)

camera.lookAt(cameraLookingAt)

// Resize
window.addEventListener( 'resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix()
  renderer.setSize( window.innerWidth, window.innerHeight )
}, false );

// Render
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.outputEncoding = THREE.sRGBEncoding
renderer.pixelRatio = 4
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMapSoft = true

// Controls
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI;

// Animate
function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  cameraLookingAt.set(
    lerp(cameraLookingAt.x, mouse.x*9 + 160, 0.05),
    lerp(cameraLookingAt.y, 1 - mouse.y*2, 0.05),10
  )
  camera.lookAt(cameraLookingAt)

  raycaster.setFromCamera( cursor, camera )
  const intersects = raycaster.intersectObjects( scene.children )
  for ( var i = 0; i < intersects.length; i++ ) {
    console.log(intersects[i].object)
    intersects[ i ].object.material.color.set( 0xff0000 );
  }
}
animate();

loader.load(
  postit,
  function (gltf) {
    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Scene
    gltf.cameras; // Array<THREE.Camera>

    handleSceneLoaded(gltf)
  },
  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
  },
  function ( error ) {
    console.log(error);
  }
)

function handleSceneLoaded(gltf){
  scene.add(gltf.scene);
  scene.add(camera)

  let blenderCamera = gltf.scene.children[4]
  let cameraInfos = gltf.scene.children[4].children[0]
  let blenderLight = gltf.scene.children[0]
  let materials;


  gltf.scene.traverse( function( object ) {
    objects.push(object)
    if ( object.isMesh ){
      object.receiveShadow = true
      object.castShadow = true
      if( object.material ) {
        object.material.side = THREE.DoubleSide;
        if (object.material.map) object.material.map.encoding = THREE.sRGBEncoding;
        if (object.material.emissiveMap) object.material.emissiveMap.encoding = THREE.sRGBEncoding;
        if (object.material.map || object.material.emissiveMap) object.material.needsUpdate = true;
      }
    }
  })

  console.log(gltf.scene.position)

  // gltf.scene.position.y = 7
  // gltf.scene.position.x = 0
  // gltf.scene.position.z = 15


  objects[2].intensity = 1
  objects[2].castShadow = false
  objects[2].receiveShadow = false
  objects[2].decay = 7
  objects[2].distance = 140

  // objects[4].shadow.radius = 30
  // objects[4].shadow.bias = 0.00001
  // objects[4].shadow.mapSize.width = 2048;
  // objects[4].shadow.mapSize.height = 2048;

  // camera.position.x = -65;
  // camera.position.y = 0;
  // camera.position.z = -10;

  // camera.rotation.z = blenderCamera.rotation.z;
  // camera.rotation.x = blenderCamera.rotation.x;
  // camera.rotation.y = blenderCamera.rotation.y;

  // camera.aspect = cameraInfos.aspect;
  // camera.fov = cameraInfos.fov;
  // camera.far = cameraInfos.far;
  // camera.near = cameraInfos.near;

  // light.castShadow = true;
  // light.position.x = blenderLight.position.x;
  // light.position.y = blenderLight.position.y;
  // light.position.z = blenderLight.position.z;

}