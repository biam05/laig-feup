/**
 * MyRectangle
 * Rectangle Primitive in the XY plane
 */
class MyRectangle extends CGFobject {
    /**
     * MyRectangle
     * @constructor
     * @param {CGFScene} scene - Reference to MyScene object
     * @param {float} x1 - x coordinate corner 1
     * @param {float} y1 - y coordinate corner 1
     * @param {float} x2 - x coordinate corner 2
     * @param {float} y2 - y coordinate corner 2
     */
	constructor(scene, x1, y1, x2, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.initBuffers();
	}
    
    /**
     * Init rectangle buffers.
     */
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
            this.x2, this.y2, 0,	//3
            /*// Back Face
            this.x1, this.y1, 0,	//4
			this.x2, this.y1, 0,	//5
			this.x1, this.y2, 0,	//6
			this.x2, this.y2, 0		//7*/
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2,
			/*4, 6, 5, 
			5, 6, 7,*/
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
            0, 0, 1,
            /*// Backwards
            0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1*/
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0, (this.y2 - this.y1),
			(this.x2 - this.x1), (this.y2 - this.y1),
			0, 0,
            (this.x2 - this.x1), 0,
			
			/*// Back Face
            0, (this.y2 - this.y1),
			(this.x2 - this.x1), (this.y2 - this.y1),
			0, 0,
            (this.x2 - this.x1), 0*/
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

    /**
     * Updates the Texture Coordinates based on the Amplification
     * @param {float} afs - Amplification Factor on S 
     * @param {float} aft - Amplification Factor on T
     */
	updateTexCoords(afs, aft) {
		var tmp = this.texCoords;
        var auxCoords = [];
        for(let i = 0; i < this.texCoords.length; i++){
            if(i % 2 == 0) auxCoords.push(this.texCoords[i]/afs);
            else auxCoords.push(this.texCoords[i]/aft);
        }
        this.texCoords = auxCoords;
        this.updateTexCoordsGLBuffers();
		this.texCoords = tmp;	
	}
}
