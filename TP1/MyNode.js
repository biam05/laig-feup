/**
 * MyNode class: represents a node from the graph
**/
class MyNode {
    /**
     * MyNode
     * @constructor
     * @param {MySceneGraph} graph 
     * @param {node element id} nodeID 
     */
    constructor(graph, nodeID) {
        this.graph = graph;
        this.nodeID = nodeID;
        this.children = [];
        this.leaves = [];

        this.material = null;
        this.texture = null;

        this.matrix = mat4.create();
        mat4.identity(this.matrix);
    }

    /**
     * Add a child identified by leaf
     * @param {leaf element} leaf 
     */
    addLeaf(leaf) {
        this.leaves.push(leaf);
    }

    /**
     * Add a child identified by nodeID
     * @param {node element} nodeID 
     */
    addChild(nodeID) {
        this.children.push(nodeID);
    }
}

    