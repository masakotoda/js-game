
function RaceTrack(scene)
{
	this.scene = scene;
	//this.sceneTwin = sceneTwin;
	this.object = null;
	this.raycaster = new THREE.Raycaster();
}

RaceTrack.prototype.Init = function()
{
	var v = [];
	var index = 0;

	var h0 = 0;
	var h1 = 0;
	var delta = 0;
	var h_outer = h0;
	var h_inner = h0;

	v[index] = new THREE.Vector3(-0.5, h_outer, 0);
	index++;
	v[index] = new THREE.Vector3(0.5, h_inner, 0);
	index++;

	h0 = 0;
	h1 = 1.0;
	delta = (h1 - h0) / 20;
	h0_inner = 0;
	delta_inner = (1.5 / 2.5) * (h1 - h0) / 20;

	for (var i = 0; i < 20; i++)
	{
		var t = -1 - i * 0.05;
		h_outer = h0 + delta * i;
		h_inner = h0_inner + delta_inner * i;
		v[index] = new THREE.Vector3(2.5*Math.cos(Math.PI*t)+2, h_outer, -1*(2.5*Math.sin(Math.PI*t)+4));
		index++;
		v[index] = new THREE.Vector3(1.5*Math.cos(Math.PI*t)+2, h_inner, -1*(1.5*Math.sin(Math.PI*t)+4));
		index++;
	}

	h0 = h_outer;
	h1 = h_inner;
	delta = (h1 - h0) / 20.0;
	h0_inner = h1;
	delta_inner = 0;

	for (var i = 0; i < 20; i++)
	{
		var t = -i * 0.05;
		h_outer = h0 + delta * i;
		h_inner = h0_inner + delta_inner * i;
		v[index] = new THREE.Vector3(1.5*Math.cos(Math.PI*t)+3, h_outer, -1*(1.5*Math.sin(Math.PI*t)+4));
		index++;
		v[index] = new THREE.Vector3(0.5*Math.cos(Math.PI*t)+3, h_inner, -1*(0.5*Math.sin(Math.PI*t)+4));
		index++;
	}

	h0 = h_outer;
	h1 = h_inner + 0.25;
	delta = (h1 - h0) / 20.0;
	h0_inner = h0;
	delta_inner = 0;

	for (var i = 0; i < 20; i++)
	{
		var t = i * 0.05;
		h_outer = h0 + delta * i;
		h_inner = h0_inner + delta_inner * i;
		v[index] = new THREE.Vector3(1.5, h_inner, -4.0);
		index++;
		v[index] = new THREE.Vector3(1*Math.cos(Math.PI*t)+1.5, h_outer, -1*(1*Math.sin(Math.PI*t)+4));
		index++;
	}

	h_outer = 0.25;
	h_inner = 0.0;
	v[index] = new THREE.Vector3(1.5, h_inner, -1);
	index++;
	v[index] = new THREE.Vector3(0.5, h_outer, -1);
	index++;

	h0 = h_outer;
	h1 = 0;
	delta = (h1 - h0) / 20.0;
	h0_inner = 0;
	delta_inner = 0;

	for (var i = 0; i < 20; i++)
	{
		var t = 1 + i * 0.05;
		h_outer = h0 + delta * i;
		h_inner = h0_inner + delta_inner * i;
		v[index] = new THREE.Vector3(1.5, h_inner, -1.0);
		index++;
		v[index] = new THREE.Vector3(1*Math.cos(Math.PI*t)+1.5, h_outer, -1*(1*Math.sin(Math.PI*t)+1));
		index++;
	}

	h_outer = 0;
	h_inner = 0;
	v[index] = new THREE.Vector3(1.5, h_inner, -1.5);
	index++;
	v[index] = new THREE.Vector3(2.5, h_outer, -1.5);
	index++;

	h0 = h_inner;
	h1 = h_outer + 0.25;
	delta = (h1 - h0) / 20.0;
	h0_inner = h0;
	delta_inner = 0;

	for (var i = 0; i < 20; i++)
	{
		var t = -1 - i * 0.05;
		h_outer = h0 + delta * i;
		h_inner = h0_inner + delta_inner * i;
		v[index] = new THREE.Vector3(1*Math.cos(Math.PI*t)+2.5, h_outer, -1*(1*Math.sin(Math.PI*t)+1.5));
		index++;
		v[index] = new THREE.Vector3(2.5, h_inner, -1.5);
		index++;
	}

	v[index] = new THREE.Vector3(3.5, h_outer, 0);
	index++;
	v[index] = new THREE.Vector3(2.5, h_inner, 0);
	index++;

	h0 = h_outer;
	h1 = 0;
	delta = (h1 - h0) / 20.0;
	h0_inner = h_inner;
	delta_inner = (0 - h_inner) /20.0;

	for (var i = 0; i <= 20; i++) // Include the starting point
	{
		var t = -i * 0.05;
		h_outer = h0 + delta * i;
		h_inner = h0_inner + delta_inner * i;
		v[index] = new THREE.Vector3(2*Math.cos(Math.PI*t)+1.5, h_outer, -1*(2*Math.sin(Math.PI*t)));
		index++;
		v[index] = new THREE.Vector3(1*Math.cos(Math.PI*t)+1.5, h_inner, -1*(1*Math.sin(Math.PI*t)));
		index++;
	}

	var geom = new THREE.Geometry();
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

	//var mat0 = new THREE.MeshBasicMaterial( { transparent: true, opacity: 0 } );
	//var mat1 = new THREE.MeshBasicMaterial( { color: 0xffcccc } );
	//var mat2 = new THREE.MeshNormalMaterial();
	//var mat3 = new THREE.MeshLambertMaterial();
	var mat4 = new THREE.MeshPhongMaterial( { color: 0x333340 } );
	this.object = new THREE.Mesh(geom, mat4);

	//var wireframe = new THREE.WireframeHelper( object, 0xee0000 );
	var wireframe = new THREE.WireframeGeometry(geom);

	var group = new THREE.Group();
	group.scale.multiplyScalar(2);
	this.scene.add(group);

	// To make sure that the matrixWorld is up to date for the boxhelpers
	group.updateMatrixWorld(true);
	var line = new THREE.LineSegments(wireframe);
	line.material = new THREE.MeshBasicMaterial( { color: 0xffcccc } );
	line.material.depthTest = false;
	line.material.opacity = 0.25;
	line.material.transparent = true;

	this.object.castShadow = false;
	this.object.receiveShadow = true;

	//line.position.x = 0.2;
	//line.position.y = 0.2;
	//group.add(line);
	group.add(this.object);

	// Some cool vertical line on faces
	//var fnh = new THREE.FaceNormalsHelper(this.object, 1);
	//this.scene.add(fnh);

	// Some cool vertical line on faces
	//var vnh = new THREE.VertexNormalsHelper(this.object, 5);
	//this.scene.add(vnh);

	//_scene.add(new THREE.BoxHelper(line));

	var twin = new THREE.Mesh(geom, new THREE.MeshBasicMaterial( { color: 0xcc0008 } ));
	twin.position.y = -0.1;
	//var groupTwin = new THREE.Group()
	group.add(twin);
	//groupTwin.scale.multiplyScalar(2);
	//this.sceneTwin.add(groupTwin);
	//groupTwin.updateMatrixWorld(true);
}

RaceTrack.prototype.GetCameraPos = function(t)
{
	var y = 2.3333;
	var delay = 3.3333;
	var radius = 0;
	var offset = 0;
	return this.GetPos(t, y, radius, delay, offset);
}

RaceTrack.prototype.GetFocusPos = function(t)
{
	var y = 0;
	var delay = 0;
	var radius = 0;
	var offset = 0;
	return this.GetPos(t, y, radius, delay, offset);
}

RaceTrack.prototype.GetBallPos = function(t, radius, offset)
{
	var y = 0;
	var delay = 0;
	return this.GetPos(t, y, radius, delay, offset);
}

RaceTrack.prototype.GetIntersect = function(x, z)
{
	this.raycaster.set(new THREE.Vector3(x, 10, z), new THREE.Vector3(0, -1, 0));
	var intersects = this.raycaster.intersectObjects([this.object]);
	if (intersects.length > 0)
	{
		return intersects[0];
	}
	return null;
}

RaceTrack.prototype.GetVertex = function(x, z, radius)
{
	y = this.GetIntersect(x, z).point.y;
	if (radius == 0)
	{
		return new THREE.Vector3(x, y, z);
	}
	else
	{
		var face = this.GetIntersect(x, z).face;
		var normal = face.normal;
		var ray = new THREE.Ray(new THREE.Vector3(x, y, z), normal);
		var v = ray.at(radius);
		return v;
	}
}

RaceTrack.prototype.GetPos = function(t, y, radius, delay, offset)
{
	t -= delay;

	var distances = [];
	distances[0] = 8.0;
	distances[1] = 4*Math.PI;
	distances[2] = 2*Math.PI;
	distances[3] = 1.75*Math.PI; // It actually 1*PI, but it's pretty tight curve. It looks more natural to be slower (simulate longer distance)
	distances[4] = 6.0;
	distances[5] = 1.75*Math.PI; // It actually 1*PI, but it's pretty tight curve. It looks more natural to be slower (simulate longer distance)
	distances[6] = 1;
	distances[7] = 1.75*Math.PI; // It actually 1*PI, but it's pretty tight curve. It looks more natural to be slower (simulate longer distance)
	distances[8] = 3;
	distances[9] = 3*Math.PI;

	var accum = [];
	for (var i = 0; i < distances.length; i++)
	{
		accum[i] = 0;
		for (var j = 0; j < i; j++)
		{
			accum[i] += distances[j];
		}
	}

	while (true)
	{
		if (t < accum[0] + distances[0])
		{
			var x = offset;
			var z = -t;
			if (delay == 0)
				return { position: this.GetVertex(x, z, radius), velocity: new THREE.Vector3(0.05, 0, 0) };
			else
				return { position: new THREE.Vector3(x, y, z) };
		}
		else if (t < accum[1] + distances[1])
		{
			var theta = -1 - (t - accum[1]) / distances[1];
			var r = (4 - offset);
			var x = r*Math.cos(Math.PI*theta)+4;
			var z = -1*(r*Math.sin(Math.PI*theta)+8);
			if (delay == 0)
				return { position: this.GetVertex(x, z, radius), velocity: new THREE.Vector3(0.05*Math.cos(Math.PI*(t - accum[1]) / distances[1]), 0, 0.05*Math.sin(Math.PI*(t - accum[1]) / distances[1])) };
			else
				return { position: new THREE.Vector3(x, y, z) };
		}
		else if (t < accum[2] + distances[2])
		{
			var theta = -(t - accum[2]) / distances[2];
			var r = (2 - offset);
			var x = r*Math.cos(Math.PI*theta)+6;
			var z = -1*(r*Math.sin(Math.PI*theta)+8);
			if (delay == 0)
				return { position: this.GetVertex(x, z, radius), velocity: new THREE.Vector3(-0.05*Math.cos(Math.PI*(t - accum[2]) / distances[2]), 0, -0.05*Math.sin(Math.PI*(t - accum[2]) / distances[2])) };
			else
				return { position: new THREE.Vector3(x, y, z) };
		}
		else if (t < accum[3] + distances[3])
		{
			var theta = (t - accum[3]) / distances[3];
			var r = (1 + offset);
			var x = r*Math.cos(Math.PI*theta)+3;
			var z = -1*(r*Math.sin(Math.PI*theta)+8);
			if (delay == 0)
				return { position: this.GetVertex(x, z, radius), velocity: new THREE.Vector3(0.1*Math.cos(Math.PI*(t - accum[3]) / distances[3]), 0, -0.1*Math.sin(Math.PI*(t - accum[3]) / distances[3])) };
			else
				return { position: new THREE.Vector3(x, y, z) };
		}
		else if (t < accum[4] + distances[4])
		{
			var x = 2 - offset;
			var z = -2 - (distances[4] - (t - accum[4]));
			if (delay == 0)
				return { position: this.GetVertex(x, z, radius), velocity: new THREE.Vector3(-0.05, 0, 0) };
			else
				return { position: new THREE.Vector3(x, y, z) };
		}
		else if (t < accum[5] + distances[5])
		{
			var theta = 1 + (t - accum[5]) / distances[5];
			var r = 1 + offset;
			var x = r*Math.cos(Math.PI*theta)+3;
			var z = -1*(r*Math.sin(Math.PI*theta)+2);
			if (delay == 0)
				return { position: this.GetVertex(x, z, radius), velocity: new THREE.Vector3(-0.1*Math.cos(Math.PI*(t - accum[5]) / distances[5]), 0, 0.1*Math.sin(Math.PI*(t - accum[5]) / distances[5])) };
			else
				return { position: new THREE.Vector3(x, y, z) };
		}
		else if (t < accum[6] + distances[6])
		{
			var x = 4 + offset;
			var z = - (t - accum[6] + 2);
			if (delay == 0)
				return { position: this.GetVertex(x, z, radius), velocity: new THREE.Vector3(0.05, 0, 0) };
			else
				return { position: new THREE.Vector3(x, y, z) };
		}
		else if (t < accum[7] + distances[7])
		{
			var theta = -1 - (t - accum[7]) / distances[7];
			var r = 1 - offset;
			var x = r*Math.cos(Math.PI*theta)+5;
			var z = -1*(r*Math.sin(Math.PI*theta)+3);
			if (delay == 0)
				return { position: this.GetVertex(x, z, radius), velocity: new THREE.Vector3(0.1*Math.cos(Math.PI*(t - accum[7]) / distances[7]), 0, 0.1*Math.sin(Math.PI*(t - accum[7]) / distances[7])) };
			else
				return { position: new THREE.Vector3(x, y, z) };
		}
		else if (t < accum[8] + distances[8])
		{
			var x = 6 - offset;
			var z = -(distances[8] - (t - accum[8]));
			if (delay == 0)
				return { position: this.GetVertex(x, z, radius), velocity: new THREE.Vector3(-0.05, 0, 0) };
			else
				return { position: new THREE.Vector3(x, y, z) };
		}
		else if (t < accum[9] + distances[9])
		{
			var theta = -(t - accum[9]) / distances[9];
			var r = 3 - offset;
			var x = r*Math.cos(Math.PI*theta)+3;
			var z = -1*(r*Math.sin(Math.PI*theta));
			if (delay == 0)
				return { position: this.GetVertex(x, z, radius), velocity: new THREE.Vector3(-0.05*Math.cos(Math.PI*(t - accum[9]) / distances[9]), 0, -0.05*Math.sin(Math.PI*(t - accum[9]) / distances[9])) };
			else
				return { position: new THREE.Vector3(x, y, z) };
		}
		else
		{
			t -= (accum[9] + distances[9]);
		}
	}
}
