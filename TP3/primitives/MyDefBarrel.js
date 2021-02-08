/**
 * My Def Barrel
 * Barrel Primitive parallel to the Z axis and the base on the XY plane
 */
class MyDefBarrel extends CGFobject {
   /**
    * MyDefBarrel
    * @constructor
    * @param {CGFScene} scene - MyScene object
    * @param {float} base   - base radius
    * @param {float} middle - middle radius
    * @param {float} height - barrel height
    * @param {float} slices - number of divisions around Z axis
    * @param {float} stacks - number of height divisions
    */
    constructor(scene, base, middle, height, slices, stacks) {
        super(scene);
        this.base   = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

		this.initBuffers();
    }
    
    /**
     * Init def barrel buffers.
     */
	initBuffers() {
        var r = this.base;
        var h = 4/3 * r;
        var R = this.middle;
        var H = 4/3 * (R - r);
        var L = this.height;
        var alpha = Math.PI / 6; // 30 degrees
        var outControlvertexes = [
            // Outside Face
            [
                [    r   , 0,             0          , 1],
                [  r + H , 0,     H / Math.tan(alpha), 1],
                [  r + H , 0, L - H / Math.tan(alpha), 1],
                [    r   , 0,             L          , 1]
            ],
            [
                [    r   , h,             0          , 1],
                [  r + H , h,     H / Math.tan(alpha), 1],
                [  r + H , h, L - H / Math.tan(alpha), 1],
                [    r   , h,             L          , 1]
            ],
            [
                [   -r   , h,             0          , 1],
                [-(r + H), h,     H / Math.tan(alpha), 1],
                [-(r + H), h, L - H / Math.tan(alpha), 1],
                [   -r   , h,             L          , 1]
            ],
            [
                [   -r   , 0,             0          , 1],
                [-(r + H), 0,     H / Math.tan(alpha), 1],
                [-(r + H), 0, L - H / Math.tan(alpha), 1],
                [   -r   , 0,             L          , 1]
            ]
        ];
        
        var inControlvertexes = [
            // Inside Face
            [
                [   -r   , 0,             0          , 1],
                [-(r + H), 0,     H / Math.tan(alpha), 1],
                [-(r + H), 0, L - H / Math.tan(alpha), 1],
                [   -r   , 0,             L          , 1]
            ],
            [
                [   -r   , h,             0          , 1],
                [-(r + H), h,     H / Math.tan(alpha), 1],
                [-(r + H), h, L - H / Math.tan(alpha), 1],
                [   -r   , h,             L          , 1]
            ],
            [
                [    r   , h,             0          , 1],
                [  r + H , h,     H / Math.tan(alpha), 1],
                [  r + H , h, L - H / Math.tan(alpha), 1],
                [    r   , h,             L          , 1]
            ],
            [
                [    r   , 0,             0          , 1],
                [  r + H , 0,     H / Math.tan(alpha), 1],
                [  r + H , 0, L - H / Math.tan(alpha), 1],
                [    r   , 0,             L          , 1]
            ]

        ];

        var outNurbsSurface = new CGFnurbsSurface(3, 3, outControlvertexes);
        var  inNurbsSurface = new CGFnurbsSurface(3, 3,  inControlvertexes);
        this.outsideObject = new CGFnurbsObject(this.scene, this.slices, this.stacks, outNurbsSurface);
        this.insideObject  = new CGFnurbsObject(this.scene, this.slices, this.stacks,  inNurbsSurface);
    }

    /**
     * Updates the Texture Coordinates based on the Amplification
     * Only here because of inheritance
     */
    updateTexCoords(afs, aft) { }

    /**
     * Display Barrel Primitive
     */
    display() {
        this.scene.pushMatrix();
        this.outsideObject.display();
        this.insideObject.display();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.outsideObject.display();
        this.insideObject.display();
        this.scene.popMatrix();
    }
}
