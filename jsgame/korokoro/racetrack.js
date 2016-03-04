
function RaceTrack(scene)
{
	this.scene = scene;
}

RaceTrack.prototype.Init = function()
{
	var geom = new THREE.Geometry();
	var v = [];
	var index = 0;
	var h = 0;

	v[index] = new THREE.Vector3(-0.5, h, 0);
	index++;
	v[index] = new THREE.Vector3(0.5, h, 0);
	index++;

	for (var i = 0; i < 20; i++)
	{
		var t = -1 - i * 0.05;
		h = Math.sin(Math.PI*i*0.05*0.5);
		v[index] = new THREE.Vector3(2.5*Math.cos(Math.PI*t)+2, h, -1*(2.5*Math.sin(Math.PI*t)+4));
		index++;
		v[index] = new THREE.Vector3(1.5*Math.cos(Math.PI*t)+2, 0, -1*(1.5*Math.sin(Math.PI*t)+4));
		index++;
	}

	for (var i = 0; i < 20; i++)
	{
		var t = -i * 0.05;
		h = Math.cos(Math.PI*t*0.5);
		v[index] = new THREE.Vector3(1.5*Math.cos(Math.PI*t)+3, h, -1*(1.5*Math.sin(Math.PI*t)+4));
		index++;
		v[index] = new THREE.Vector3(0.5*Math.cos(Math.PI*t)+3, 0, -1*(0.5*Math.sin(Math.PI*t)+4));
		index++;
	}

	for (var i = 0; i < 20; i++)
	{
		var t = i * 0.05;
		h = 0.25*Math.sin(Math.PI*t*0.5);
		v[index] = new THREE.Vector3(1.5, 0, -4.0);
		index++;
		v[index] = new THREE.Vector3(1*Math.cos(Math.PI*t)+1.5, h, -1*(1*Math.sin(Math.PI*t)+4));
		index++;
	}

	v[index] = new THREE.Vector3(1.5, 0, -1);
	index++;
	v[index] = new THREE.Vector3(0.5, h, -1);
	index++;

	for (var i = 0; i < 20; i++)
	{
		var t = 1 + i * 0.05;
		h = 0.25*Math.sin(Math.PI*t*0.5);
		v[index] = new THREE.Vector3(1.5, 0, -1.0);
		index++;
		v[index] = new THREE.Vector3(1*Math.cos(Math.PI*t)+1.5, h, -1*(1*Math.sin(Math.PI*t)+1));
		index++;
	}

	for (var i = 0; i < 20; i++)
	{
		var t = -1 - i * 0.05;
		h = 0.5*Math.sin(Math.PI*i*0.05*0.5);
		v[index] = new THREE.Vector3(1*Math.cos(Math.PI*t)+2.5, h, -1*(1*Math.sin(Math.PI*t)+1));
		index++;
		v[index] = new THREE.Vector3(2.5, 0, -1);
		index++;
	}

	v[index] = new THREE.Vector3(3.5, h, 0);
	index++;
	v[index] = new THREE.Vector3(2.5, 0, 0);
	index++;

	for (var i = 0; i <= 20; i++) // Include the starting point
	{
		var t = -i * 0.05;
		h = 0.5*Math.cos(Math.PI*t*0.5);
		v[index] = new THREE.Vector3(2*Math.cos(Math.PI*t)+1.5, h, -1*(2*Math.sin(Math.PI*t)));
		index++;
		v[index] = new THREE.Vector3(1*Math.cos(Math.PI*t)+1.5, 0, -1*(1*Math.sin(Math.PI*t)));
		index++;
	}

	for (var i = 0; i < index; i++)
	{
		geom.vertices.push(v[i]);
	}

	for (var i = 0; i < index - 2; i += 2)
	{
		geom.faces.push(new THREE.Face3(i, i + 1, i + 2));
		geom.faces.push(new THREE.Face3(i + 3, i + 2, i + 1));
	}

	geom.computeFaceNormals();

	var mat1 = new THREE.MeshBasicMaterial( { color: 0xffcccc } );
	var mat2 = new THREE.MeshNormalMaterial();
	var mat3 = new THREE.MeshLambertMaterial();
	var object = new THREE.Mesh(geom, mat2);

	//var wireframe = new THREE.WireframeHelper( object, 0xee0000 );
	var wireframe = new THREE.WireframeGeometry(geom);

	var group = new THREE.Group();
	group.scale.multiplyScalar(2);
	this.scene.add(group);

	// To make sure that the matrixWorld is up to date for the boxhelpers
	group.updateMatrixWorld(true);
	var line = new THREE.LineSegments(wireframe);
	line.material.depthTest = false;
	line.material.opacity = 0.25;
	line.material.transparent = true;
	//line.position.x = 0.2;
	//line.position.y = 0.2;
	group.add(line);
	group.add(object);
	//_scene.add(new THREE.BoxHelper(line));
}

RaceTrack.prototype.GetCameraPos = function(t)
{
	var y = 1.3333;
	var delay = 3.3333;
	return this.GetPos(t, y, delay)
}

RaceTrack.prototype.GetFocusPos = function(t)
{
	var y = 0;
	var delay = 0;
	return this.GetPos(t, y, delay)
}

RaceTrack.prototype.GetPos = function(t, y, delay)
{
	t -= delay;

	var distances = [];
	distances[0] = 8.0;
	distances[1] = 4*Math.PI;
	distances[2] = 2*Math.PI;
	distances[3] = 1*Math.PI;
	distances[4] = 6.0;
	distances[5] = 1*Math.PI;
	distances[6] = 1*Math.PI;
	distances[7] = 2;
	distances[8] = 3*Math.PI;

	var accum = [];
	for (var i = 0; i < distances.length; i++)
	{
		accum[i] = 0;
		for (var j = 0; j < i; j++)
		{
			accum[i] += distances[j];
		}
	}

	if (t < accum[0] + distances[0])
	{
		return new THREE.Vector3(0, y, -t);
	}
	else if (t < accum[1] + distances[1])
	{
		var theta = -1 - (t - accum[1]) / distances[1];
		return new THREE.Vector3(4*Math.cos(Math.PI*theta)+4, y, -1*(4*Math.sin(Math.PI*theta)+8));
	}
	else if (t < accum[2] + distances[2])
	{
		var theta = -(t - accum[2]) / distances[2];
		return new THREE.Vector3(2*Math.cos(Math.PI*theta)+6, y, -1*(2*Math.sin(Math.PI*theta)+8));
	}
	else if (t < accum[3] + distances[3])
	{
		var theta = (t - accum[3]) / distances[3];
		return new THREE.Vector3(1*Math.cos(Math.PI*theta)+3, y, -1*(1*Math.sin(Math.PI*theta)+8));
	}
	else if (t < accum[4] + distances[4])
	{
		return new THREE.Vector3(2, y, -2 - (distances[4] - (t - accum[4])));
	}
	else if (t < accum[5] + distances[5])
	{
		var theta = 1 + (t - accum[5]) / distances[5];
		return new THREE.Vector3(1*Math.cos(Math.PI*theta)+3, y, -1*(1*Math.sin(Math.PI*theta)+2));
	}
	else if (t < accum[6] + distances[6])
	{
		var theta = -1 - (t - accum[6]) / distances[6];
		return new THREE.Vector3(1*Math.cos(Math.PI*theta)+5, y, -1*(1*Math.sin(Math.PI*theta)+2));
	}
	else if (t < accum[7] + distances[7])
	{
		return new THREE.Vector3(6, y, -(distances[7] - (t - accum[7])));
	}
	else if (t < accum[8] + distances[8])
	{
		var theta = -(t - accum[8]) / distances[8];
		return new THREE.Vector3(3*Math.cos(Math.PI*theta)+3, y, -1*(3*Math.sin(Math.PI*theta)));
	}
	else
	{
		return null;
	}
}
