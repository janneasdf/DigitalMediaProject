/* Renderer setup */
var width = 400;
var height = 400;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
$('body').append(renderer.domElement);

/* Shaders */
var vertexShaders = {
  vshader1: $('#vertexShader1').html(),
  vshader2: $('#vertexShader2').html()
};

var fragmentShaders = {
  fshader1: $('#fragmentShader1').html(),
  fshader2: $('#fragmentShader2').html()
};

/* Mesh */
var geometry = new THREE.CubeGeometry(1,1,1);
var uniforms = {
  time: { type: "f", value: 1.0 }, 
  resolution: { type: "v2", value: new THREE.Vector2() } 
};
var material = new THREE.ShaderMaterial({ 
  uniforms: uniforms, 
  vertexShader: vertexShaders['vshader1'],
  fragmentShader: fragmentShaders['fshader1']
});
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

/* Rendering loop */
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1;
  uniforms.time.value += 0.1;
}
render();

/* Shader selecting callbacks */
function onVertexShaderChange() {
  var new_shader_name = $('#vertexShaderSelect').val();
  material.vertexShader = vertexShaders[new_shader_name];
  material.needsUpdate = true;
}

function onFragmentShaderChange() {
  var new_shader_name = $('#fragmentShaderSelect').val();
  material.fragmentShader = fragmentShaders[new_shader_name];
  material.needsUpdate = true;
}