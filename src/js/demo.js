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

  if (time < 20000.0 / 10) {
    if (!demo1_inited) {  // Init
      demo1_inited = true;
      scene = new THREE.Scene();
	  	  
	  var geom = new THREE.SphereGeometry(1);
	  for (var i = 0; i < 1000; i++) {
		demo1['sphere' + i] = new THREE.Mesh(geom, material);
		scene.add(demo1['sphere' + i]);
		demo1['sphere' + i].position.x = i * 0.1;
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
