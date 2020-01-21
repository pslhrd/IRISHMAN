import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import postit from '/src/assets/models/PROD.glb'

const loader = new GLTFLoader();

var scene = new THREE.Scene()
var renderer = new THREE.WebGLRenderer()
var objects = []

renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild(renderer.domElement)
renderer.outputEncoding = THREE.sRGBEncoding

let camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
var light = new THREE.PointLight( 0xff0000, 1, 100 );

window.addEventListener( 'resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}, false );

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
animate();

loader.load(
  // resource URL
  postit,
  // called when the resource is loaded
  function ( gltf ) {

    gltf.animations; // Array<THREE.AnimationClip>

    gltf.scene; // THREE.Scene

    gltf.scenes; // Array<THREE.Scene>

    gltf.cameras; // Array<THREE.Camera>

    gltf.asset; // Object

    handleSceneLoaded( gltf );

  },
  // called while loading is progressing
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  },
  // called when loading has errors
  function ( error ) {

    console.log( 'An error happened' );

  }
)

function handleSceneLoaded(gltf){
  scene.add(gltf.scene);
  let result;
  let blenderCamera = gltf.scene.children[0];
  let blenderLight = gltf.scene.children[1];
  console.log(gltf.scene)

  gltf.scene.traverse( function( object ) {
    if ( object.isMesh ) objects.push( object );
    if ( object.isMesh ) objects.castShadow = true;
  } )

  console.log(objects)
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