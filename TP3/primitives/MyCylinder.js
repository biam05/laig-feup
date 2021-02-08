/**
 * My Cilinder
 * Cylinder Primitive parallel to the Z axis and the base on the XY plane
 */
class MyCylinder extends CGFobject {
    /**
     * MyCylinder 
     * @constructor
     * @param {CGFScene} scene - Reference to MyScene object
     * @param {float} height - cylinder's height
     * @param {float} topRadius - top radius
     * @param {float} bottomRadius - bottom radius
     * @param {float} stacks - number of height divisions
     * @param {float} slices - number of slices around Z axis
    */
    constructor(scene, height, bottomRadius, topRadius, stacks, slices) {
        super(scene);
        this.height = height;
        this.topRadius = topRadius;
        this.bottomRadius = bottomRadius;
        this.heightDivs = stacks;
        this.circleDivs = slices;

        this.initBuffers();
    }

    /**
     * Init cylinder buffers.
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        var angleInc = (2 * Math.PI) / this.circleDivs;
        var circleVertices = this.circleDivs + 1;    
        var heightInc = - this.height / this.heightDivs;
        var currentRadius = this.bottomRadius;
        var radiusInc = (this.topRadius - this.bottomRadius) / this.heightDivs;
    
        var currentHeight = this.height;
        var angle = 0;
        var x;
        var y;
        var z;

        // All Around
        // build an all-around stack at a time, starting on "z=0" and proceeding "for positive z"
        for (let stack = 0; stack <= this.heightDivs; stack++) {
            // in each stack, build all the slices around
            angle = 0;
            for (let slice = 0; slice <= this.circleDivs; slice++) {
                //--- Vertices coordinates
                x = currentRadius * Math.sin(-angle);
                y = currentRadius * Math.cos(angle);
                z = currentHeight;
                this.vertices.push(x, y, z);
    
                //--- Indices
                if (stack < this.heightDivs && slice < this.circleDivs) {
                    var current = stack * circleVertices + slice;
                    var next = current + circleVertices;
                    // pushing two triangles using indices from this round (current, current+1)
                    // and the ones directly south (next, next+1)
                    // (i.e. one full round of slices ahead)
                    this.indices.push(current + 1, current, next);
                    this.indices.push(current + 1, next, next + 1);
                }
    
                //--- Normals
                // at each vertex, the direction of the normal is equal to 
                // the vector from the center of the cylinder to the vertex.
                if (this.height > 0) {
                    this.normals.push(x/currentRadius, y/currentRadius, 0);
                }
                else {
                    this.normals.push(-x/currentRadius, -y/currentRadius, 0);
                }
    
                //--- Texture Coordinates
                this.texCoords.push(slice/this.circleDivs , stack/this.heightDivs);

                angle += angleInc;
            }
            currentHeight += heightInc;
            currentRadius += radiusInc;
        }

        // Texture Coordinates on a Circle
        // s = (x + radius) / (2 * radius)
        // t = (y + radius) / (2 * radius)

        // Circle : Z = height
        for (let line = 0; line <= 1; line++) {
            angle = 0;
            for (let slice = 0; slice <= this.circleDivs; slice++) {
                //--- Vertices coordinates
                x = line * this.topRadius * Math.sin(-angle);
                y = line * this.topRadius * Math.cos(angle);
                z = 0;
                this.vertices.push(x, y, z);
                
                //--- Indices
                if (line == 1 && slice < this.circleDivs) {
                    var current = (this.heightDivs + 1) * circleVertices + slice;
                    var next = current + circleVertices;

                    this.indices.push(current + 1, next + 1, next);
                }
                //--- Normals
                this.normals.push(0, 0, -1);

                //--- Texture Coordinates
                this.texCoords.push((x + this.topRadius)/(2 * this.topRadius) , (y + this.topRadius)/(2 * this.topRadius));

                angle += angleInc;
            }
        }

        // Circle Z = 0
        for (let line = 0; line <= 1; line++) {
            angle = 0;
            for (let slice = 0; slice <= this.circleDivs; slice++) {
                //--- Vertices coordinates
                x = line * this.bottomRadius * Math.sin(-angle);
                y = line * this.bottomRadius * Math.cos(angle);
                z = this.height;
                this.vertices.push(x, y, z);
                
                //--- Indices
                if (line == 1 && slice < this.circleDivs) {
                    var current = (this.heightDivs + 3) * circleVertices + slice;
                    var next = current + circleVertices;

                    this.indices.push(current + 1, next, next + 1);
                }
                //--- Normals
                this.normals.push(0, 0, 1);

                //--- Texture Coordinates
                this.texCoords.push((x + this.bottomRadius)/(2 * this.bottomRadius) , (y + this.bottomRadius)/(2 * this.bottomRadius));

                angle += angleInc;
            }
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
        for (let i = 0; i < this.texCoords.length; ++ i) {
            if (i % 2 == 0) auxCoords.push(this.texCoords[i]/afs);
            else auxCoords.push(this.texCoords[i]/aft);
        }
        this.texCoords = auxCoords;
        this.updateTexCoordsGLBuffers();
        this.texCoords = tmp;
	}
}
