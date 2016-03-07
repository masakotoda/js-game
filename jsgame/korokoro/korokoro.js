
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

Korokoro.prototype.onKeyUpFunc = function(e)
{
	var key = e.keyCode ? e.keyCode : e.which;
	if (key == 32) // Space key
		this.run = true;
	else if (key == 38) // Up
		this.cameraPos.z -= 0.01;
	else if (key == 40) // Down
		this.cameraPos.z += 0.01;
	else if (key == 37) // Left
		this.cameraPos.x -= 0.01;
	else if (key == 39) // Right
		this.cameraPos.x += 0.01;
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

Korokoro.prototype.updatePlayer = function(gamepad, marble)
{
	if (!gamepad)
		return;

	var buttons = gamepad.buttons;
	for (var i = 0; i < buttons.length; i++)
	{
		if (this.isButtonPressed(buttons[i]))
		{
			marble.mesh.rotation.x -= 0.05;
			if (i == this.c_buttonRight)
				marble.mesh.position.x -= 0.01;
			else if (i == this.c_buttonLeft)
				marble.mesh.position.x += 0.01;
			else if (i == this.c_buttonA)
				marble.mesh.position.z -= 0.01;
			else if (i == this.c_buttonB)
				marble.mesh.position.z += 0.01;
			else if (i == this.c_buttonUp)
				this.cameraPos.z -= 0.01;
			else if (i == this.c_buttonDown)
				this.cameraPos.z += 0.01;
			else if (i == this.c_buttonX)
				this.cameraPos.x -= 0.01;
			else if (i == this.c_buttonY)
				this.cameraPos.x += 0.01;
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

	this.updatePlayer(this.gamepad1, this.marble1);
	this.updatePlayer(this.gamepad2, this.marble2);

	if (this.run)
	{
		this.time += 0.05;
		var camPosition = this.raceTrack.GetCameraPos(this.time).position;
		var camFocus = this.raceTrack.GetFocusPos(this.time).position;
		var ballPos1 = this.raceTrack.GetBallPos(this.time, 0.16, 0.5);
		var ballPos2 = this.raceTrack.GetBallPos(this.time, 0.16, -0.5);
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
				this.marble1.mesh.position.y = ballPos1.position.y;
				this.marble1.mesh.position.z = ballPos1.position.z;

				var shadowPos1 = this.raceTrack.GetBallPos(this.time, 0, 0.5);
				this.marble1.shadow.position.x = shadowPos1.position.x;
				this.marble1.shadow.position.y = shadowPos1.position.y + 0.01;
				this.marble1.shadow.position.z = shadowPos1.position.z;
			}
			if (ballPos2 != null)
			{
				this.marble2.mesh.rotation.x -= ballPos2.velocity.x;
				this.marble2.mesh.rotation.y -= ballPos2.velocity.y;
				this.marble2.mesh.rotation.z -= ballPos2.velocity.z;
				this.marble2.mesh.position.x = ballPos2.position.x;
				this.marble2.mesh.position.y = ballPos2.position.y;
				this.marble2.mesh.position.z = ballPos2.position.z;

				var shadowPos2= this.raceTrack.GetBallPos(this.time, 0, -0.5);
				this.marble2.shadow.position.x = shadowPos2.position.x;
				this.marble2.shadow.position.y = shadowPos2.position.y + 0.01;
				this.marble2.shadow.position.z = shadowPos2.position.z;
			}
		}
	}
	else
	{
		//this.camera.position.set(this.cameraPos.x, this.cameraPos.y, this.cameraPos.z);
		//this.camera.lookAt(this.marble1.mesh.position)
	}

	//this.renderer.clearDepth();
	this.renderer.autoClear = false;
	this.renderer.render(this.sceneTwin, this.camera);
	this.renderer.clearDepth();
	this.renderer.render(this.scene, this.camera);
}
