var width = 400;
var height = 400;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
$('body').append(renderer.domElement);

var geometry = new THREE.CubeGeometry(1,1,1);
var uniforms = {
  time: { type: "f", value: 1.0 }, 
  resolution: { type: "v2", value: new THREE.Vector2() } 
};
var material = new THREE.ShaderMaterial({ 
  uniforms: uniforms, 
  vertexShader: $('#vertexShader').html(),
  fragmentShader: $('#fragmentShader').html()
});
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1;
  uniforms.time.value += 0.1;
}
render();

function onVertexShaderChange() {
  
}

function onFragmentShaderChange() {
  
}