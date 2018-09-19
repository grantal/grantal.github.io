// ThreeScene.js
// This file puts our three.js code into a react component  

import React, { Component } from 'react';
import * as THREE from 'three';

class ThreeScene extends Component{
  componentDidMount(){

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 5, 3500 );
    this.camera.position.z = 2750;

    //ADD SCENE
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x050505 );
    this.scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    //

    var particles = 3000;

    var geometry = new THREE.BufferGeometry();

    // create a generic buffer of binary data (a single particle has 16 bytes of data)

    var arrayBuffer = new ArrayBuffer( particles * 16 );

    // the following typed arrays share the same buffer

    var interleavedFloat32Buffer = new Float32Array( arrayBuffer );
    var interleavedUint8Buffer = new Uint8Array( arrayBuffer );

    //

    var color = new THREE.Color();

    var n = 1000, n2 = n / 2; //
    //var n20 = n / 20; //want most particles within 20 of the egde of the cube

    for ( var i = 0; i < interleavedFloat32Buffer.length; i += 4 ) {

    // position (first 12 bytes)
    // make an array so we can randomly assign x, y and z from the coordinates we make
    let coords = []; 

    // two of the coordinates will be 500 or -500. only the third will vary the full range
    let randSign = Math.random() < 0.5 ? -1 : 1; 
    coords[0] = randSign*n2;
    randSign = Math.random() < 0.5 ? -1 : 1; 
    coords[1] = randSign*n2;
    randSign = Math.random() < 0.5 ? -1 : 1; 
    coords[2] = randSign*(Math.random()*n2);

    // randomly assign coords to x y and z
    coords.sort(() => 0.5 - Math.random())
    let x = coords[0], y = coords[1], z = coords[2];


    interleavedFloat32Buffer[ i + 0 ] = x;
    interleavedFloat32Buffer[ i + 1 ] = y;
    interleavedFloat32Buffer[ i + 2 ] = z;

    // color (last 4 bytes)

    color.setRGB( 0.1, 0.0, 0.9 ); // blue

    var j = ( i + 3 ) * 4;

    interleavedUint8Buffer[ j + 0 ] = color.r * 255;
    interleavedUint8Buffer[ j + 1 ] = color.g * 255;
    interleavedUint8Buffer[ j + 2 ] = color.b * 255;
    interleavedUint8Buffer[ j + 3 ] = 0; // not needed

    }

    var interleavedBuffer32 = new THREE.InterleavedBuffer( interleavedFloat32Buffer, 4 );
    var interleavedBuffer8 = new THREE.InterleavedBuffer( interleavedUint8Buffer, 16 );

    geometry.addAttribute( 'position', new THREE.InterleavedBufferAttribute( interleavedBuffer32, 3, 0, false ) );
    geometry.addAttribute( 'color', new THREE.InterleavedBufferAttribute( interleavedBuffer8, 3, 12, true ) );

    //

    var material = new THREE.PointsMaterial( { size: 15, vertexColors: THREE.VertexColors } );

    this.points = new THREE.Points( geometry, material );
    this.scene.add( this.points );

    // setup the AnimationMixer
    this.mixer = new THREE.AnimationMixer( this.points );

    // ROTATION Animation
    // Rotation should be performed using quaternions, using a QuaternionKeyframeTrack
    // Interpolating Euler angles (.rotation property) can be problematic and is currently not supported
    // set up rotation about x axis

    // first make up rotation
    var xAxis = new THREE.Vector3( 1, 0, 0 );
    var qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, 0 );
    var qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, (Math.PI/2) );
    var quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w] );

    // create an animation sequence with the tracks
    // If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
    var upClip = new THREE.AnimationClip( 'Up', 1, [quaternionKF] );
    // create a ClipAction and set it to stop when finished
    this.upClipAction = this.mixer.clipAction( upClip );
    this.upClipAction.loop = THREE.LoopOnce;
    //this.upClipAction.clampWhenFinished = true;

    qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, -(Math.PI/2) );
    quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w] );

    // create an animation sequence with the tracks
    // If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
    var downClip = new THREE.AnimationClip( 'Down', 1, [quaternionKF] );
    // create a ClipAction and set it to stop when finished
    this.downClipAction = this.mixer.clipAction( downClip );
    this.downClipAction.loop = THREE.LoopOnce;
    //this.downClipAction.clampWhenFinished = true;


    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.mount.appendChild(this.renderer.domElement)

    this.clock = new THREE.Clock();

    window.addEventListener( 'resize', this.onWindowResize, false );

    this.start()
  }

componentWillUnmount(){
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }
onWindowResize = () => {
    // make the canvas match the window
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

stop = () => {
    cancelAnimationFrame(this.frameId)
  }

animate = () => {
   this.renderScene()
   this.frameId = window.requestAnimationFrame(this.animate)
 }

renderScene = () => {
  let delta = this.clock.getDelta();
  if (this.mixer) {
    this.mixer.update(delta);
  }

  this.renderer.render(this.scene, this.camera)
}

rotateUp = () => {
  if (!this.upClipAction.isRunning()){
    this.upClipAction.reset();
    this.upClipAction.play();
  }
}

rotateDown = () => {
  if (!this.downClipAction.isRunning()){
    this.downClipAction.reset();
    this.downClipAction.play();
  }
}

render(){
    return(
      <div
        className="ThreeScene"
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}

export default ThreeScene
