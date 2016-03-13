
function RaceTrack(scene)
{
	this.scene = scene;
	this.object = null;
	this.raycaster = new THREE.Raycaster();
	this.distances = [];
}

RaceTrack.prototype.Init = function()
{
	var v = [];
	var index = 0;

	var segment = 20;

	// Origin
	v[index] = new THREE.Vector3(-0.5, 0, 0);
	index++;
	v[index] = new THREE.Vector3(0.5, 0, 0);
	index++;

	// Curve 1 (Section 2)
	r_outer = 2.5;
	r_inner = 1.5;
	centerX = 2;
	centerZ = 4;
	h0_outer = 0;
	h1_outer = 1.0;
	delta_outer = (h1_outer - h0_outer) / segment;
	h0_inner = 0;
	h1_inner = h1_outer * (r_inner / r_outer);
	delta_inner = (h1_inner - h0_inner) / segment;

	for (var i = 0; i <= segment; i++)
	{
		var theta = (-1-i/segment) * Math.PI; // -PI -> -2PI (clockwise)
		h_outer = h0_outer + delta_outer * i;
		h_inner = h0_inner + delta_inner * i;
		v[index] = new THREE.Vector3(r_outer*Math.cos(theta)+centerX, h_outer, -1*(r_outer*Math.sin(theta)+centerZ));
		index++;
		v[index] = new THREE.Vector3(r_inner*Math.cos(theta)+centerX, h_inner, -1*(r_inner*Math.sin(theta)+centerZ));
		index++;
	}

	// Curve 2 (Section 3)
	r_outer = 1.5;
	r_inner = 0.5;
	centerX = 3;
	centerZ = 4;
	h0_outer = h_outer;
	h1_outer = h_inner;
	delta_outer = (h1_outer - h0_outer) / segment;
	h0_inner = h_inner;
	h1_inner = h_inner;
	delta_inner = (h1_inner - h0_inner) / segment;

	for (var i = 0; i <= segment; i++)
	{
		var theta = (-i/segment) * Math.PI; // 0 -> -PI (clockwise)
		h_outer = h0_outer + delta_outer * i;
		h_inner = h0_inner + delta_inner * i;
		v[index] = new THREE.Vector3(r_outer*Math.cos(theta)+centerX, h_outer, -1*(r_outer*Math.sin(theta)+centerZ));
		index++;
		v[index] = new THREE.Vector3(r_inner*Math.cos(theta)+centerX, h_inner, -1*(r_inner*Math.sin(theta)+centerZ));
		index++;
	}

	// Curve 3 (Section 4)
	r_outer = 1.0;
	r_inner = 0.0;
	centerX = 1.5;
	centerZ = 4;
	h0_outer = h_outer;
	h1_outer = h_inner + 0.25;
	delta_outer = (h1_outer - h0_outer) / segment;
	h0_inner = h0_outer;
	h0_outer = h0_outer;
	delta_inner = (h1_inner - h0_inner) / segment;

	for (var i = 0; i <= segment; i++)
	{
		var theta = (i/segment) * Math.PI; // 0 -> PI (counter-clock)
		h_outer = h0_outer + delta_outer * i;
		h_inner = h0_inner + delta_inner * i;
		v[index] = new THREE.Vector3(r_inner*Math.cos(theta)+centerX, h_inner, -1*(r_inner*Math.sin(theta)+centerZ));
		index++;
		v[index] = new THREE.Vector3(r_outer*Math.cos(theta)+centerX, h_outer, -1*(r_outer*Math.sin(theta)+centerZ));
		index++;
	}

	// Curve 4 (Section 6)
	r_outer = 1.0;
	r_inner = 0.0;
	centerX = 1.5;
	centerZ = 1.0;
	h0_outer = 0.25;
	h1_outer = 0;
	delta_outer = (h1_outer - h0_outer) / segment;
	h0_inner = 0;
	h1_inner = 0;
	delta_inner = (h1_inner - h0_inner) / segment;

	for (var i = 0; i <= segment; i++)
	{
		var theta = (1+i/segment) * Math.PI; // PI -> 2PI (counter-clock)
		h_outer = h0_outer + delta_outer * i;
		h_inner = h0_inner + delta_inner * i;
		v[index] = new THREE.Vector3(r_inner*Math.cos(theta)+centerX, h_inner, -1*(r_inner*Math.sin(theta)+centerZ));
		index++;
		v[index] = new THREE.Vector3(r_outer*Math.cos(theta)+centerX, h_outer, -1*(r_outer*Math.sin(theta)+centerZ));
		index++;
	}

	// Curve 5 (Section 8)
	r_outer = 1.0;
	r_inner = 0.0;
	centerX = 2.5;
	centerZ = 1.5;
	h0_outer = 0;
	h1_outer = 0.25;
	delta_outer = (h1_outer - h0_outer) / segment;
	h0_inner = 0;
	h1_inner = 0;
	delta_inner = (h1_inner - h0_inner) / segment;

	for (var i = 0; i <= segment; i++)
	{
		var theta = (-1-i/segment) * Math.PI; // -PI -> -2PI (clockwise)
		h_outer = h0_outer + delta_outer * i;
		h_inner = h0_inner + delta_inner * i;
		v[index] = new THREE.Vector3(r_outer*Math.cos(theta)+centerX, h_outer, -1*(r_outer*Math.sin(theta)+centerZ));
		index++;
		v[index] = new THREE.Vector3(r_inner*Math.cos(theta)+centerX, h_inner, -1*(r_inner*Math.sin(theta)+centerZ));
		index++;
	}

	// Curve 6 (Section 10)
	r_outer = 2.0;
	r_inner = 1.0;
	centerX = 1.5;
	centerZ = 0.0;
	h0_outer = 0.25;
	h1_outer = 0;
	delta_outer = (h1_outer - h0_outer) / segment;
	h0_inner = h_inner;
	h1_inner = 0;
	delta_inner = (h1_inner - h0_inner) / segment;

	for (var i = 0; i <= segment; i++) // Include the starting point
	{
		var theta = (-i/segment) * Math.PI; // 0 -> -PI (clockwise)
		h_outer = h0_outer + delta_outer * i;
		h_inner = h0_inner + delta_inner * i;
		v[index] = new THREE.Vector3(r_outer*Math.cos(theta)+centerX, h_outer, -1*(r_outer*Math.sin(theta)+centerZ));
		index++;
		v[index] = new THREE.Vector3(r_inner*Math.cos(theta)+centerX, h_inner, -1*(r_inner*Math.sin(theta)+centerZ));
		index++;
	}

	this.distances[0] = 8.0;
	this.distances[1] = 4*Math.PI;
	this.distances[2] = 2*Math.PI;
	this.distances[3] = 1.75*Math.PI; // It actually 1*PI, but it's pretty tight curve. It looks more natural to be slower (simulate longer distance)
	this.distances[4] = 6.0;
	this.distances[5] = 1.75*Math.PI; // It actually 1*PI, but it's pretty tight curve. It looks more natural to be slower (simulate longer distance)
	this.distances[6] = 1;
	this.distances[7] = 1.75*Math.PI; // It actually 1*PI, but it's pretty tight curve. It looks more natural to be slower (simulate longer distance)
	this.distances[8] = 3;
	this.distances[9] = 3*Math.PI;

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

	//var wireframe = new THREE.WireframeHelper(object, 0xee0000);
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
	//line.position.x = 0.2;
	//line.position.y = 0.2;
	//group.add(line);

	var twin = new THREE.Mesh(geom, new THREE.MeshBasicMaterial( { color: 0xcc0008 } ));
	twin.position.y = -0.1;
	group.add(twin);

	this.object.castShadow = false;
	this.object.receiveShadow = true;
	group.add(this.object);

	// Some cool vertical line on faces
	//var fnh = new THREE.FaceNormalsHelper(this.object, 1);
	//this.scene.add(fnh);

	// Some cool vertical line on faces
	//var vnh = new THREE.VertexNormalsHelper(this.object, 5);
	//this.scene.add(vnh);

	//_scene.add(new THREE.BoxHelper(line));
}

RaceTrack.prototype.GetCameraPos = function(t)
{
	var y = 3.3333;
	var delay = 4.3333;
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

	var accum = [];
	for (var i = 0; i < this.distances.length; i++)
	{
		accum[i] = 0;
		for (var j = 0; j < i; j++)
		{
			accum[i] += this.distances[j];
		}
	}

	while (true)
	{
		var startOver = false;
		var x = 0;
		var z = 0;
		var v_x = 0;
		var v_z = 0;
		if (t < accum[0] + this.distances[0])
		{
			x = offset;
			z = -t;
			v_x = 0.05;
			v_z = 0;
		}
		else if (t < accum[1] + this.distances[1])
		{
			var theta = -1 - (t - accum[1]) / this.distances[1];
			var r = (4 - offset);
			x = r*Math.cos(Math.PI*theta)+4;
			z = -1*(r*Math.sin(Math.PI*theta)+8);
			v_x = 0.05*Math.cos(Math.PI*(t - accum[1]) / this.distances[1]);
			v_z = 0.05*Math.sin(Math.PI*(t - accum[1]) / this.distances[1]);
		}
		else if (t < accum[2] + this.distances[2])
		{
			var theta = -(t - accum[2]) / this.distances[2];
			var r = (2 - offset);
			x = r*Math.cos(Math.PI*theta)+6;
			z = -1*(r*Math.sin(Math.PI*theta)+8);
			v_x = -0.05*Math.cos(Math.PI*(t - accum[2]) / this.distances[2]);
			v_z = -0.05*Math.sin(Math.PI*(t - accum[2]) / this.distances[2]);
		}
		else if (t < accum[3] + this.distances[3])
		{
			var theta = (t - accum[3]) / this.distances[3];
			var r = (1 + offset);
			x = r*Math.cos(Math.PI*theta)+3;
			z = -1*(r*Math.sin(Math.PI*theta)+8);
			v_x = 0.1*Math.cos(Math.PI*(t - accum[3]) / this.distances[3]);
			v_z = -0.1*Math.sin(Math.PI*(t - accum[3]) / this.distances[3]);
		}
		else if (t < accum[4] + this.distances[4])
		{
			x = 2 - offset;
			z = -2 - (this.distances[4] - (t - accum[4]));
			v_x = -0.05;
			v_z = 0;
		}
		else if (t < accum[5] + this.distances[5])
		{
			var theta = 1 + (t - accum[5]) / this.distances[5];
			var r = 1 + offset;
			x = r*Math.cos(Math.PI*theta)+3;
			z = -1*(r*Math.sin(Math.PI*theta)+2);
			v_x = -0.1*Math.cos(Math.PI*(t - accum[5]) / this.distances[5]);
			v_z = 0.1*Math.sin(Math.PI*(t - accum[5]) / this.distances[5]);
		}
		else if (t < accum[6] + this.distances[6])
		{
			x = 4 + offset;
			z = - (t - accum[6] + 2);
			v_x = 0.05;
			v_z = 0;
		}
		else if (t < accum[7] + this.distances[7])
		{
			var theta = -1 - (t - accum[7]) / this.distances[7];
			var r = 1 - offset;
			x = r*Math.cos(Math.PI*theta)+5;
			z = -1*(r*Math.sin(Math.PI*theta)+3);
			v_x = 0.1*Math.cos(Math.PI*(t - accum[7]) / this.distances[7]);
			v_z = 0.1*Math.sin(Math.PI*(t - accum[7]) / this.distances[7]);
		}
		else if (t < accum[8] + this.distances[8])
		{
			x = 6 - offset;
			z = -(this.distances[8] - (t - accum[8]));
			v_x = -0.05;
			v_z = 0;
		}
		else if (t < accum[9] + this.distances[9])
		{
			var theta = -(t - accum[9]) / this.distances[9];
			var r = 3 - offset;
			x = r*Math.cos(Math.PI*theta)+3;
			z = -1*(r*Math.sin(Math.PI*theta));
			v_x = -0.05*Math.cos(Math.PI*(t - accum[9]) / this.distances[9]);
			v_z = -0.05*Math.sin(Math.PI*(t - accum[9]) / this.distances[9]);
		}
		else
		{
			startOver = true;
		}
		
		if (startOver)
		{
			t -= (accum[9] + this.distances[9]);
		}
		else
		{
			if (delay == 0)
				return { position: this.GetVertex(x, z, radius), velocity: new THREE.Vector3(v_x, 0, v_z) };
			else
				return { position: new THREE.Vector3(x, y, z) };
		}
	}
}

RaceTrack.prototype.getLength = function()
{
	var len = 0;
	for (var i = 0; i < this.distances.length; i++)
	{
		len += this.distances[i];
	}
	return len;
}
