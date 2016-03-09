
Marble.Status =
{
    MovingRight: 1,
    MovingLeft: 2
}

function Marble(scene, textureName)
{
	this.scene = scene;
	this.textureName = textureName;
	this.mesh = null;
	this.shadow = null;
	this.offset = 0;
	this.status = 0;
	this.outOfControl = 0;
}

Marble.prototype.moveLeftBy = function(delta)
{
	this.offset -= delta;
	if (this.offset < -0.9)
		this.offset = -0.9;
}

Marble.prototype.moveLeft = function()
{
	if (this.outOfControl)
		this.moveLeftBy(this.outOfControl * 0.0015);
	else
		this.moveLeftBy(0.02);
}

Marble.prototype.moveRightBy = function(delta)
{
	this.offset += delta;
	if (this.offset > 0.9)
		this.offset = 0.9;
}

Marble.prototype.moveRight = function()
{
	if (this.outOfControl > 0)
		this.moveRightBy(this.outOfControl * 0.0015);
	else
		this.moveRightBy(0.02);
}

Marble.prototype.CreateMesh = function(texture)
{
	var radius = 0.16;
	var segment = 32;

	var material = new THREE.MeshPhongMaterial({ map: texture });
	var geomBall = new THREE.SphereGeometry(radius, segment, segment);
	this.mesh = new THREE.Mesh(geomBall, material);
	this.mesh.rotation = 0;
	this.mesh.position.x = 0;
	this.mesh.position.y = radius;
	this.mesh.castShadow = true;
	this.mesh.receiveShadow = false;
}

Marble.prototype.CreateShadow = function()
{
	var radius = 0.20;
	var segment = 32;

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

Marble.prototype.Init = function(texture)
{
	this.CreateShadow();
	this.scene.add(this.shadow);

	this.CreateMesh(texture);
	this.scene.add(this.mesh);
}

Marble.prototype.SetInitialPos = function(x)
{
	this.mesh.position.x = x;
	this.shadow.position.x = x;
	this.shadow.position.y = 0.01;
	this.offset = x;
}
