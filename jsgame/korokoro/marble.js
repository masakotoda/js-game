
Marble.Status =
{
	MovingRight: 1,
	MovingLeft: 2,
	Jump: 3,
	JumpRight: 4,
	JumpLeft: 5
}

Marble.OutOfControlTime =
{
	collision: 30,
	jump: 40
}

function Marble(scene, identity, textureName)
{
	this.identity = identity;
	this.scene = scene;
	this.textureName = textureName;
	this.mesh = null;
	this.shadow = null;
	this.offset = 0;
	this.jumpOffset = 0;
	this.status = 0;
	this.outOfControl = 0;
	this.phrase;
	this.phrasePos;
}

Marble.prototype.setPhrase = function(phrase)
{
	this.phrase = phrase;
	this.phrasePos = 0;
}

Marble.prototype.hitTest = function(letters)
{
	for (var i = 0; i < letters.length; i++)
	{
		var radius = 0.16;
		var other = letters[i];
		var dx = this.mesh.position.x - other.mesh.position.x;
		var dy = this.mesh.position.y - other.mesh.position.y;
		var dz = this.mesh.position.z - other.mesh.position.z;
		var d2 = dx*dx + dy*dy + dz*dz;
		if (d2 - (radius*1.8)*(radius*1.8) <= 0) // Two balls merge for a bit. It looks a little more realistic collision.
			return other;
	}
	return null;
}

Marble.prototype.checkLetter = function(letter)
{
	if (this.phrase[this.phrasePos] == letter)
	{
		this.phrasePos++;
		return true;
	}
	else
	{
		return false;
	}
}

Marble.prototype.completed = function()
{
	return (this.phrase.length == this.phrasePos);
}

Marble.prototype.getStatusText = function()
{
	var status = this.identity + ": " + this.phrase.substring(0, this.phrasePos);
	for (var i = 0; i < this.phrase.length - this.phrasePos; i++)
	{
		status += " _";
	}
	return status;
}

Marble.prototype.isJump = function(status)
{
	if (status == Marble.Status.Jump ||
		status == Marble.Status.JumpRight ||
		status == Marble.Status.JumpLeft)
		return true;
	else
		return false;
}

Marble.prototype.isJumping = function()
{
	return this.isJump(this.status);
}

Marble.prototype.isCollidingTo = function(other)
{
	var radius = 0.16;
	var dx = this.mesh.position.x - other.mesh.position.x;
	var dy = this.mesh.position.y - other.mesh.position.y;
	var dz = this.mesh.position.z - other.mesh.position.z;
	var d2 = dx*dx + dy*dy + dz*dz;
	return (d2 - (radius*1.8)*(radius*1.8) <= 0) // Two balls merge for a bit. It looks a little more realistic collision.
}

Marble.prototype.setStatus = function(status)
{
	if (this.outOfControl <= 0)
	{
		if (this.isJump(status))
		{
			this.outOfControl = Marble.OutOfControlTime.jump;
			this.status = status;
		}
	}
}

Marble.prototype.updateShadowScale = function()
{
	if (this.jumpOffset <= 0)
	{
		this.shadow.scale.set(1, 1, 1);
	}
	else
	{
		var v0 = 0.1;
		var g = 0.005;
		var t = Marble.OutOfControlTime.jump / 2;
		var maxJump = -0.5 * g * t * t + v0 * t;
		var ratio = 1 - 0.5 * (this.jumpOffset / maxJump);

		this.shadow.scale.set(ratio, 1, ratio);
	}
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

Marble.prototype.jump = function()
{
	var v0 = 0.1;
	var g = 0.005;
	var t = Marble.OutOfControlTime.jump - this.outOfControl;
	this.jumpOffset = -0.5 * g * t * t + v0 * t;
}

Marble.prototype.jumpLeft = function()
{
	var v0 = 0.1;
	var g = 0.005;
	var t = Marble.OutOfControlTime.jump - this.outOfControl;
	this.jumpOffset = -0.5 * g * t * t + v0 * t;
	this.moveLeftBy(0.02);
}

Marble.prototype.jumpRight = function()
{
	var v0 = 0.1;
	var g = 0.005;
	var t = Marble.OutOfControlTime.jump - this.outOfControl;
	this.jumpOffset = -0.5 * g * t * t + v0 * t;
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

Marble.prototype.init = function(texture)
{
	this.CreateShadow();
	this.scene.add(this.shadow);

	this.CreateMesh(texture);
	this.scene.add(this.mesh);
}

Marble.prototype.setInitialPos = function(x)
{
	this.mesh.position.x = x;
	this.shadow.position.x = x;
	this.shadow.position.y = 0.01;
	this.offset = x;
}
