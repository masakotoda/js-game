
function SakiUtil()
{
}

SakiUtil.getRandom = function(min, max)
{
	return Math.random() * (max - min) + min;
}

SakiUtil.getRandomInt = function(min, max)
{
	return Math.floor(Math.random() * (max - min)) + min;
}

SakiUtil.getRandomIntInclusive = function(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

SakiUtil.size = function(obj)
{
	var size = 0, key;
	for (key in obj)
	{
		if (obj.hasOwnProperty(key))
			size++;
	}
	return size;
}

SakiUtil.isAlphaOnly = function(text)
{
	var alpha = /^[a-zA-Z_]+$/;
	return text.match(alpha);
}

SakiUtil.getParameter = function(name)
{
	var url = window.location.href;

	// This is just to avoid case sensitiveness
	url = url.toLowerCase();

	// This is just to avoid case sensitiveness for query parameter name
	name = name.replace(/[\[\]]/g, '\\$&').toLowerCase();

	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
	var results = regex.exec(url);

	if (!results)
		return null;
	if (!results[2])
		return '';

	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
