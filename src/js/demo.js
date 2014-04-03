/* Renderer setup */
var width = window.innerWidth;
var height = window.innerHeight;

var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
$('body').append(renderer.domElement);

window.onresize = function(event) {
	width = window.innerWidth;
	height = window.innerHeight;
	camera.aspect = width/height;
	camera.updateProjectionMatrix();
    renderer.setSize(width, height);
};

/* Geometries */
var geometries = {
  'cube': new THREE.CubeGeometry(1, 1, 1),
  'sphere': new THREE.SphereGeometry(1)
};

/* Shaders */
var vertexShaders = {
  vshader1: $('#vertexShader1').html()
};

var fragmentShaders = {
  fshader1: $('#fragmentShader1').html()
};

/* Mesh */
var geometry = new THREE.CubeGeometry(1, 1, 1);
var uniforms = {
  time: { type: "f", value: 1.0 },
  resolution: { type: "v2", value: new THREE.Vector2(width, height) }
};
var material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShaders['vshader1'],
  fragmentShader: fragmentShaders['fshader1']
});
var model = new THREE.Mesh(geometry, material);

camera.position.z = 5;

var beginTime = (new Date()).getTime();
var time = 0;

var demo1 = {};
var demo2 = {};
var demo1_inited = false;
var demo2_inited = false;

var scene = {};

/* Rendering loop */
function render() {
  time = (new Date()).getTime() - beginTime;
  uniforms.time.value = time;

  if (time < 20000.0) {
    if (!demo1_inited) {  // Init
      demo1_inited = true;
	  demo1.numObjects = 10000;
      scene = new THREE.Scene();
	  
	  var cube_size = 0.1;
	  var geom = new THREE.CubeGeometry(cube_size, cube_size, cube_size);
	  var mat = new THREE.MeshBasicMaterial({ 'color': 0xff0000 });
	  var scene_size = 50;
	  for (var i = 0; i < demo1.numObjects; i++) {
		demo1['object' + i] = new THREE.Mesh(geom, mat);
		scene.add(demo1['object' + i]);
		var r = Math.random();
		demo1['object' + i].position.x = (-1 + 2 * r) * scene_size;
		r = Math.random();
		demo1['object' + i].position.y = (-1 + 2 * r) * scene_size;
		r = Math.random();
		demo1['object' + i].position.z = (-1 + 2 * r) * scene_size;
	  }
    }
	// Update
	for (var i = 0; i < demo1.numObjects; i++) {
	    var rem = i % 3;
	    if (rem === 0) {
			demo1['object' + i].rotation.x += 0.05;
	    } else if (rem === 1) {
			demo1['object' + i].rotation.y += 0.05;
	    } else {
			demo1['object' + i].rotation.z += 0.05;
	    }
	
	}

  } else if (time < 40000.0) {
    if (!demo2_inited) {  // Init
      demo2_inited = true;
      // Clear scene
      for (var c in scene.children)
        scene.remove(c);
	  scene = new THREE.Scene();
	  
      demo2.geometry = new THREE.Geometry();
	  for ( i = 0; i < 10000; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = 2000 * Math.random() - 1000;
		vertex.y = 2000 * Math.random() - 1000;
		vertex.z = 2000 * Math.random() - 1000;
		demo2.geometry.vertices.push( vertex );
		}
		demo2.material = new THREE.ParticleSystemMaterial( { size: 35, sizeAttenuation: false, transparent: true, color: 0x000000 } );
		demo2.material.color.setHSL( 1.0, 0.3, 0.7 );
		demo2.particles = new THREE.ParticleSystem( demo2.geometry, demo2.material );
		//demo2.particles.sortParticles = true;
		scene.add( demo2.particles );
    }
  }
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();
