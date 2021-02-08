/**
 * MySphere
 * Sphere Primitive centered on the origin and with its axis parallel to the Z axis
 * CODE ADAPTED FROM THE CLASS MySphere FROM CGRA
 */
class MySphere extends CGFobject {
    /**
     * MySphere
     * @constructor
     * @param {CGFScene} scene - Reference to MyScene object
     * @param {float} radius - sphere radius
     * @param {float} slices - number of slices around Y axis
     * @param {float} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
     */
    constructor(scene, radius, slices, stacks) {
        super(scene);
        this.radius = radius;
        this.latDivs = stacks;
        this.longDivs = slices;

        this.initBuffers();
    }
    
    /**
     * Init sphere buffers.
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        var phi = 0;
        var theta = 0;
        var phiInc = (2 * Math.PI) / this.latDivs;
        var thetaInc = (2 * Math.PI) / this.longDivs;
        var latVertices = this.longDivs + 1;
    
        // build an all-around stack at a time, starting on "north pole" and proceeding "south"
        for (let latitude = 0; latitude <= this.latDivs; latitude++) {
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);
    
            // in each stack, build all the slices around, starting on longitude 0
            theta = 0;
            for (let longitude = 0; longitude <= this.longDivs; longitude++) {
                //--- Vertices coordinates
                var x = this.radius * Math.sin(-theta) * sinPhi;
                var y = this.radius * Math.cos(theta) * sinPhi;
                var z = this.radius * cosPhi;
                this.vertices.push(x, y, z);
    
                //--- Indices
                if (latitude < this.latDivs && longitude < this.longDivs) {
                    var current = latitude * latVertices + longitude;
                    var next = current + latVertices;
                    // pushing two triangles using indices from this round (current, current+1)
                    // and the ones directly south (next, next+1)
                    // (i.e. one full round of slices ahead)
                    
                    this.indices.push(current + 1, current, next);
                    this.indices.push(current + 1, next, next + 1);
                }
    
                //--- Normals
                // at each vertex, the direction of the normal is equal to 
                // the vector from the center of the sphere to the vertex.
                // in a sphere of radius equal to one, the vector length is one.
                // therefore, the value of the normal is equal to the position vector
                this.normals.push(x/this.radius, y/this.radius, z/this.radius);
                theta += thetaInc;
    
                //--- Texture Coordinates
                this.texCoords.push(longitude/this.longDivs , (latitude * 2)/this.latDivs);
            }
            phi += phiInc;
        }

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
