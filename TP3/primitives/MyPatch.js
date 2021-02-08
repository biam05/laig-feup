/**
 * My Plane
 * Patch Primitive with U x V divisions and generated with the given control points
 */
class MyPatch extends CGFobject {
    /**
     * 
     * @param {CGFscene} scene - Reference to MyScene object
     * @param {float} npointsU - U Points
     * @param {float} npointsV - V Points
     * @param {float} npartsU  - U Divisions
     * @param {float} npartsV  - V Divisions
     * @param {array} controlpoints - group of control points
     */
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlpoints) {
        super(scene);
        this.scene = scene;
        this.upoints = npointsU;
        this.vpoints = npointsV;
        this.uparts = npartsU;
        this.vparts = npartsV;
        this.controlVertexes = controlpoints;
        this.cps = [[]];
        this.initBuffers();
    }
    
    /**
     * Init patch buffers.
     */
	initBuffers() {
        var aux = 0; // goes through controlVertexes
        for(var i = 0; i < this.upoints; i++) {
            this.cps[i] = []; // it's clear
            for(var j = 0; j < this.vpoints; j++) {
                this.cps[i][j] = this.controlVertexes[aux]; // x y z
                this.cps[i][j].push(1); // w
                aux++;
            }
        }
        var nurbsSurface = new CGFnurbsSurface(this.upoints-1, this.vpoints-1, this.cps);
        this.obj = new CGFnurbsObject(this.scene, this.uparts, this.vparts, nurbsSurface);
    }

    /**
     * Updates the Texture Coordinates based on the Amplification
     * Only here because of inheritance
     */
    updateTexCoords(afs, aft) {	}
    
    /**
     * Display Patch Primitive
     */
    display() {
        this.scene.pushMatrix();
        this.obj.display();
        this.scene.popMatrix();
    }
}
