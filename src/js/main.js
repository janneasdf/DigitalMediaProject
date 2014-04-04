/* Renderer setup */
var width = 400;
var height = 400;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
$('body').append(renderer.domElement);

/* Geometries */
var geometries = {
  'cube': new THREE.CubeGeometry(2, 2, 2),
  'sphere': new THREE.SphereGeometry(1.5),
  'cylinder': new THREE.CylinderGeometry(1, 1, 3, 32)
};

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
var geometry = geometries['cube'];
var uniforms = {
  time: { type: "f", value: 1.0 },
  resolution: { type: "v2", value: new THREE.Vector2() }
};
var material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShaders['vshader1'],
  fragmentShader: fragmentShaders['fshader1']
});
var model = new THREE.Mesh(geometry, material);
scene.add(model);

camera.position.z = 5;

/* Rendering loop */
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  uniforms.time.value += 0.1;

}
render();

/* Selection callbacks */
function onGeometryChange() {
  var geometry_name = $('#geometrySelect').val();
  scene.remove(model);
  model = new THREE.Mesh(geometries[geometry_name], material);
  scene.add(model);
}

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

// http://stackoverflow.com/questions/11060734/how-to-rotate-a-3d-object-on-axis-three-js
function rotateAroundWorldAxis( object, axis, radians ) {
    var rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationAxis( axis.normalize(), radians );
    rotationMatrix.multiply( object.matrix );
    object.matrix = rotationMatrix;
    object.rotation.setFromRotationMatrix( object.matrix );
}


var model_being_dragged = false;
var last_mouse_pos_x = 0;
var last_mouse_pos_y = 0;
function onModelMouseDown() {
  model_being_dragged = true;
}
function onModelMouseUp() {
  model_being_dragged = false;
}
function onMouseMove(e) {
  if (model_being_dragged) {
    var delta_x = 0.01 * (e.screenX - last_mouse_pos_x);
	  var delta_y = 0.01 * (e.screenY - last_mouse_pos_y);
    rotateAroundWorldAxis(model, new THREE.Vector3(0, 1, 0), delta_x);
    rotateAroundWorldAxis(model, new THREE.Vector3(1, 0, 0), delta_y);
  }
  last_mouse_pos_x = e.screenX;
  last_mouse_pos_y = e.screenY;
}

renderer.domElement.onmousedown = onModelMouseDown;
document.onmouseup = onModelMouseUp;
document.onmousemove = onMouseMove;