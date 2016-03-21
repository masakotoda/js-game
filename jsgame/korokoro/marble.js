
Marble.Status =
{
	normal: 0,
	moveRight: 1,
	moveLeft: 2,
	jump: 3,
	jumpRight: 4,
	jumpLeft: 5
}

Marble.OutOfControlTime =
{
	collision: 30,
	jump: 40
}

Marble.getY = function(t)
{
	var v0 = 0.1;
	var g = 0.005;
	return (-0.5 * g * t * t + v0 * t);
}

function Marble(scene, identity)
{
	this.identity = identity;
	this.scene = scene;
	this.mesh = null;
	this.shadow = null;
	this.offset = 0;
	this.jumpOffset = 0;
	this.status = Marble.Status.normal;
	this.outOfControl = 0;
	this.phrase = "";
	this.phrasePos = 0;
}

Marble.prototype.init = function(texture)
{
	this.createShadow();
	this.scene.add(this.shadow);

	this.createMesh(texture);
	this.scene.add(this.mesh);
}

Marble.prototype.destroy = function()
{
	this.scene.remove(this.mesh);
	this.scene.remove(this.shadow);
}

Marble.prototype.setInitialPos = function(x)
{
	this.mesh.position.x = x;
	this.shadow.position.x = x;
	this.shadow.position.y = 0.01;
	this.offset = x;
}

Marble.prototype.setPhrase = function(phrase)
{
	this.phrase = phrase;
	this.phrasePos = 0;
}

Marble.prototype.isCorrectLetter = function(letterBox)
{
	var next = this.phrase[this.phrasePos];
	if (letterBox.checkLetter(next))
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
	if (status == Marble.Status.jump ||
		status == Marble.Status.jumpRight ||
		status == Marble.Status.jumpLeft)
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

Marble.prototype.getCollidingLetter = function(letters)
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

Marble.prototype.clearStatus = function()
{
	this.status = Marble.Status.normal;
}

Marble.prototype.setStatus = function(status, force)
{
	if (this.outOfControl <= 0 || force)
	{
		this.status = status;
	}
}

Marble.prototype.startJumping = function(status)
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

Marble.prototype.moveLeftBy = function(delta)
{
	this.offset -= delta;
	if (this.offset < -0.9)
		this.offset = -0.9;
}

Marble.prototype.moveLeft = function()
{
	if (this.outOfControl > 0)
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

Marble.prototype.getJumpY = function()
{
	var t = Marble.OutOfControlTime.jump - this.outOfControl;
	return Marble.getY(t);
}

Marble.prototype.jump = function()
{
	this.jumpOffset = this.getJumpY();
}

Marble.prototype.jumpLeft = function()
{
	this.jumpOffset = this.getJumpY();
	this.moveLeftBy(0.02);
}

Marble.prototype.jumpRight = function()
{
	this.jumpOffset = this.getJumpY();
	this.moveRightBy(0.02);
}

Marble.prototype.createMesh = function(texture)
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

Marble.prototype.createShadow = function()
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

Marble.prototype.getTexture = function()
{
	return this.mesh.material.map;
}

Marble.prototype.tick = function()
{
	switch (this.status)
	{
	case Marble.Status.jump:
		this.jump();
		break;
	case Marble.Status.jumpLeft:
		this.jumpLeft();
		break;
	case Marble.Status.jumpRight:
		this.jumpRight();
		break;
	case Marble.Status.moveRight:
		this.moveRight();
		break;
	case Marble.Status.moveLeft:
		this.moveLeft();
		break;
	}
}

Marble.prototype.updateRotation = function(velocity)
{
	this.mesh.rotation.x -= velocity.x;
	this.mesh.rotation.y -= velocity.y;
	this.mesh.rotation.z -= velocity.z;
}

Marble.prototype.updatePosition= function(position)
{
	this.mesh.position.x = position.x;
	this.mesh.position.y = position.y + this.jumpOffset;
	this.mesh.position.z = position.z;
}

Marble.prototype.updateShadow = function(position)
{
	this.shadow.position.x = position.x;
	this.shadow.position.y = position.y + 0.01;
	this.shadow.position.z = position.z;

	if (this.jumpOffset <= 0)
	{
		this.shadow.scale.set(1, 1, 1);
	}
	else
	{
		var t = Marble.OutOfControlTime.jump / 2;
		var maxJump = Marble.getY(t);
		var ratio = 1 - 0.5 * (this.jumpOffset / maxJump);

		this.shadow.scale.set(ratio, 1, ratio);
	}
}
