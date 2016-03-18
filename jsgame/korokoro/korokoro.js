
// Constructor
function Korokoro()
{
	this.scene;
	this.sceneTwin;
	this.renderer;
	this.light;
	this.camera;
	this.cameraPos = { x: 0, y: 1.3333, z: 3.3333 };

	this.gamepad1;
	this.gamepad2;

	this.marble1;
	this.marble2;
	this.titleText;
	this.letters = [];
	this.letterTextures = [];

	this.raceTrack;
	this.run = false;
	this.time = 0;

	this.then;
}

// Enums / constants
Korokoro.Button =
{
	A: 0,
	B: 1,
	X: 2,
	Y: 3,
	Back: 8,
	Start: 9,
	Up: 12,
	Down: 13,
	Left: 14,
	Right: 15
}

Korokoro.Const =
{
	msecPerFrame: 12,
	imagePath: 'images/',
	alphabet: 26
}

// Static functions, callback functions
Korokoro.getRandom = function(min, max)
{
  return Math.random() * (max - min) + min;
}

Korokoro.getRandomInt = function(min, max)
{
  return Math.floor(Math.random() * (max - min)) + min;
}

Korokoro.getRandomIntInclusive = function(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

Korokoro.size = function(obj)
{
	var size = 0, key;
	for (key in obj)
	{
		if (obj.hasOwnProperty(key))
			size++;
	}
	return size;
}

Korokoro.onLetterTextureLoaded = function(texture)
{
	var n = texture.image.currentSrc.indexOf(Korokoro.Const.imagePath);
	if (n <= 0)
		return;

	var chr = texture.image.currentSrc[n + Korokoro.Const.imagePath.length];
	_game.letterTextures[chr] = texture;

	var ready = Korokoro.size(_game.letterTextures) == Korokoro.Const.alphabet;
	if (ready)
	{
		_game.createLetters();
	}
}

// Member functions
Korokoro.prototype.onLoadFunc = function() 
{
	document.getElementById('startButton').addEventListener
		('click', function() { _game.startGame(); });

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
	this.light = new THREE.DirectionalLight(0xffffff, 1.5);
	this.light.position.set(0, 1, 0.25);

	//light.castShadow = true; // According to the reference, it is expensive...

	this.scene.add(this.light);
	this.sceneTwin = this.scene.clone(); // For now, I'm not placing anything in twin.

	// Create a shaded, texture-mapped cube, objects and add them to the scene 
	var texLoader = new THREE.TextureLoader();

	// Create marble1
	this.marble1 = new Marble(this.scene, 'Player 1', 'images/texture1.png');
	this.marble1.setPhrase("banana");
	texLoader.load(this.marble1.textureName, function(texture) {
		_game.marble1.init(texture);
		_game.marble1.setInitialPos(0.5);
	});

	// Create marble2
	this.marble2 = new Marble(this.scene, 'Player 2', 'images/texture2.png');
	this.marble2.setPhrase("monkey");
	texLoader.load(this.marble2.textureName, function(texture) {
		_game.marble2.init(texture);
		_game.marble2.setInitialPos(-0.5);
	});

	// Create racetrack
	this.raceTrack = new RaceTrack(this.scene);
	this.raceTrack.init();

	// Create titleText
	this.titleText = new TitleText(this.scene);
	var fontLoader = new THREE.FontLoader();
	fontLoader.load('fonts/' + 'Trebuchet MS_Regular.js', function (font) {
		_game.titleText.init(font);
	});

	// Create letter boxes
	for (var i = 0; i < Korokoro.Const.alphabet; i++)
	{
		var chr = String.fromCharCode(97 + i);
		texLoader.load(Korokoro.Const.imagePath + chr + '.png', function(texture) {
			Korokoro.onLetterTextureLoaded(texture);
		});
	}

	//var cube = new RandomCube(this.scene);
	//cube.Init();

	// Don't need to render here. (Textures are not loaded at this point anyway.)
}

Korokoro.prototype.onKeyDownFunc = function(e)
{
	if (!this.run)
		return;

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
		this.startGame();
	else if (key == 99 && this.marble1.status == Marble.Status.MovingRight) // 10 key - 3
		this.marble1.status = 0;
	else if (key == 97 && this.marble1.status == Marble.Status.MovingLeft) // 10 key - 1
		this.marble1.status = 0;
	else if (key == "D".charCodeAt(0) && this.marble2.status == Marble.Status.MovingRight)
		this.marble2.status = 0;
	else if (key == "A".charCodeAt(0) && this.marble2.status == Marble.Status.MovingLeft)
		this.marble2.status = 0;
}

Korokoro.prototype.scanGamepad = function(gamepad, marble)
{
	if (!gamepad)
		return;

	var buttons = gamepad.buttons;
	for (var i = 0; i < buttons.length; i++)
	{
		if (this.isButtonPressed(buttons[i]))
		{
			if (marble.outOfControl <= 0)
			{
				if (i == Korokoro.Button.Start)
					this.startGame();
				else if (i == Korokoro.Button.X)
					marble.setStatus(Marble.Status.JumpLeft);
				else if (i == Korokoro.Button.B)
					marble.setStatus(Marble.Status.JumpRight);
				else if (i == Korokoro.Button.Y)
					marble.setStatus(Marble.Status.Jump);
			}
		}
	}
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

		this.scanGamepad(this.gamepad1, this.marble1);
		this.scanGamepad(this.gamepad2, this.marble2);
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

Korokoro.prototype.getStatusText = function()
{
	return this.marble1.getStatusText() + this.marble2.getStatusText();
}

Korokoro.prototype.updateStatusText = function(statusBefore)
{
	var status = this.getStatusText();
	if (0 != statusBefore.localeCompare(status))
	{
		document.getElementById("marble1_status").innerHTML = this.marble1.getStatusText();
		document.getElementById("marble2_status").innerHTML = this.marble2.getStatusText();
	}
}

Korokoro.prototype.processState = function(m1, m2)
{
	if (m1.mesh && m2.mesh)
	{
		var statusBefore = this.getStatusText();
		var letter1 = m1.hitTest(this.letters);
		if (letter1)
		{
			if (!letter1.removed && this.marble1.checkLetter(letter1.letter))
			{
				letter1.removeFromScene(this.marble1.mesh.material.map);
			}
			else if (!letter1.isSpinning())
			{
				letter1.startSpin();
			}
		}
		var letter2 = m2.hitTest(this.letters);
		if (letter2)
		{
			if (!letter2.removed && this.marble2.checkLetter(letter2.letter))
			{
				m2.point += 100;
				letter2.removeFromScene(this.marble2.mesh.material.map);
			}
			else if (!letter2.isSpinning())
			{
				m2.point += 10;
				letter2.startSpin();
			}
		}
		this.updateStatusText(statusBefore);

		for (var i = 0; i < this.letters.length; i++)
		{
			this.letters[i].tick();
		}
		if (m1.outOfControl <= 0 && m2.outOfControl <=0)
		{
			if (m1.isCollidingTo(m2))
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
			if (m1.isJumping() && m2.isJumping())
			{
				if (m1.isCollidingTo(m2))
				{
					if (m1.offset < m2.offset)
					{
						if (m1.status != Marble.Status.Jump)
							m1.status = Marble.Status.JumpLeft;
						if (m2.status != Marble.Status.Jump)
							m2.status = Marble.Status.JumpRight;
					}
					else
					{
						if (m1.status != Marble.Status.Jump)
							m1.status = Marble.Status.JumpRight;
						if (m2.status != Marble.Status.Jump)
							m2.status = Marble.Status.JumpLeft;
					}
				}
			}
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
	else if (marble.status == Marble.Status.MovingRight)
		marble.moveRight();
	else if (marble.status == Marble.Status.MovingLeft)
		marble.moveLeft();

	if (gamepad && marble.outOfControl <= 0)
	{
		var buttons = gamepad.buttons;
		for (var i = 0; i < buttons.length; i++)
		{
			if (this.isButtonPressed(buttons[i]))
			{
				if (i == Korokoro.Button.Right)
					marble.moveRight();
				else if (i == Korokoro.Button.Left)
					marble.moveLeft();
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
	var now = Date.now();
	if (this.then != null && now - this.then < Korokoro.Const.msecPerFrame)
	{
		return;
	}
	this.then = now;

	this.scanGamepads();

	this.processState(this.marble1, this.marble2);
	this.updatePlayer(this.gamepad1, this.marble1);
	this.updatePlayer(this.gamepad2, this.marble2);

	if (this.marble1.completed() || this.marble2.completed())
	{
		this.run = false;
	}

	if (this.run)
	{
		this.time += 0.04;
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
			this.light.position.set(0, 1, 0);
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
		if (this.titleText.mesh)
		{
			this.titleText.mesh.rotation.x -= 0.01;
		}
		//this.camera.position.set(this.cameraPos.x, this.cameraPos.y, this.cameraPos.z);
		//this.camera.lookAt(this.marble1.mesh.position)
	}

	this.renderer.autoClear = false;
	this.renderer.render(this.sceneTwin, this.camera);
	this.renderer.clearDepth();
	this.renderer.render(this.scene, this.camera);
}

Korokoro.prototype.createLetters = function()
{
	for (var i = 0; i < this.letters.length; i++)
	{
		this.letters[i].destroy();
	}
	this.letters = [];

	var phrase = this.marble1.phrase + this.marble2.phrase;
	var remaining = phrase;
	var factor = this.raceTrack.getLength() / phrase.length;
	for (var j = 0; j < phrase.length; j++)
	{
		var k = Korokoro.getRandomInt(0, remaining.length);
		var l = remaining[k];
		remaining = remaining.slice(0, k) + remaining.slice(k + 1)

		var letter = new LetterBox(this.scene, l);
		var texture = this.letterTextures[l];
		letter.init(texture, l);

		var offset = Korokoro.getRandom(-0.75, 0.75);
		var pos = this.raceTrack.GetBallPos((j + 0.5) * factor, 1.0, offset).position;
		var shadowPos = this.raceTrack.GetBallPos((j + 0.5) * factor, 0, offset);
		letter.setPos(pos, shadowPos);

		this.letters[j] = letter;
	}
}

Korokoro.prototype.startGame = function()
{
	if (!this.run)
	{
		var word1 = document.getElementById('word1').value;
		var word2 = document.getElementById('word2').value;
		//TODO sanitize word1 & word2
		if (word1.length == 0 || word2.length == 0)
			return;

		document.getElementById('inputForm').style.display = 'none';
		this.run = true;
		this.marble1.setPhrase(word2.toLowerCase());
		this.marble2.setPhrase(word1.toLowerCase());
		this.createLetters();
		this.updateStatusText("");
		this.scene.remove(this.titleText.mesh);
	}
}
