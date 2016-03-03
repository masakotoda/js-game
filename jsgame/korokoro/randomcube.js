
function RandomCube(scene)
{
	this.scene = scene;
}

RandomCube.prototype.Init = function()
{
	var material = new THREE.MeshPhongMaterial({ color: 0xffcccc });
	var geometry = new THREE.CubeGeometry(1, 1, 1); 
	var cubeMesh = new THREE.Mesh(geometry, material); 
	cubeMesh.rotation.x = Math.PI / 5; 
	cubeMesh.rotation.y = Math.PI / 5; 
	cubeMesh.position.x = 0;
	cubeMesh.position.y = 0;
	cubeMesh.position.z = -1.0;
	this.scene.add(cubeMesh);
}
