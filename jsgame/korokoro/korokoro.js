
function Korokoro()
{
	this.c_buttonA = 0;
	this.c_buttonB = 1;
	this.c_buttonX = 2;
	this.c_buttonY = 3;
	this.c_buttonBack = 8;
	this.c_buttonStart = 9;
	this.c_buttonUp = 12;
	this.c_buttonDown = 13;
	this.c_buttonLeft = 14;
	this.c_buttonRight = 15;

	this.scene;
	this.sceneTwin;
	this.renderer;
	this.camera;
	this.cameraPos = { x: 0, y: 1.3333, z: 3.3333 };

	this.gamepad1;
	this.gamepad2;

	this.marble1;
	this.marble2;

	this.raceTrack;
	this.run = false;
	this.time = 0;
}

Korokoro.prototype.onLoadFunc = function() 
{
	// Grab our container div 
	var container = document.getElementById("container"); 

	// Create the Three.js renderer, add it to our div 
	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	this.renderer.setSize(container.offsetWidth, container.offsetHeight);
	this.renderer.shadowMap.enabled = true;
	this.renderer.shadowMap.type = THREE.PCFShadowMap;
	container.appendChild(this.renderer.domElement); 

	// Create a new Three.js scene 
	this.scene = new THREE.Scene(); 

	// Put in a camera 
	this.camera = new THREE.PerspectiveCamera
		(45, container.offsetWidth / container.offsetHeight, 1, 4000);
	this.camera.position.set(this.cameraPos.x, this.cameraPos.y, this.cameraPos.z);

	// Create a directional light to show off the object 
	var light = new THREE.DirectionalLight(0xffffff, 1.5); 
	light.position.set(0, 1, 0);

	//light.castShadow = true; // According to the reference, it is expensive...

	this.scene.add(light); 
	this.sceneTwin = this.scene.clone(); // For now, I'm not placing anything in twin.

	// Create a shaded, texture-mapped cube, objects and add them to the scene 
	var texLoader = new THREE.TextureLoader();

	this.marble1 = new Marble(this.scene, 'images/texture1.png');
	texLoader.load(this.marble1.textureName, function(texture) {
		_game.marble1.Init(texture);
		_game.marble1.SetInitialPos(0.5);
	});

	this.marble2 = new Marble(this.scene, 'images/texture2.png');
	texLoader.load(this.marble2.textureName, function(texture) {
		_game.marble2.Init(texture);
		_game.marble2.SetInitialPos(-0.5);
	});

	this.raceTrack = new RaceTrack(this.scene);
	this.raceTrack.Init();

	//var cube = new RandomCube(this.scene);
	//cube.Init();

	// Don't need to render here. (Textures are not loaded at this point anyway.)
}

Korokoro.prototype.onKeyDownFunc = function(e)
{
	var key = e.keyCode ? e.keyCode : e.which;
	if (key == 99 && this.marble1.outOfControl <= 0) // 10key - 3
		this.marble1.status = Marble.Status.MovingRight;
	else if (key == 97 && this.marble1.outOfControl <= 0) // 10 key - 1
		this.marble1.status = Marble.Status.MovingLeft;
	else if (key == 101 && this.marble1.outOfControl <= 0) // 10 key - 5
		this.marble1.setStatus(Marble.Status.Jump);
	else if (key == 100 && this.marble1.outOfControl <= 0) // 10 key - 4
		this.marble1.setStatus(Marble.Status.JumpLeft);
	else if (key == 102 && this.marble1.outOfControl <= 0) // 10 key - 6
		this.marble1.setStatus(Marble.Status.JumpRight);
	else if (key == "D".charCodeAt(0) && this.marble2.outOfControl <= 0)
		this.marble2.status = Marble.Status.MovingRight;
	else if (key == "A".charCodeAt(0) && this.marble2.outOfControl <= 0)
		this.marble2.status = Marble.Status.MovingLeft;
	else if (key == "W".charCodeAt(0) && this.marble2.outOfControl <= 0)
		this.marble2.setStatus(Marble.Status.Jump);
	else if (key == "Q".charCodeAt(0) && this.marble2.outOfControl <= 0)
		this.marble2.setStatus(Marble.Status.JumpLeft);
	else if (key == "E".charCodeAt(0) && this.marble2.outOfControl <= 0)
		this.marble2.setStatus(Marble.Status.JumpRight);
}

Korokoro.prototype.onKeyUpFunc = function(e)
{
	// In case next key is pressed before releasing the prev key.
	// (e.g. Left down -> Right down -> Left up -> Left down)
	var key = e.keyCode ? e.keyCode : e.which;
	if (key == 32) // Space key
		this.run = true;
	else if (key == 99 && this.marble1.status == Marble.Status.MovingRight) // 10 key - 3
		this.marble1.status = 0;
	else if (key == 97 && this.marble1.status == Marble.Status.MovingLeft) // 10 key - 1
		this.marble1.status = 0;
	else if (key == "D".charCodeAt(0) && this.marble2.status == Marble.Status.MovingRight)
		this.marble2.status = 0;
	else if (key == "A".charCodeAt(0) && this.marble2.status == Marble.Status.MovingLeft)
		this.marble2.status = 0;
}

Korokoro.prototype.scanGamepads = function()
{
	this.gamepad1 = null;
	this.gamepad2 = null;

	var gamepads = navigator.getGamepads();
	if (gamepads)
	{
		if (gamepads.length > 0)
			this.gamepad1 = gamepads[0];

		if (gamepads.length > 1)
			this.gamepad2 = gamepads[1];
	}
}

Korokoro.prototype.isButtonPressed = function(button)
{
	var pressed = button == 1.0;
	if (typeof(button) == "object")
	{
		pressed = button.pressed;
		button = button.value;
	}
	return pressed;
}

Korokoro.prototype.processState = function(m1, m2)
{
	if (m1.mesh && m2.mesh)
	{
		if (m1.outOfControl <= 0 && m2.outOfControl <=0)
		{
			var radius = 0.16;
			var dx = m1.mesh.position.x - m2.mesh.position.x;
			var dy = m1.mesh.position.y - m2.mesh.position.y;
			var dz = m1.mesh.position.z - m2.mesh.position.z;
			var d2 = dx*dx + dy*dy + dz*dz;
			if (d2 - (radius*1.8)*(radius*1.8) <= 0) // Two balls merge for a bit. It looks a little more realistic collision.
			{
				if (m1.offset < m2.offset)
				{
					m1.status = Marble.Status.MovingLeft;
					m2.status = Marble.Status.MovingRight;
				}
				else
				{
					m1.status = Marble.Status.MovingRight;
					m2.status = Marble.Status.MovingLeft;
				}
				m1.outOfControl = Marble.OutOfControlTime.collision;
				m2.outOfControl = Marble.OutOfControlTime.collision;
			}
		}
		else
		{
			if (m1.outOfControl > 0)
			{
				m1.outOfControl--;
				if (m1.outOfControl <= 0)
				{
					m1.status = 0;
					m1.jumpOffset = 0;
				}
			}
			if (m2.outOfControl > 0)
			{
				m2.outOfControl--;
				if (m2.outOfControl <= 0)
				{
					m2.status = 0;
					m2.jumpOffset = 0;
				}
			}
		}
	}
}

Korokoro.prototype.updatePlayer = function(gamepad, marble)
{
	if (marble.status == Marble.Status.Jump)
		marble.jump();
	else if (marble.status == Marble.Status.JumpLeft)
		marble.jumpLeft();
	else if (marble.status == Marble.Status.JumpRight)
		marble.jumpRight();

	if (!gamepad)
	{
		if (marble.status == Marble.Status.MovingRight)
			marble.moveRight();
		else if (marble.status == Marble.Status.MovingLeft)
			marble.moveLeft();
		return;
	}

	var buttons = gamepad.buttons;
	for (var i = 0; i < buttons.length; i++)
	{
		if (this.isButtonPressed(buttons[i]))
		{
			if (marble.outOfControl > 0)
			{
				if (marble.status == Marble.Status.MovingRight)
					marble.moveRight();
				else if (marble.status == Marble.Status.MovingLeft)
					marble.moveLeft();
			}
			else
			{
				if (i == this.c_buttonRight)
					marble.moveRight();
				else if (i == this.c_buttonLeft)
					marble.moveLeft();
				else if (i == this.c_buttonX)
					marble.setStatus(Marble.Status.JumpLeft);
				else if (i == this.c_buttonB)
					marble.setStatus(Marble.Status.JumpRight);
				else if (i == this.c_buttonY)
					marble.setStatus(Marble.Status.Jump);
				else if (i == this.c_buttonUp)
					this.cameraPos.z -= 0.01;
				else if (i == this.c_buttonDown)
					this.cameraPos.z += 0.01;
			}
		}
	}
}

Korokoro.prototype.addGamepad = function(gamepad)
{
	console.log("index: " + gamepad.index);
	console.log("id: " + gamepad.id);
	console.log("buttons.length: " + gamepad.buttons.length);
	console.log("axes.length: " + gamepad.axes.length);
}

Korokoro.prototype.removeGamepad = function(gamepad)
{
	console.log("index: " + gamepad.index);
	console.log("id: " + gamepad.id);
}

Korokoro.prototype.updateStatus = function()
{
	this.scanGamepads();

	this.processState(this.marble1, this.marble2);
	this.updatePlayer(this.gamepad1, this.marble1);
	this.updatePlayer(this.gamepad2, this.marble2);

	if (this.run)
	{
		this.time += 0.05;
		var camPosition = this.raceTrack.GetCameraPos(this.time).position;
		var camFocus = this.raceTrack.GetFocusPos(this.time).position;
		var ballPos1 = this.raceTrack.GetBallPos(this.time, 0.16, this.marble1.offset);
		var ballPos2 = this.raceTrack.GetBallPos(this.time, 0.16, this.marble2.offset);
		if (camFocus == null || camPosition == null)
		{
			this.run = false;
			this.time = 0;
		}
		else
		{
			this.camera.position.set(camPosition.x, camPosition.y, camPosition.z);
			this.camera.lookAt(camFocus);
			if (ballPos1 != null)
			{
				this.marble1.mesh.rotation.x -= ballPos1.velocity.x;
				this.marble1.mesh.rotation.y -= ballPos1.velocity.y;
				this.marble1.mesh.rotation.z -= ballPos1.velocity.z;
				this.marble1.mesh.position.x = ballPos1.position.x;
				this.marble1.mesh.position.y = ballPos1.position.y + this.marble1.jumpOffset;
				this.marble1.mesh.position.z = ballPos1.position.z;

				var shadowPos1 = this.raceTrack.GetBallPos(this.time, 0, this.marble1.offset);
				this.marble1.shadow.position.x = shadowPos1.position.x;
				this.marble1.shadow.position.y = shadowPos1.position.y + 0.01;
				this.marble1.shadow.position.z = shadowPos1.position.z;
				this.marble1.updateShadowScale();
			}
			if (ballPos2 != null)
			{
				this.marble2.mesh.rotation.x -= ballPos2.velocity.x;
				this.marble2.mesh.rotation.y -= ballPos2.velocity.y;
				this.marble2.mesh.rotation.z -= ballPos2.velocity.z;
				this.marble2.mesh.position.x = ballPos2.position.x;
				this.marble2.mesh.position.y = ballPos2.position.y + this.marble2.jumpOffset;
				this.marble2.mesh.position.z = ballPos2.position.z;

				var shadowPos2= this.raceTrack.GetBallPos(this.time, 0, this.marble2.offset);
				this.marble2.shadow.position.x = shadowPos2.position.x;
				this.marble2.shadow.position.y = shadowPos2.position.y + 0.01;
				this.marble2.shadow.position.z = shadowPos2.position.z;
				this.marble2.updateShadowScale();
			}
		}
	}
	else
	{
		//this.camera.position.set(this.cameraPos.x, this.cameraPos.y, this.cameraPos.z);
		//this.camera.lookAt(this.marble1.mesh.position)
	}

	this.renderer.autoClear = false;
	this.renderer.render(this.sceneTwin, this.camera);
	this.renderer.clearDepth();
	this.renderer.render(this.scene, this.camera);
}
