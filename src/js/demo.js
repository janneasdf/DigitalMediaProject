/* Renderer setup */
var width = window.innerWidth;
var height = window.innerHeight;

var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 3000);

var renderer = new THREE.WebGLRenderer({ clearAlpha: 1 });
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

  if (time < 0.0) {
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
	  scene.fog = new THREE.FogExp2( 0x000000, 0.001 );
	  
      demo2.geometry = new THREE.Geometry();
	  demo2.colors = [];
	  for (var i = 0; i < 5000; i ++ ) {
			var vertex = new THREE.Vector3();
			vertex.x = 2000 * Math.random() - 1000;
			vertex.y = 2000 * Math.random() - 1000;
			vertex.z = 2000 * Math.random() - 1000;
			vertex.velocity = new THREE.Vector3(0,-Math.random(),0);
			demo2.geometry.vertices.push( vertex );
			demo2.colors[i] = new THREE.Color( 0xffffff );
			demo2.colors[i].setHSL( ( vertex.y + 1000 ) / 2000, 1, 0.5 );
		}
		demo2.geometry.colors = demo2.colors;
		demo2.material = new THREE.ParticleSystemMaterial( { map: THREE.ImageUtils.loadTexture(
    "../images/particle.png"), size: 35, sizeAttenuation: false, transparent: true, vertexColors: true, blending: THREE.AdditiveBlending } );
		demo2.material.color.setHSL( 1.0, 0.3, 0.7 );
		demo2.particles = new THREE.ParticleSystem( demo2.geometry, demo2.material );
		demo2.particles.sortParticles = true;
		scene.add( demo2.particles );
    }
	camera.position.z = 100*Math.sin(time/2000.0);
	demo2.particles.rotation.x += 0.01;
	demo2.particles.rotation.y -= 0.01;
	var temp = 5000;
	while(temp--){
		var par = demo2.geometry.vertices[temp];
		if (par.y < -1000) {
			par.y = 1000;
			par.velocity.y = 0;
		}
		if(par.x < -1000){
			par.x = 1000;
			par.velocity.x = 0;
		}
		par.velocity.x -= Math.random() * 0.3;
		par.velocity.y -= Math.random() * 0.3;
		par.x += par.velocity.x;
		par.y += par.velocity.y;
	}
	demo2.particles.geometry.__dirtyVertices =true;
  }
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();
