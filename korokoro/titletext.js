
function TitleText(scene)
{
	this.scene = scene;
	this.mesh = null;
}

TitleText.prototype.init = function(font)
{
	var size = 0.15;
	var height = 0.1;
	var bevelThickness = 0.01;
	var bevelSize = 0.01;
	var bevelEnabled = true;
	var curveSegments = 4;

	var textGeo = new THREE.TextGeometry("korokoro word hunt",
		{
			font: font,
			size: size,
			height: height,
			curveSegments: curveSegments,

			bevelThickness: bevelThickness,
			bevelSize: bevelSize,
			bevelEnabled: bevelEnabled,

			material: 0,
			extrudeMaterial: 1
		});

	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();

	var material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
	this.mesh = new THREE.Mesh(textGeo, material);

	this.mesh.position.set(-1, 2, 0);
	this.mesh.rotation.set(0, 0, 0);

	this.scene.add(this.mesh);
}

TitleText.prototype.tick = function()
{
	if (this.mesh)
	{
		this.mesh.rotation.x -= 0.01;
	}
}

TitleText.prototype.destroy = function()
{
	this.scene.remove(this.mesh);
	delete this.mesh;
}
