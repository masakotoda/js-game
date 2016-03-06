
function Marble(scene, textureName)
{
	this.scene = scene;
	this.textureName = textureName;
	this.mesh = null;
}

Marble.prototype.Init = function(texture)
{
	var radius = 0.16;
	var segment = 32;
	var material = new THREE.MeshPhongMaterial({ map: texture });
	var geometry = new THREE.SphereGeometry(radius, segment, segment);
	this.mesh = new THREE.Mesh(geometry, material);
	this.mesh.rotation = 0;
	this.mesh.position.x = 0;
	this.mesh.position.y = radius;
	this.mesh.castShadow = true;
	this.mesh.receiveShadow = false;
	this.scene.add(this.mesh);
}
