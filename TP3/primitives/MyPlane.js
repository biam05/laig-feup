/**
 * My Plane
 * Plane Primitive with U x V divisions
 */
class MyPlane extends CGFobject {
    /**
     * MyPlane
     * @constructor
     * @param {CGFScene} scene - Reference to MyScene object
     * @param {float} npartsU - number of U divisions
     * @param {float} npartsV - number of V divisions
     */
    constructor(scene, npartsU, npartsV) {
        super(scene);
        this.scene = scene;
        this.u = npartsU;
        this.v = npartsV;
		this.initBuffers();
    }
    
    /**
     * Init plane buffers.
     */
	initBuffers() {
        this.cps = 
        [
            [
                [-0.5, 0.0,  0.5, 1 ],
                [-0.5, 0.0, -0.5, 1 ]
            ],
            [
                [ 0.5, 0.0,  0.5, 1 ],
                [ 0.5, 0.0, -0.5, 1 ]							 
            ]
        ];

        var nurbsSurface = new CGFnurbsSurface(1, 1, this.cps);
        this.obj = new CGFnurbsObject(this.scene, this.u, this.v, nurbsSurface);
    }
    
    /**
     * Updates the Texture Coordinates based on the Amplification
     * Only here because of inheritance
     */
    updateTexCoords(afs, aft) { }
    
    /**
     * Display Plane Primitive
     */
    display() {
        this.scene.pushMatrix();
        this.obj.display();
        this.scene.popMatrix();
    }
}
