import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import postit from '/src/assets/models/PROD7.gltf'
import SplitText from '/src/js/splittext'

const menu = document.querySelector('.menu')
const close = document.querySelector('.close')
const launch = document.querySelector('.loader_btn')
const intro = document.querySelector('.loader')
const raycaster = new THREE.Raycaster();

const customCursor = document.querySelector('.cursor');
const hoverStates = document.querySelector('.hover-states');

let mouseX = 0;
let mouseY = 0;
let ballX = 0;
let ballY = 0;
let speed = 0.1;

function cursorAnimate() {
  let distX = mouseX - ballX
  let distY = mouseY - ballY

  ballX = ballX + (distX * speed)
  ballY = ballY + (distY * speed)

  gsap.to(customCursor, {left: mouseX + 'px',duration: 0.6,ease: 'power3.out'})
  gsap.to(customCursor, {top: mouseY + 'px',duration: 0.6,ease: 'power3.out'})

  gsap.to(hoverStates, {left: mouseX + 'px',duration: 0.6,ease: 'power3.out'})
  gsap.to(hoverStates, {top: mouseY + 'px',duration: 0.6,ease: 'power3.out'})
}

document.addEventListener('mousemove',function(e){
  mouseX = e.pageX
  mouseY = e.pageY
  cursorAnimate()
})

cursorAnimate()


function homeLaunch() {
  const tl = gsap.timeline()

  tl
  .to('.line', {scaleX:0, duration:1.3, ease:"power3.out"})
  .to('.downloader', {autoAlpha:0, duration: 0.6})
  .fromTo('.loader_logo',{y:'20%', autoAlpha:0}, {autoAlpha:1, duration:1.6, y:'0%', ease:"power3.out", stagger:0.1}, 2)
  .to('.loader_text span', {duration:1, y:'0%', ease:"power3.out", stagger:0.1}, "-=1")
  .fromTo('.loader_btn',{y:'20%', autoAlpha:0}, {autoAlpha:1, duration:1.6, y:'0%', ease:"power3.out"},"-=0.8")

  launch.addEventListener('click', function(){
    tl
    .set(objects[2], {intensity:0})
    .to(intro, {autoAlpha:0, duration: 1.15, ease:'power3.out', onComplete:done})
    .from(camera.position, {x:-150, duration:5, ease:'power3.inOut'}, "-=2")
    .to(objects[2], {intensity:1, duration:3, ease:'power3.inOut'}, "-=3")
    .to('.introduction', {autoAlpha:1, duration:1.6, ease:'power3.out'}, 8.5)
    .to('.introduction span', {y:'0%', duration:1, ease:'power3.out', stagger:0.1}, "-=1")
    .to('.introduction span', {y:'100%', duration:1, ease:'power3.in', stagger:0.1}, "+=2")
    .to('.introduction', {autoAlpha:0, duration:1, ease:'power3.in'},"-=1")
    const done = function(){intro.style = 'diplay:none'}
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
// let controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.05;
// controls.maxPolarAngle = Math.PI;

// Animate
function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  cameraLookingAt.set(
    lerp(cameraLookingAt.x, mouse.x*9 + 160, 0.05),
    lerp(cameraLookingAt.y, 1 - mouse.y*2, 0.05),10
  )
  camera.lookAt(cameraLookingAt)
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
    const loadingPercent = ( xhr.loaded / xhr.total * 100 )
    console.log(loadingPercent)
    gsap.to('.line', {width:loadingPercent + '%', duration:1, ease:'power3.out'})
  },
  function ( error ) {
    console.log(error);
  }
)

function handleSceneLoaded(gltf){
  homeLaunch()
  scene.add(gltf.scene)
  scene.add(camera)
  var raycaster = new THREE.Raycaster()
  var mouseVector = new THREE.Vector3()
  var selectedObject = null
  window.addEventListener( "mousemove", onDocumentMouseMove, false )

  function getIntersects( x, y ) {

    x = ( x / window.innerWidth ) * 2 - 1
    y = - ( y / window.innerHeight ) * 2 + 1

    mouseVector.set( x, y, 0.5 )
    raycaster.setFromCamera( mouseVector, camera )

    return raycaster.intersectObject( scene, true )

  }

  function onDocumentMouseMove( event ) {

    event.preventDefault();
    if ( selectedObject ) {
      selectedObject = null;
    }

    var intersects = getIntersects( event.layerX, event.layerY );
    if ( intersects.length > 0 ) {
      var res = intersects.filter( function ( res ) {
        return res && res.object
      } )[0]
      if ( res && res.object ) {
        selectedObject = res.object
        if (selectedObject == objects[24]) {
          document.querySelector('.critics').classList.add('active')
        } else {
          document.querySelector('.critics').classList.remove('active')
        }
        if (selectedObject == objects[27]) {
          document.querySelector('.context').classList.add('active')
        } else {
          document.querySelector('.context').classList.remove('active')
        }
        if (selectedObject == objects[28]) {
          document.querySelector('.synopsis').classList.add('active')
        } else {
          document.querySelector('.synopsis').classList.remove('active')
        }
        if (selectedObject == objects[25]) {
          document.querySelector('.perso_1').classList.add('active')
        } else {
          document.querySelector('.perso_1').classList.remove('active')
        }
        if (selectedObject == objects[23]) {
          document.querySelector('.perso_3').classList.add('active')
        } else {
          document.querySelector('.perso_3').classList.remove('active')
        }
        if (selectedObject == objects[29]) {
          document.querySelector('.perso_2').classList.add('active')
        } else {
          document.querySelector('.perso_2').classList.remove('active')
        }
      }
    }
  }

  let blenderCamera = gltf.scene.children[5]
  let cameraInfos = gltf.scene.children[5].children[0]
  let blenderLight = gltf.scene.children[1]
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
  console.log(objects)


  objects[4].intensity = 1
  objects[4].castShadow = false
  objects[4].receiveShadow = false
  objects[4].decay = 7
  objects[4].distance = 140

}