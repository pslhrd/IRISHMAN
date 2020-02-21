import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import postit from '/src/assets/models/PROD3.glb'

const loader = new GLTFLoader()

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
camera.position.y = 0
camera.position.z = -10
camera.rotation._x = 1.57
camera.rotation._y = -0.04
camera.rotation._z = 1.60
camera.far = 1000

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
renderer.pixelRatio = 2
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
}
animate();

loader.load(
  // resource URL
  postit,
  // called when the resource is loaded
  function (gltf) {
    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Scene
    gltf.cameras; // Array<THREE.Camera>

    handleSceneLoaded(gltf)
  },
  // called while loading is progressing
  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
  },
  // called when loading has errors
  function ( error ) {
    console.log(error);
  }
)

window.addEventListener('click', function(){
  console.log(camera)
})

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

  console.log(gltf.scene)


  objects[2].intensity = 2
  objects[2].castShadow = false
  objects[2].receiveShadow = false
  objects[2].decay = 10
  objects[2].distance = 200

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