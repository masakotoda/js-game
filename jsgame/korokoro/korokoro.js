
function Korokoro()
{
	this.scene = null;
	this.sceneTwin = null;
	this.renderer = null;
	this.light = null;
	this.camera = null;
	this.cameraPos = null;

	this.gamepad1 = null;
	this.gamepad2 = null;

	this.marble1 = null;
	this.marble2 = null;
	this.titleText = null;
	this.letters = [];
	this.letterTextures = [];

	this.raceTrack = null;
	this.gameState = Korokoro.GameState.ready;
	this.time = 0;

	this.then = null;
	this.font = null;
	this.winnerBanner = null;
}

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

Korokoro.Key =
{
	keySpace: 32,
	key1: 97,
	key3: 99,
	key5: 101,
	key4: 100,
	key6: 102,
	keyA: "A".charCodeAt(0),
	keyD: "D".charCodeAt(0),
	keyW: "W".charCodeAt(0),
	keyQ: "Q".charCodeAt(0),
	keyE: "E".charCodeAt(0)
}

Korokoro.GameState =
{
	ready: 0,
	playing: 1,
	gameOver: 2
}

Korokoro.Const =
{
	msecPerFrame: 12,
	imagePath: 'images/',
	alphabet: 26,
	initialCamPos: { x: 0, y: 1.3333, z: 3.3333 },
	initialLookAt: { x: 0, y: 0, x: -20 }
}

// Static functions, callback functions
Korokoro.onLetterTextureLoaded = function(texture)
{
	var n = texture.image.currentSrc.indexOf(Korokoro.Const.imagePath);
	if (n <= 0)
		return;

	var chr = texture.image.currentSrc[n + Korokoro.Const.imagePath.length];
	_game.letterTextures[chr] = texture;

	var ready = SakiUtil.size(_game.letterTextures) == Korokoro.Const.alphabet + 1;
	if (ready)
	{
		_game.createLetters();
	}
}

Korokoro.getWord1 = function()
{
	return document.getElementById('word1');
}

Korokoro.getWord2 = function()
{
	return document.getElementById('word2');
}

Korokoro.initWords = function()
{
	var url = SakiUtil.getParameter("theme");
	if (url && url.length > 0)
	{
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function()
		{
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
			{
				var resp = JSON.parse(xmlhttp.responseText);
				var i1 = SakiUtil.getRandomInt(0, resp.length);
				var i2 = SakiUtil.getRandomInt(0, resp.length);
				Korokoro.getWord1().value = resp[i1];
				Korokoro.getWord2().value = resp[i2];
			}
		};

		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}
}

// Member functions
Korokoro.prototype.assignButtonToKey = function(button, key)
{
	document.getElementById(button).addEventListener
		('mousedown', function() {_game.onKeyDownFunc({keyCode: key});});
	document.getElementById(button).addEventListener
		('mouseup', function() {_game.onKeyUpFunc({keyCode: key});});
}

Korokoro.prototype.onLoadFunc = function()
{
	Korokoro.initWords();

	document.getElementById('startButton').addEventListener
		('click', function() { _game.startGame(); });

	document.getElementById('playAgainButton').addEventListener
		('click', function()
		{
			var orig = window.location.href;
			window.location.href = orig;
		});

	this.assignButtonToKey('buttonQ', Korokoro.Key.keyQ);
	this.assignButtonToKey('buttonW', Korokoro.Key.keyW);
	this.assignButtonToKey('buttonE', Korokoro.Key.keyE);
	this.assignButtonToKey('buttonA', Korokoro.Key.keyA);
	this.assignButtonToKey('buttonD', Korokoro.Key.keyD);
	this.assignButtonToKey('button4', Korokoro.Key.key4);
	this.assignButtonToKey('button5', Korokoro.Key.key5);
	this.assignButtonToKey('button6', Korokoro.Key.key6);
	this.assignButtonToKey('button1', Korokoro.Key.key1);
	this.assignButtonToKey('button3', Korokoro.Key.key3);

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
	this.camera.position.set(Korokoro.Const.initialCamPos.x, Korokoro.Const.initialCamPos.y, Korokoro.Const.initialCamPos.z);
	this.camera.lookAt(Korokoro.Const.initialLookAt);

	// Create a directional light to show off the object 
	this.light = new THREE.DirectionalLight(0xffffff, 1.5);
	this.light.position.set(0, 1, 0.25);

	//light.castShadow = true; // According to the reference, it is expensive...

	this.scene.add(this.light);
	this.sceneTwin = this.scene.clone(); // For now, I'm not placing anything in twin. So, I could delete it...

	// Create a shaded, texture-mapped cube, objects and add them to the scene 
	var texLoader = new THREE.TextureLoader();

	// Create marble1
	this.marble1 = new Marble(this.scene, 'Player 1');
	this.marble1.setPhrase("banana");
	texLoader.load('images/texture1.png', function(texture) {
		_game.marble1.init(texture);
		_game.marble1.setInitialPos(0.5);
	});

	// Create marble2
	this.marble2 = new Marble(this.scene, 'Player 2');
	this.marble2.setPhrase("monkey");
	texLoader.load('images/texture2.png', function(texture) {
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
		_game.font = font;
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
	texLoader.load(Korokoro.Const.imagePath + '_.png', function(texture) {
		Korokoro.onLetterTextureLoaded(texture);
	});

	// Don't need to render here. (Textures are not loaded at this point anyway.)
}

Korokoro.prototype.onKeyDownFunc = function(e)
{
	if (this.gameState != Korokoro.GameState.playing)
		return;

	var key = e.keyCode ? e.keyCode : e.which;
	switch (key)
	{
	case Korokoro.Key.key3:
		this.marble1.setStatus(Marble.Status.moveRight, false);
		break;
	case Korokoro.Key.key1:
		this.marble1.setStatus(Marble.Status.moveLeft, false);
		break;
	case Korokoro.Key.key5:
		this.marble1.startJumping(Marble.Status.jump);
		break;
	case Korokoro.Key.key4:
		this.marble1.startJumping(Marble.Status.jumpLeft);
		break;
	case Korokoro.Key.key6:
		this.marble1.startJumping(Marble.Status.jumpRight);
		break;
	case Korokoro.Key.keyD:
		this.marble2.setStatus(Marble.Status.moveRight, false);
		break;
	case Korokoro.Key.keyA:
		this.marble2.setStatus(Marble.Status.moveLeft, false);
		break;
	case Korokoro.Key.keyW:
		this.marble2.startJumping(Marble.Status.jump);
		break;
	case Korokoro.Key.keyQ:
		this.marble2.startJumping(Marble.Status.jumpLeft);
		break;
	case Korokoro.Key.keyE:
		this.marble2.startJumping(Marble.Status.jumpRight);
		break;
	}
}

Korokoro.prototype.onKeyUpFunc = function(e)
{
	// In case next key is pressed before releasing the prev key,
	// (e.g. Left down -> Right down -> Left up -> Left down)
	// check the current state first.
	var key = e.keyCode ? e.keyCode : e.which;
	switch (key)
	{
	case Korokoro.Key.keySpace:
		this.startGame();
		break;
	case Korokoro.Key.key3:
		if (this.marble1.status == Marble.Status.moveRight &&
			this.marble1.outOfControl <= 0)
		{
			this.marble1.clearStatus();
		}
		break;
	case Korokoro.Key.key1:
		if (this.marble1.status == Marble.Status.moveLeft &&
			this.marble1.outOfControl <= 0)
		{
			this.marble1.clearStatus();
		}
		break;
	case Korokoro.Key.keyD:
		if (this.marble2.status == Marble.Status.moveRight &&
			this.marble2.outOfControl <= 0)
		{
			this.marble2.clearStatus();
		}
		break;
	case Korokoro.Key.keyA:
		if (this.marble2.status == Marble.Status.moveLeft &&
			this.marble2.outOfControl <= 0)
		{
			this.marble2.clearStatus();
		}
		break;
	}
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
					marble.startJumping(Marble.Status.jumpLeft);
				else if (i == Korokoro.Button.B)
					marble.startJumping(Marble.Status.jumpRight);
				else if (i == Korokoro.Button.Y)
					marble.startJumping(Marble.Status.jump);
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
		// process letter collision
		var statusBefore = this.getStatusText();
		var letter1 = m1.getCollidingLetter(this.letters);
		if (letter1)
		{
			if (m1.isCorrectLetter(letter1))
			{
				letter1.swapTexture(m1.getTexture());
			}
			else if (!letter1.isSpinning())
			{
				letter1.startSpin();
			}
		}
		var letter2 = m2.getCollidingLetter(this.letters);
		if (letter2)
		{
			if (m2.isCorrectLetter(letter2))
			{
				letter2.swapTexture(m2.getTexture());
			}
			else if (!letter2.isSpinning())
			{
				letter2.startSpin();
			}
		}
		this.updateStatusText(statusBefore);

		// update letter rotation
		for (var i = 0; i < this.letters.length; i++)
		{
			this.letters[i].tick();
		}

		// process marble - marble collision
		if (m1.outOfControl <= 0 && m2.outOfControl <=0)
		{
			if (m1.isCollidingTo(m2))
			{
				if (m1.offset < m2.offset)
				{
					m1.setStatus(Marble.Status.moveLeft, false);
					m2.setStatus(Marble.Status.moveRight, false);
				}
				else
				{
					m1.setStatus(Marble.Status.moveRight, false);
					m2.setStatus(Marble.Status.moveLeft, false);
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
						if (m1.status != Marble.Status.jump)
							m1.setStatus(Marble.Status.jumpLeft, true);
						if (m2.status != Marble.Status.jump)
							m2.setStatus(Marble.Status.jumpRight, true);
					}
					else
					{
						if (m1.status != Marble.Status.jump)
							m1.setStatus(Marble.Status.jumpRight, true);
						if (m2.status != Marble.Status.jump)
							m2.setStatus(Marble.Status.jumpLeft, true);
					}
				}
			}
			m1.updateOutOfControl();
			m2.updateOutOfControl();
		}
	}
}

Korokoro.prototype.updatePlayer = function(gamepad, marble)
{
	marble.tick();

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

Korokoro.prototype.updateGameState = function()
{
	if (this.marble1.completed() || this.marble2.completed())
	{
		this.gameState = Korokoro.GameState.gameOver;
	}
}

Korokoro.prototype.processGameOver = function()
{
	if (!this.winnerBanner)
	{
		this.winnerBanner = new WinnerBanner(this.scene);
	}
	this.winnerBanner.tick();
	if (this.winnerBanner.isReady())
	{
		for (var i = 0; i < this.letters.length; i++)
		{
			this.letters[i].destroy();
		}
		this.letters = [];

		var winner = null;
		if (this.marble1.completed())
		{
			winner = this.marble1;
			this.marble2.destroy();
		}
		else
		{
			winner = this.marble2;
			this.marble1.destroy();
		}

		this.raceTrack.destroy();

		this.camera.position.set(Korokoro.Const.initialCamPos.x, Korokoro.Const.initialCamPos.y, Korokoro.Const.initialCamPos.z);
		this.camera.lookAt(Korokoro.Const.initialLookAt);
		this.light.position.set(0, 1, 0.75);
		this.winnerBanner.init(this.font, winner);
	}
}

Korokoro.prototype.processPlaying = function()
{
	this.time += 0.04;
	var camPosition = this.raceTrack.getCameraPos(this.time).position;
	var camFocus = this.raceTrack.getFocusPos(this.time).position;
	var ballPos1 = this.raceTrack.getBallPos(this.time, 0.16, this.marble1.offset);
	var ballPos2 = this.raceTrack.getBallPos(this.time, 0.16, this.marble2.offset);

	this.light.position.set(0, 1, 0);
	this.camera.position.set(camPosition.x, camPosition.y, camPosition.z);
	this.camera.lookAt(camFocus);
	if (ballPos1 != null)
	{
		this.marble1.updateRotation(ballPos1.velocity);
		this.marble1.updatePosition(ballPos1.position);
		var shadowPos1 = this.raceTrack.getBallPos(this.time, 0, this.marble1.offset);
		this.marble1.updateShadow(shadowPos1.position);
	}
	if (ballPos2 != null)
	{
		this.marble2.updateRotation(ballPos2.velocity);
		this.marble2.updatePosition(ballPos2.position);
		var shadowPos2 = this.raceTrack.getBallPos(this.time, 0, this.marble2.offset);
		this.marble2.updateShadow(shadowPos2.position);
	}
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
	this.updateGameState();

	switch (this.gameState)
	{
	case Korokoro.GameState.ready:
		this.titleText.tick();
		break;
	case Korokoro.GameState.gameOver:
		this.processGameOver();
		break;
	case Korokoro.GameState.playing:
		this.processPlaying();
		break;
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
		var k = SakiUtil.getRandomInt(0, remaining.length);
		var l = remaining[k];
		remaining = remaining.slice(0, k) + remaining.slice(k + 1)

		var letter = new LetterBox(this.scene, l);
		var texture = this.letterTextures[l];
		letter.init(texture, l);

		var offset = SakiUtil.getRandom(-0.75, 0.75);
		var pos = this.raceTrack.getBallPos((j + 0.5) * factor, 1.0, offset).position;
		var shadowPos = this.raceTrack.getBallPos((j + 0.5) * factor, 0, offset);
		letter.setPos(pos, shadowPos);

		this.letters[j] = letter;
	}
}

Korokoro.prototype.startGame = function()
{
	if (this.gameState == Korokoro.GameState.ready)
	{
		var word1 = Korokoro.getWord1().value;
		var word2 = Korokoro.getWord2().value;

		if (!SakiUtil.isAlphaOnly(word1) || !SakiUtil.isAlphaOnly(word2)
			|| word1.length == 0 || word2.length == 0)
		{
			alert('Please enter a word. (No numbers and symbols.)');
			return;
		}

		document.getElementById('inputForm').style.display = 'none';
		this.gameState = Korokoro.GameState.playing;
		this.marble1.setPhrase(word2.toLowerCase());
		this.marble2.setPhrase(word1.toLowerCase());
		this.createLetters();
		this.updateStatusText("");
		this.titleText.destroy();
	}
}
