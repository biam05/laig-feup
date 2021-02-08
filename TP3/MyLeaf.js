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
        var type = this.graph.reader.getItem(element, 'type', ['rectangle', 'torus', 'triangle',
         'sphere', 'cylinder', 'spritetext', 'spriteanim', 'plane', 'patch', 'defbarrel', 'obj']);
        
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

                // Create Primitive
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

                // Create Primitive
                this.primitive = new MyTriangle(this.graph.scene, this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
                break;

            case 'sphere':
                this.radius = this.graph.reader.getFloat(element, 'radius');
                if (this.varError('sphere', 'radius', this.radius)) break;

                this.slices = this.graph.reader.getFloat(element, 'slices');
                if (this.varError('sphere', 'slices', this.slices)) break;

                this.stacks = this.graph.reader.getFloat(element, 'stacks');
                if (this.varError('sphere', 'stacks', this.stacks)) break;

                // Create Primitive
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
                
                // Create Primitive
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
                
                // Create Primitive
                this.primitive = new MyTorus(this.graph.scene, this.inner, this.outer, this.slices, this.loops);
                break;

            case 'spritetext':
                // Text based on a spritesheet
                this.text = this.graph.reader.getString(element, 'text');
                if (this.text == null) { this.graph.onXMLMinorError("Error in text in leaf spritetext"); break; }

                // Create Primitive
                this.primitive = new MySpriteText(this.graph.scene, this.text);
                break;
            
            case 'spriteanim':
                // Animation based on a spritesheet
                this.ssid = this.graph.reader.getString(element, 'ssid');
                if (this.ssid == null) { this.graph.onXMLMinorError("Error in ssid in leaf spriteanim"); break; }
                
                this.spritesheet = this.graph.spritesheets[this.ssid];
                if (this.spritesheet == null) { this.graph.onXMLMinorError("Spritesheed ID " + this.ssid + " doesn't exist"); break; }
                
                this.startCell = this.graph.reader.getFloat(element, 'startCell');
                if (this.varError('spriteanim', 'startCell', this.startCell)) break;
                
                this.endCell = this.graph.reader.getFloat(element, 'endCell');
                if (this.varError('spriteanim', 'endtCell', this.endCell)) break;
                
                this.duration = this.graph.reader.getFloat(element, 'duration');
                if (this.varError('spriteanim', 'duration', this.duration)) break;

                // Create Primitive
                this.primitive = new MySpriteAnim(this.graph.scene, this.spritesheet, this.duration, this.startCell, this.endCell);
                // Add to graph animations so that they can be updated later
                this.graph.animatedSprites.push(this.primitive);
                break;
            
            case 'plane':
                // Plane, generated with NURBS
                this.npartsU = this.graph.reader.getFloat(element, 'npartsU');
                if (this.varError('plane', 'npartsU', this.npartsU)) break;
                
                this.npartsV = this.graph.reader.getFloat(element, 'npartsV');
                if (this.varError('plane', 'npartsV', this.npartsV)) break;

                // Create Primitive
                this.primitive = new MyPlane(this.graph.scene, this.npartsU, this.npartsV);
                break;
            
            case 'patch':
                // Patch, generated with NURBS
                this.npointsU = this.graph.reader.getFloat(element, 'npointsU');
                if (this.varError('patch', 'npointsU', this.npointsU)) break;
                
                this.npointsV = this.graph.reader.getFloat(element, 'npointsV');
                if (this.varError('patch', 'npointsV', this.npointsV)) break;
                
                this.npartsU  = this.graph.reader.getFloat(element,  'npartsU');
                if (this.varError('patch',  'npartsU', this.npartsU )) break;
                
                this.npartsV  = this.graph.reader.getFloat(element,  'npartsV');
                if (this.varError('patch',  'npartsV', this.npartsV )) break;

                this.controlpoints = [];
                var aux = element.children;
                var error = false;

                for (let i = 0; i < aux.length; ++ i) {
                    var cp = [];
                    var x = this.graph.reader.getFloat(aux[i], 'x');
                    if (this.varError('patch', 'x', x)){error = true; break;}
                    var y = this.graph.reader.getFloat(aux[i], 'y');
                    if (this.varError('patch', 'y', y)){error = true; break;}
                    var z = this.graph.reader.getFloat(aux[i], 'z');
                    if (this.varError('patch', 'z', z)){error = true; break;}
                    cp = [x, y, z];
                    this.controlpoints.push(cp);
                }
                if (error) break;

                // Create Primitive
                this.primitive = new MyPatch(this.graph.scene, this.npointsU, this.npointsV, this.npartsU, this.npartsV, this.controlpoints);
                break;
            
            case 'defbarrel':
                // Barrel Form, generated with NURBS
                this.base = this.graph.reader.getFloat(element, 'base');
                if (this.varError('defbarrel',   'base', this.base  )) break;                
                
                this.middle = this.graph.reader.getFloat(element, 'middle');
                if (this.varError('defbarrel', 'middle', this.middle)) break;
                
                this.height = this.graph.reader.getFloat(element, 'height');
                if (this.varError('defbarrel', 'height', this.height)) break;
                
                this.slices = this.graph.reader.getFloat(element, 'slices');
                if (this.varError('defbarrel', 'slices', this.slices)) break;
                
                this.stacks = this.graph.reader.getFloat(element, 'stacks');
                if (this.varError('defbarrel', 'stacks', this.stacks)) break;
                
                // Create Primitive
                this.primitive = new MyDefBarrel(this.graph.scene, this.base, this.middle, this.height, this.slices, this.stacks);
                break;
            
            case 'obj':
                this.url = this.graph.reader.getString(element, 'url');      

                // Create Primitive
                this.primitive = new CGFOBJModel(this.graph.scene, this.url, false);
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
