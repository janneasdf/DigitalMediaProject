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

camera.position.x = 5;
camera.position.z = 5;
camera.position.y = 5;
camera.up = new THREE.Vector3(0, 1, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var beginTime = (new Date()).getTime();
var time = 0;

var demo1 = {};
var demo2 = {};
var demo1_inited = false;
var demo2_inited = false;

var scene = {};

function makeCubes(cube_array, geometry, cube_size, depth, origin) {
  if (depth === 0) return;
  if (depth === 1) {
    for (var i = 0; i < 8; i++) {
      var color_factor = i * 1.0 / 7.0 + 0.1;
      var r = 0.5 + color_factor * 0.5;
      var g = color_factor;
      var b = color_factor;
      var color = new THREE.Color(r, g, b);
      var mat = new THREE.MeshBasicMaterial({ 'color': color })

      var c = new THREE.Mesh(geometry, mat);
      var x_factor = i % 2;
      var y_factor = i < 4 ? 1 : 0;  // does cube go top or bottom
      var z_factor = (i % 4) < 2 ? 1 : 0;
      c.position.x = origin.x + x_factor * cube_size;
      c.position.y = origin.y + y_factor * cube_size;
      c.position.z = origin.z + z_factor * cube_size;

      cube_array.push(c);
    }

  }
  else {
    for (var i = 0; i < 8; i++) {
      var x_factor = i % 2;
      var y_factor = i < 4 ? 1 : 0;
      var z_factor = (i % 4) < 2 ? 1 : 0;
      var x_displacement = cube_size * ((x_factor * 2) - 1) / 2;
      var y_displacement = cube_size * ((y_factor * 2) - 1) / 2;
      var z_displacement = cube_size * ((z_factor * 2) - 1) / 2;
      var o = new THREE.Vector3(origin.x + x_displacement, origin.y + y_displacement, origin.z + z_displacement);
      makeCubes(cube_array, geometry, cube_size / 2, depth - 1, o);
    }
  }
}

function initDemo1Stage(demo1, scene, numStage) {
  var depth = numStage;
  var cube_original_size = 1.0;
  var cube_size = cube_original_size;
  for (var i = 0; i < depth - 1; i++) cube_size /= 2;
  var geom = new THREE.CubeGeometry(cube_size, cube_size, cube_size);

  demo1.cubes = []
  var origin = new THREE.Vector3(0, 0, 0);
  makeCubes(demo1.cubes, geom, cube_original_size, depth, origin); // create all the cubes recursively
  for (var i = 0; i < demo1.cubes.length; i++) {
    demo1.cubes[i].userData = {};
    demo1.cubes[i].userData.original_pos = new THREE.Vector3(0, 0, 0);
    demo1.cubes[i].userData.original_pos.copy(demo1.cubes[i].position);
    scene.add(demo1.cubes[i]);
  }
}

/* Rendering loop */
function render() {
  time = (new Date()).getTime() - beginTime;
  uniforms.time.value = time;

  if (time < 12000.0) {  // Demo 1
    if (!demo1_inited) {  // Init
      demo1_inited = true;
      scene = new THREE.Scene();

      demo1.stage_duration = 3000.0;  // how long a stage lasts

      demo1.stage = 1;

      for (var c in scene.children)
        scene.remove(c);
      scene = new THREE.Scene();
      initDemo1Stage(demo1, scene, demo1.stage);
    }
    // Update
    for (var i = 1; i < 4; i++) {   // stage update
      if (demo1.stage === i && time > i * demo1.stage_duration) {
        demo1.stage = i + 1;
        for (var c in scene.children)
          scene.remove(c);
        scene = new THREE.Scene();
        initDemo1Stage(demo1, scene, demo1.stage);
      }
    }
    // Cube position update
    var amplitude = 1.5;
    var displacement_r = 1.0 + (amplitude * (1.0 - Math.cos(time / demo1.stage_duration * Math.PI * 2)));
    for (var i = 0; i < demo1.cubes.length; i++) {
      demo1.cubes[i].position.copy(demo1.cubes[i].userData.original_pos);
      demo1.cubes[i].position.multiplyScalar(displacement_r);
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
