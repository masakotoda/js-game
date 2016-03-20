
function WinnerBanner(scene)
{
	this.scene = scene;
	this.mesh = null;
	this.timer = 40;
	this.winner = null;
}

WinnerBanner.prototype.init = function(font, winner)
{
	this.winner = winner;
	this.winner.mesh.position.set(0, 1, 0);

	var size = 0.15;
	var height = 0.1;
	var bevelThickness = 0.01;
	var bevelSize = 0.01;
	var bevelEnabled = true;
	var curveSegments = 4;

	var textGeo = new THREE.TextGeometry("Winner: " + winner.identity + "!",
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

	var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
	this.mesh = new THREE.Mesh(textGeo, material);

	this.mesh.position.set(-0.80, 2, 0);
	this.mesh.rotation.set(0, 0, 0);

	this.scene.add(this.mesh);
}

WinnerBanner.prototype.tick = function()
{
	if (this.timer > 0)
	{
		this.timer--;
	}
	else
	{
		this.mesh.rotation.x -= 0.01;
		this.winner.mesh.rotation.y += 0.02;
	}
}

WinnerBanner.prototype.isReady = function()
{
	return (this.timer == 0 && this.winner == null);
}
