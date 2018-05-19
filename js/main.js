var container;

var camera, scene, renderer;

var uniforms;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


init();
animate();

function init() {

    container = document.createElement( "div" );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 250;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );

    // uniforms for shaders

    uniforms = {
        uColor:     { value: new THREE.Color( 0x5e90e0 ) },
        uDropoff:   { value: 4.0 },
        uTick:      { value: 1.0 },
    };


    // model

    var manager = new THREE.LoadingManager();
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + "% downloaded" );
        }
    };

    var onError = function ( xhr ) {
    };

    var loader = new THREE.OBJLoader( manager );
    // load shaders, then load object
    ShaderLoader("glsl/cube.vert", "glsl/scatter.frag",
        function (vertex, fragment) {
            var shaderMaterial = new THREE.ShaderMaterial( {
                uniforms: uniforms,
                vertexShader:vertex,
                fragmentShader:fragment
            });

            loader.load( "models/cube.obj", function ( object ) {
                // we need to get the geomery of the object3D so we can add our material to it
                var geometry = object.children[0].geometry;
                let shadeMesh = new THREE.Mesh(geometry, shaderMaterial);
                shadeMesh.scale.set(50,50,50);
                scene.add(shadeMesh);
            }, onProgress, onError );
        }
    );

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( "mousemove", onDocumentMouseMove, false );

    //

    window.addEventListener( "resize", onWindowResize, false );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;

}

//

function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {

    uniforms.uTick.value = (Date.now()/100) % 10; 

    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    renderer.render( scene, camera );

}

