/**
 * MyLeaf class: represents the possible primitives (leaves)
**/
class MyLeaf {
    /**
     * MyLeaf
     * @constructor
     * @param {MySceneGraph} graph - Scene Graph
     * @param {leaf element} element - Leaf Element on the XML File
     * @param {float} afs - Amplification Factor on S
     * @param {float} aft - Amplification Factor on T
     */
    constructor(graph, element, afs, aft) {
        this.graph = graph;
        this.primitive = null;
        this.afs = afs;
        this.aft = aft;

        // gets the type of the primitive from the xml file
        var type = this.graph.reader.getItem(element, 'type', ['rectangle', 'torus', 'triangle', 'sphere', 'cylinder', 'skybox']);
        
        // switch to decide what primitive is going to be shown in the screen
        switch(type) {
            case 'rectangle':
                this.x1 = this.graph.reader.getFloat(element, 'x1');
                if (this.varError('rectangle', 'x1', this.x1)) break;   

                this.y1 = this.graph.reader.getFloat(element, 'y1');
                if (this.varError('rectangle', 'y1', this.y1)) break; 

                this.x2 = this.graph.reader.getFloat(element, 'x2');
                if (this.varError('rectangle', 'x2', this.x2)) break; 

                this.y2 = this.graph.reader.getFloat(element, 'y2');
                if (this.varError('rectangle', 'y2', this.y2)) break;  

                this.primitive = new MyRectangle(this.graph.scene, this.x1, this.y1, this.x2, this.y2);
                break;

            case 'triangle':
                this.x1 = this.graph.reader.getFloat(element, 'x1',);
                if (this.varError('triangle', 'x1', this.x1)) break;

                this.y1 = this.graph.reader.getFloat(element, 'y1');
                if (this.varError('triangle', 'y1', this.y1)) break;

                this.x2 = this.graph.reader.getFloat(element, 'x2');
                if (this.varError('triangle', 'x2', this.x2)) break;

                this.y2 = this.graph.reader.getFloat(element, 'y2');
                if (this.varError('triangle', 'y2', this.y2)) break;

                this.x3 = this.graph.reader.getFloat(element, 'x3');
                if (this.varError('triangle', 'x3', this.x3)) break;

                this.y3 = this.graph.reader.getFloat(element, 'y3');
                if (this.varError('triangle', 'y3', this.y3)) break;

                this.primitive = new MyTriangle(this.graph.scene, this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
                break;

            case 'sphere':
                this.radius = this.graph.reader.getFloat(element, 'radius');
                if (this.varError('sphere', 'radius', this.radius)) break;

                this.slices = this.graph.reader.getFloat(element, 'slices');
                if (this.varError('sphere', 'slices', this.slices)) break;

                this.stacks = this.graph.reader.getFloat(element, 'stacks');
                if (this.varError('sphere', 'stacks', this.stacks)) break;

                this.primitive = new MySphere(this.graph.scene, this.radius, this.slices, this.stacks);
                break;

            case 'cylinder':
                this.height = this.graph.reader.getFloat(element, 'height');
                if (this.varError('cylinder', 'height', this.height)) break;

                this.topRadius = this.graph.reader.getFloat(element, 'topRadius');
                if (this.varError('cylinder', 'topRadius', this.topRadius)) break;

                this.bottomRadius = this.graph.reader.getFloat(element, 'bottomRadius');
                if (this.varError('cylinder', 'bottomRadius', this.bottomRadius)) break;

                this.stacks = this.graph.reader.getFloat(element, 'stacks');
                if (this.varError('cylinder', 'stacks', this.stacks)) break;

                this.slices = this.graph.reader.getFloat(element, 'slices');
                if (this.varError('cylinder', 'slices', this.slices)) break;
                
                this.primitive = new MyCylinder(this.graph.scene, this.height, this.topRadius, this.bottomRadius, this.stacks, this.slices);
                break;

            case 'torus':
                this.inner  = this.graph.reader.getFloat(element, 'inner');
                if (this.varError('torus', 'inner', this.inner)) break;

                this.outer  = this.graph.reader.getFloat(element, 'outer');
                if (this.varError('torus', 'outer', this.outer)) break;

                this.slices = this.graph.reader.getFloat(element, 'slices');
                if (this.varError('torus', 'slices', this.slices)) break;

                this.loops  = this.graph.reader.getFloat(element, 'loops');
                if (this.varError('torus', 'loops', this.loops)) break;
                
                this.primitive = new MyTorus(this.graph.scene, this.inner, this.outer, this.slices, this.loops);
                break;

            default:
                // Error with the spelling of the primitive's type
                // Not implemented
                this.graph.onXMLMinorError("This primitive is not implemented");
                this.primitive = null;
                break;
        }
    }

    /**
     * function used to know is the variable read is a number or not
     * @param {leaf element} leaf 
     * @param {string} variableName 
     * @param {value} variable
     */
    varError(leaf, variableName, variable) {
        if (isNaN(variable)) {
            this.graph.onXMLMinorError(leaf + ": " + variableName + ": not a number");
            return true;
        }
        return false;
    }
}