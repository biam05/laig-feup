/**
 * MyTriangle
 * Triangle Primitive in the XY plane
 * CODE ADAPTED FROM THE CLASS MyTriangle FROM CGRA
 */
class MyTriangle extends CGFobject {
    /**
     * MyTriangle
     * @constructor
     * @param {CGFScene} scene - Reference to MyScene object
     * @param {float} x1 - x coordinate corner 1
     * @param {float} y1 - y coordinate corner 1
     * @param {float} x2 - x coordinate corner 2
     * @param {float} y2 - y coordinate corner 2
     * @param {float} x3 - x coordinate corner 3
     * @param {float} y3 - y coordinate corner 3
     */
	constructor(scene, x1, y1, x2, y2, x3, y3) {
		super(scene);
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3;

		this.a = 0;
		this.b = 0;
		this.c = 0;

		this.cosalfa = 0;
		this.sinalfa = 0;

		this.initBuffers();
    }
    
    /**
     * Init triangle buffers.
     */
	initBuffers() {

		this.a = Math.sqrt(Math.pow(this.x2-this.x1,2)+Math.pow(this.y2-this.y1,2));
		this.b = Math.sqrt(Math.pow(this.x3-this.x2,2)+Math.pow(this.y3-this.y2,2));
		this.c = Math.sqrt(Math.pow(this.x1-this.x3,2)+Math.pow(this.y1-this.y3,2));
		
		this.cosalfa = (Math.pow(this.a,2)-Math.pow(this.b,2)+Math.pow(this.c,2))/(2*this.a*this.c);
		this.sinalfa = Math.sqrt(1 - Math.pow(this.cosalfa, 2));
		
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y2, 0,	//1
            this.x3, this.y3, 0,	//2
            // Back Face
            this.x1, this.y1, 0,	//3
			this.x2, this.y2, 0,	//4
			this.x3, this.y3, 0 	//5
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			2, 1, 0
        ];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1
		];

		/*

				V3
			c		b
		V1		a		V2
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

	   this.texCoords = [
 
		
		0, 1,
		this.a, 1,
		this.c * this.cosalfa, 1 - this.c * this.sinalfa
		
	]

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
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
        for (let i = 0; i < this.texCoords.length; i++) {
            if (i % 2 == 0) auxCoords.push(this.texCoords[i]/afs);
            else auxCoords.push(this.texCoords[i]/aft);
        }
        this.texCoords = auxCoords;
        this.updateTexCoordsGLBuffers();
        this.texCoords = tmp;
    }
}
