import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import postit from '/src/assets/models/PROD.glb'

const loader = new GLTFLoader();

let scene = new THREE.Scene()
let renderer = new THREE.WebGLRenderer()
let objects = []

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

let camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );


// Light
var light = new THREE.AmbientLight( 0x404040 );
scene.add(light)

// Settings

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

// Controls
let controls = new OrbitControls(camera,renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.maxPolarAngle = Math.PI/2;

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
    gltf.scenes; // Array<THREE.Scene>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object

    handleSceneLoaded(gltf);
  },
  // called while loading is progressing
  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
  },
  // called when loading has errors
  function ( error ) {
    console.log( 'An error happened' );
  }
)

function handleSceneLoaded(gltf){
  scene.add(gltf.scene);
  let blenderCamera = gltf.scene.children[0];
  let blenderLight = gltf.scene.children[1];
  let materials;



  gltf.scene.traverse( function( object ) {
    objects.push(object)
    if ( object.isMesh ){
      object.castShadow = true;
      object.receiveShadow = true;
      if( object.material ) {
        object.material.side = THREE.DoubleSide;
        if (object.material.map) object.material.map.encoding = THREE.sRGBEncoding;
        if (object.material.emissiveMap) object.material.emissiveMap.encoding = THREE.sRGBEncoding;
        if (object.material.map || object.material.emissiveMap) object.material.needsUpdate = true;
      }
    }
  })

  console.log(objects[17])

  camera.position.x = blenderCamera.position.x;
  camera.position.y = blenderCamera.position.y;
  camera.position.z = blenderCamera.position.z;

  camera.aspect = blenderCamera.aspect;
  camera.fov = blenderCamera.fov;
  camera.far = blenderCamera.far;
  camera.near = blenderCamera.near;

  light.castShadow = true;
  light.position.x = blenderLight.position.x;
  light.position.y = blenderLight.position.y;
  light.position.z = blenderLight.position.z;

}