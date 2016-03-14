
function TitleText(scene)
{
	this.scene = scene;
	this.mesh;
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

	this.mesh.position.x = -1;
	this.mesh.position.y = 2;
	this.mesh.position.z = 0;

	this.mesh.rotation.x = 0;
	this.mesh.rotation.y = 0;

	this.scene.add(this.mesh);
}
