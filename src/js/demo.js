/* Renderer setup */
var width = document.body.clientWidth-50;
var height = width*(9.0/16.0);

var camera = new THREE.PerspectiveCamera(75, 16.0 / 9.0, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
$('body').append(renderer.domElement);

window.onresize = function(event) {
	width = document.body.clientWidth-50;
	height = width*(9.0/16.0);
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
	  
      var model1 = new THREE.Mesh(new THREE.SphereGeometry(1), material);
      scene.add(model1);
    }


  }

  requestAnimationFrame(render);
  renderer.render(scene, camera);

}
render();
