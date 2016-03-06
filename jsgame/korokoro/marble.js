
function Marble(scene, textureName)
{
	this.scene = scene;
	this.textureName = textureName;
	this.mesh = null;

	this.shadow = null;
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

	var geom = new THREE.Geometry();
	geom.vertices.push(new THREE.Vector3(0, 0, 0));
	for (var i = 0; i < 20; i++)
	{
		var v = new THREE.Vector3(radius * 1.2 * Math.cos(2*Math.PI*i/20), 0, -radius * 1.2 * Math.sin(2*Math.PI*i/20));
		geom.vertices.push(v);
	}
	for (var i = 1; i <= 20; i++)
	{
		if (i == 20)
			geom.faces.push(new THREE.Face3(0, i, 1));
		else
			geom.faces.push(new THREE.Face3(0, i, i + 1));
	}
	this.shadow = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25}));
	this.scene.add(this.shadow);
	this.scene.add(this.mesh);
}
