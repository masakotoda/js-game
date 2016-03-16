
function LetterBox(scene, letter)
{
	this.scene = scene;
	this.letter = letter;
	this.mesh;
	this.shadow;
	this.spinTimer = 0;
	this.removed = false;
}

LetterBox.prototype.init = function(texture)
{
	var material = new THREE.MeshPhongMaterial({ map: texture });
	var geometry = new THREE.CubeGeometry(0.25, 0.25, 0.25); 
	this.mesh = new THREE.Mesh(geometry, material); 
	this.mesh.rotation.x = Math.PI / 5; 
	this.mesh.rotation.y = Math.PI / 5; 
	this.mesh.position.x = 0;
	this.mesh.position.y = 0;
	this.mesh.position.z = -1.0;
	this.scene.add(this.mesh);

	this.createShadow();
	this.scene.add(this.shadow);
}

LetterBox.prototype.createShadow = function()
{
	var radius = 0.25;
	var segment = 4;

	var material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 });
	var geometry = new THREE.Geometry();

	for (var i = 0; i < segment; i++)
	{
		var vertex = new THREE.Vector3(
				radius * Math.cos(2*Math.PI*i/segment), 
				0, 
				-radius * Math.sin(2*Math.PI*i/segment));
		geometry.vertices.push(vertex);
	}
	geometry.vertices.push(new THREE.Vector3(0, 0, 0));

	for (var i = 0; i < segment - 1; i++)
	{
		geometry.faces.push(new THREE.Face3(segment, i, i + 1));
	}
	geometry.faces.push(new THREE.Face3(segment, segment - 1, 0));

	this.shadow = new THREE.Mesh(geometry, material);
}

LetterBox.prototype.startSpin = function()
{
	this.spinTimer = 20;
	this.mesh.rotation.y = 0;
}

LetterBox.prototype.isSpinning = function()
{
	return this.spinTimer > 0;
}

LetterBox.prototype.tick = function()
{
	if (this.spinTimer > 0)
	{
		this.spinTimer--;
		this.mesh.rotation.y += Math.PI / 5;
	}
}

LetterBox.prototype.removeFromScene = function(texture)
{
	this.removed = true;
	this.mesh.material.map = texture;
	this.mesh.material.needsUpdate = true;
}

LetterBox.prototype.destroy = function()
{
	this.scene.remove(this.mesh);
	this.scene.remove(this.shadow);
	delete this.mesh;
	delete this.shadow;
	delete this;
}

LetterBox.prototype.setPos = function(pos, shadowPos)
{
	this.mesh.position.x = pos.x;
	this.mesh.position.y = pos.y;
	this.mesh.position.z = pos.z;
	this.shadow.position.x = shadowPos.position.x;
	this.shadow.position.y = shadowPos.position.y + 0.05;
	this.shadow.position.z = shadowPos.position.z;
}
