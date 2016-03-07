
var _game = new Korokoro();
var _rAF = window.mozRequestAnimationFrame ||
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame;

function _updateStatus()
{
	_game.updateStatus();
	_rAF(_updateStatus);
}

function _korokoro()
{
	window.addEventListener("load", function() {
		_game.onLoadFunc();
		_updateStatus();
	});

	window.onkeyup = function(e) {
		_game.onKeyUpFunc(e);
	}

	var hasEvents = 'GamepadEvent' in window;
	if (hasEvents)
	{
		window.addEventListener("gamepadconnected", function(e) {
			_game.addGamepad(e.gamepad);
		});
		window.addEventListener("gamepaddisconnected", function(e) {
			_game.removeGamepad(e.gamepad);
		});
	}
	else
	{
		setInterval(_game.scanGamepads, 500);
	}
}
