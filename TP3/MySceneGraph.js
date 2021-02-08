const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITESHEETS_INDEX = 5;
var MATERIALS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var NODES_INDEX = 8;

/**
 * MySceneGraph class: representing the scene graph
 */
class MySceneGraph {
    /**
     * MySceneGraph
     * @constructor - Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /**
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;
        var animations = false;
        var spritesheets = false;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order " + index);

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order " + index);

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order " + index);

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order " + index);

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) != -1) {
            spritesheets = true;
            if (index != SPRITESHEETS_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order " + index);

            //Parse textures block
            if ((error = this.parseSpritesheets(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (spritesheets) {
                if (index != MATERIALS_INDEX)
                    this.onXMLMinorError("tag <materials> out of order " + index);
            }
            else {
                if (index != MATERIALS_INDEX-1)
                    this.onXMLMinorError("tag <materials> out of order " + index);
            }          

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        if ((index = nodeNames.indexOf("animations")) != -1) {
            animations = true;
            if (spritesheets) {
                if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order " + index);
            }
            else {
                if (index != ANIMATIONS_INDEX-1)
                this.onXMLMinorError("tag <animations> out of order " + index);
            }            

            //Parse materials block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (spritesheets) {
                if (animations) {
                    if (index != NODES_INDEX)
                        this.onXMLMinorError("tag <nodes> out of order " + index);
                }
                else {
                    if (index != NODES_INDEX-1)
                        this.onXMLMinorError("tag <nodes> out of order " + index);
                }
            }
            else {
                if (animations) {
                    if (index != NODES_INDEX-1)
                        this.onXMLMinorError("tag <nodes> out of order " + index);
                }
                else {
                    if (index != NODES_INDEX-2)
                        this.onXMLMinorError("tag <nodes> out of order " + index);
                }
            }            
            
            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("All parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");
        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        var children = viewsNode.children;

        this.cameras = [];
        this.scene.cameraIDs = [];
        
        this.default = this.reader.getString(viewsNode, 'default');
        if (this.default == null) {
            this.onXMLError('Error Parsing Default View');
        }

        var default_camera_found = false;

        for (var i = 0; i < children.length; ++ i) {
            var camera;
            // Get id of the current camera.
            var id = this.reader.getString(children[i], 'id');
            if (id == null)
                return "no ID defined for camera";

            // Checks for repeated IDs.
            if (this.cameras[id] != null)
                return "ID must be unique for each camera (conflict: ID = " + id + ")";
            

            // perspective or ortho
            if (children[i].nodeName == "perspective") {
                var near  = this.reader.getFloat(children[i], 'near');
                var far   = this.reader.getFloat(children[i], 'far');
                var angle = this.reader.getFloat(children[i], 'angle');

                if (isNaN(far)) {
                    this.onXMLMinorError("enter a valid number for 'far'; using far = 500"); 
                    far = 500;
                } 
                if (isNaN(near)) {
                    this.onXMLMinorError("enter a valid number for 'near'; using near = 0.1");
                    near = 0.1;
                } 
                if (isNaN(angle)) {
                    this.onXMLMinorError("enter a valid number for 'angle'; using angle = 45");
                    angle = 45;
                } 

                angle = angle * DEGREE_TO_RAD;

                var grandChildren = children[i].children;
                var nodeNames = [];

                for (var j = 0; j < grandChildren.length; ++ j) {
                    nodeNames.push(grandChildren[j].nodeName);
                }

                var fromID = nodeNames.indexOf('from');
                var from = this.parseCoordinates3D(grandChildren[fromID],' "from" from the camera: ' + id);

                var toID = nodeNames.indexOf("to");
                var to = this.parseCoordinates3D(grandChildren[toID],' "to" from the camera: ' + id);

                camera = new CGFcamera(angle, near, far, from, to);

                this.log("Parsed Perspective Camera");
            }
            else if (children[i].nodeName == "ortho") {
                var near   = this.reader.getFloat(children[i], 'near');
                var far    = this.reader.getFloat(children[i], 'far');
                var left   = this.reader.getFloat(children[i], 'left');
                var right  = this.reader.getFloat(children[i], 'right');
                var top    = this.reader.getFloat(children[i], 'top');
                var bottom = this.reader.getFloat(children[i], 'bottom');

                if (isNaN(far)) {
                    this.onXMLMinorError("enter a valid number for 'far'; using far = 100"); 
                    far = 100;
                } 
                if (isNaN(near)) {
                    this.onXMLMinorError("enter a valid number for 'near'; using near = 0.2");
                    near = 0.2;
                } 
                if (isNaN(left)) {
                    this.onXMLMinorError("enter a valid number for 'left'; using left = -0.2");
                    left = -0.2;
                } 
                if (isNaN(right)) {
                    this.onXMLMinorError("enter a valid number for 'right'; using right = 0.2");
                    right = 0.2;
                } 
                if (isNaN(top)) {
                    this.onXMLMinorError("enter a valid number for 'top'; using top = 0.2");
                    top = 0.2;
                } 
                if (isNaN(bottom)) {
                    this.onXMLMinorError("enter a valid number for 'bottom'; using bottom = -0.2");
                    bottom = -0.2;;
                } 

                var grandChildren = children[i].children;
                var nodeNames = [];

                for (var j = 0; j < grandChildren.length; j++) {
                    nodeNames.push(grandChildren[j].nodeName);
                }

                var fromID = nodeNames.indexOf('from');
                var from = this.parseCoordinates3D(grandChildren[fromID],' "from" from the camera: ' + id);

                var toID = nodeNames.indexOf("to");
                var to = this.parseCoordinates3D(grandChildren[toID],' "to" from the camera: ' + id);

                var upID = nodeNames.indexOf("up");
                var up = this.parseCoordinates3D(grandChildren[upID],' "up" from the camera: ' + id);

                camera = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up);

                this.log("Parsed Ortho Camera");
            }
            else {
                this.onXMLMinorError("Camera type " + children[i].nodeName + " is not accepted");
                continue;
            }
        

            // Add the camera to the scene cameras
            this.cameras[id] = camera;
            this.scene.cameraIDs.push(id);

            // Set the initial camera
            if (id == this.default) {
                this.scene.camera = camera;
                this.scene.interface.setActiveCamera(camera);
                this.scene.selectedCamera = id;
                default_camera_found = true;
            }
        }

        // Default Camera Not Found
        if (!default_camera_found)
            return "Default View ID does not match a camera ID";

        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex    = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        if (ambientIndex == -1)
            return "No value for ambient in illumination";
        if (backgroundIndex == -1)
            return "No value for background in illumination";

        // ambient illumination
        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        // background illumination
        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");
        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        this.scene.lightIDs = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Specifications for the current light.
            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID = " + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID = " + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID = " + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            this.lights[lightId] = global;
            this.scene.lightIDs.push(lightId);
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        //For each texture in textures block, check ID and file URL
        this.textures = [];
        for (var i = 0; i < texturesNode.children.length; i++) {
            if (texturesNode.children[i].nodeName == "texture") {
                var textureID = this.reader.getString(texturesNode.children[i], 'id');
                if (!isNaN(textureID)) { this.onXMLMinorError("Unable to get texture number "+ (i+1) + ". Ignoring it"); continue; }
                var path = this.reader.getString(texturesNode.children[i], 'path');
                if (!isNaN(path)) { this.onXMLMinorError("Unable to get path for texture "+ textureID + ". Ignoring it"); continue; }
            }
            else
                this.onXMLMinorError("unknown tag name <" + name + ">");

            var texture = new CGFtexture(this.scene, path);
            if (this.textures[textureID] != null) { this.onXMLMinorError("There are more than 1 textures named " + textureID + ". Rename one of them."); continue; }
            this.textures[textureID] = texture;
        }

        this.log("Parsed textures");
    }

    /**
     * Parses the <spritesheets> block. 
     * @param {spritesheets block element} spritesheetsNode
     */
    parseSpritesheets(spritesheetsNode) {
        this.spritesheets = [];
        for (var i = 0; i < spritesheetsNode.children.length; ++ i) {
            if (spritesheetsNode.children[i].nodeName == "spritesheet") {
                var spritesheetID = this.reader.getString(spritesheetsNode.children[i], 'id');
                if (!isNaN(spritesheetID)) { this.onXMLMinorError("Unable to get spritesheet number "+ (i+1) + ". Ignoring it"); continue; }
                var path = this.reader.getString(spritesheetsNode.children[i], 'path');
                if (!isNaN(path)) { this.onXMLMinorError("Unable to get path for spritesheet "+ spritesheetID + ". Ignoring it"); continue; }
                var sizeM = this.reader.getFloat(spritesheetsNode.children[i], 'sizeM');
                if (isNaN(sizeM)) { this.onXMLMinorError("Unable to get sizeM for spritesheet "+ spritesheetID + ". Using sizeM = 1"); sizeM = 1; continue; }
                var sizeN = this.reader.getFloat(spritesheetsNode.children[i], 'sizeN');
                if (isNaN(sizeN)) { this.onXMLMinorError("Unable to get sizeM for spritesheet "+ spritesheetID + ". Using sizeN = 1"); sizeN = 1; continue; }
            }
            else
                this.onXMLMinorError("unknown tag name <" + name + ">");

            /* CREATE SPRITESHEET */
            var texture = new CGFtexture(this.scene, path);
            var spritesheet = new MySpriteSheet(this.scene, texture, sizeM, sizeN);

            if (this.spritesheets[spritesheetID] != null) { this.onXMLMinorError("There are more than 1 spritesheets named " + spritesheetID + ". Rename one of them."); continue; }
            this.spritesheets[spritesheetID] = spritesheet;
        }

        this.log("Parsed Spritesheets");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var materialsN = 0;
        var children = materialsNode.children;

        this.materials = [];

        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            nodeNames = [];

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            var materialInfo = children[i].children;

            for (var j = 0; j < materialInfo.length; ++ j) {
                nodeNames.push(materialInfo[j].nodeName);
            }

            // Specifications for the current material
            var shininessIndex = nodeNames.indexOf("shininess");
            var ambientIndex   = nodeNames.indexOf("ambient");
            var diffuseIndex   = nodeNames.indexOf("diffuse");
            var specularIndex  = nodeNames.indexOf("specular");
            var emissiveIndex  = nodeNames.indexOf("emissive");

            var shininess, ambient_component, diffuse_component, specular_component, emissive_component;

            // ------------------------------------- Shininess
            if (shininessIndex == -1) {
                this.onXMLMinorError(" No value for shininess in material: " + materialID + ". Using default values.");
                shininess = 10;
            } 
            else {
                shininess = this.reader.getFloat(materialInfo[shininessIndex], 'value');
                if (isNaN(shininess) || shininess < 0) {
                    this.onXMLMinorError(" No value for shininess in material: " + materialID + ". Using default values.");
                    shininess = 10;
                }                     
            }
            // ------------------------------------- Ambient
            if (ambientIndex == -1) {
                this.onXMLMinorError("No value for ambient in material: " + materialID + ". Using default values.");
                ambient_component = [0.5, 0.5, 0.5, 1.0];
            }
            else {
                ambient_component = this.parseColor(materialInfo[ambientIndex], 'ambient of the material: ' + materialID);
            }
            // ------------------------------------- Diffuse
            if (diffuseIndex == -1) {
                this.onXMLMinorError("No value for diffuse in material: " + materialID + ". Using default values.");
                diffuse_component = [0.5, 0.5, 0.5, 1.0];
            }
            else {
                diffuse_component = this.parseColor(materialInfo[diffuseIndex], 'diffuse of the material: ' + materialID);
            }
            // ------------------------------------- Specular
            if (specularIndex == -1) {
                this.onXMLMinorError("No value for specular in material: " + materialID + ". Using default values.");
                specular_component = [0.5, 0.5, 0.5, 1.0];
            } 
            else {
                specular_component = this.parseColor(materialInfo[specularIndex], 'specular of the material: ' + materialID);
            }
            // ------------------------------------- Emissive
            if (emissiveIndex == -1) {
                this.onXMLMinorError("No value for emissive in material: " + materialID + ". Using default values.");
                emissive_component = [0.0, 0.0, 0.0, 1.0];
            }
            else {
                emissive_component = this.parseColor(materialInfo[emissiveIndex], 'emissive of the material: ' + materialID);
            }
            var newMaterial = new CGFappearance(this.scene);
            newMaterial.setShininess(shininess);
            newMaterial.setAmbient (...ambient_component);
            newMaterial.setDiffuse (...diffuse_component);
            newMaterial.setSpecular(...specular_component);
            newMaterial.setEmission(...emissive_component);
            
            this.materials[materialID] = newMaterial;
            materialsN++;
        }

        if (materialsN == 0) this.onXMLError("at least one material must be defined");
        this.log("Parsed materials");
    }

    /**
     * Parses the <animations> block. 
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;
        this.animations = [];
        this.animationsIDs = [];

        var grandChildren = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "animation") {
                return "unknown tag <" + children[i].nodeName + ">";
            }

            var animationID = this.reader.getString(children[i], 'id');
            if (animationID == null) {
                return "no ID defined for animationID";
            }
            
            if (this.animations[animationID] != null) {
                return "ID must be unique for each animation (conflict: ID = " + animationID + ")";
            }

            // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            // Create Animation
            var animation = new MyKeyframeAnimation(this.scene);
            // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            // Keyframes
            
            grandChildren = children[i].children;

            for (var j = 0; j < grandChildren.length; ++ j) {
                var keyframeIndex = grandChildren[j].nodeName.indexOf("keyframe");
                if (keyframeIndex == -1) {
                    this.onXMLMinorError("Error parsing keyframe for animation: " + animationID + ".");
                }
                var keyframeInstant = this.reader.getFloat(grandChildren[j], 'instant');
                if (keyframeInstant  == null || keyframeInstant  < 0 || isNaN(keyframeInstant)) {
                    return "Not a valid insant for animation: " + animationID;
                }

                var keyframeInfo = grandChildren[j].children;
                var nodeNamesggc = [];

                for (var k = 0; k < keyframeInfo.length; ++ k) {
                    nodeNamesggc.push(keyframeInfo[k].nodeName);
                }

                var translation_vector = [0, 0, 0];
                var rotation_vector    = [0, 0, 0];
                var scale_vector       = [1, 1, 1];

                for (var k = 0; k < keyframeInfo.length; ++ k) {
                    switch (keyframeInfo[k].nodeName) {
                        case "translation":
                                var t_aux = this.parseCoordinates3D(keyframeInfo[k],' "translation" from the animation: ' + animationID);
                                translation_vector[0] += t_aux[0];
                                translation_vector[1] += t_aux[1];
                                translation_vector[2] += t_aux[2];    
                                break;
                        case "rotation":
                            var axis = this.reader.getItem(keyframeInfo[k], 'axis', ['x', 'y', 'z']);
                            var angle = this.reader.getFloat(keyframeInfo[k], 'angle');
                            if (axis == null) {
                                this.onXMLMinorError("enter a valid number for 'rotation axis'; using axis = 'x'");
                                axis = 'x';
                            }
                            if (angle == null) {
                                this.onXMLMinorError("enter a valid number for 'rotation angle'; using angle = 0");
                                angle = 0;
                            }
                            if      (axis == 'x') rotation_vector[0] += angle;
                            else if (axis == 'y') rotation_vector[1] += angle;
                            else if (axis == 'z') rotation_vector[2] += angle;     
                            break;
                        case "scale":
                            var sx = this.reader.getFloat(keyframeInfo[k], 'sx');
                            var sy = this.reader.getFloat(keyframeInfo[k], 'sy');
                            var sz = this.reader.getFloat(keyframeInfo[k], 'sz');
                            if (sx == null) {
                                this.onXMLMinorError("enter a valid number for 'scale sx'; using sx = 1");
                                sx = 1;
                            }
                            if (sy == null) {
                                this.onXMLMinorError("enter a valid number for 'scale sy'; using sy = 1");
                                sy = 1;
                            }
                            if (sz == null) {
                                this.onXMLMinorError("enter a valid number for 'scale sz'; using sz = 1");
                                sz = 1;
                            }
                            scale_vector[0] *= sx;
                            scale_vector[1] *= sy;
                            scale_vector[2] *= sz;
                            
                            break;
                        default:
                            this.onXMLMinorError("unknown transformation: " + keyframeInfo[k].nodeName);
                            break;
                    }

                }
            
                var keyframe = new MyKeyframe(this.scene, keyframeInstant, translation_vector, rotation_vector, scale_vector);
                animation.addKeyframe(keyframe);
            }

            this.animations[animationID] = animation;
            this.animationsIDs.push(animationID);

        }

        this.log("Parsed Animations");
        return null;
    }

    /**
     * Parses the <nodes> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];
        this.animatedSprites = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; ++ i) {

            if (children[i].nodeName != "node") {
                return "unknown tag <" + children[i].nodeName + ">";
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            // Creates node with information about the graph and it's ID
            this.nodes[nodeID] = new MyNode(this, nodeID);

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; ++ j) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // -------------------- Transformations -------------------- 

            var transformationsIndex = nodeNames.indexOf("transformations");
            if (transformationsIndex == -1) {
               this.onXMLMinorError("Error parsing transformations for node: " + nodeID + ". Using a clear matrix with no transformations.");
            }
            else {
                var transformations = grandChildren[transformationsIndex].children;

                for (var j = 0; j < transformations.length; ++ j) {
                    switch (transformations[j].nodeName) {
                        case "translation":
                            var translation_vector = this.parseCoordinates3D(transformations[j],' "translation" from the node: ' + nodeID);
                            mat4.translate(this.nodes[nodeID].matrix, this.nodes[nodeID].matrix, [...translation_vector]);
    
                            break;
                        case "rotation":
                            var axis = this.reader.getItem(transformations[j], 'axis', ['x', 'y', 'z']);
                            var angle = this.reader.getFloat(transformations[j], 'angle');
                            if (axis == null) {
                                this.onXMLMinorError("enter a valid number for 'rotation axis'; using axis = 'x'");
                                axis = 'x';
                            }
                            if (angle == null) {
                                this.onXMLMinorError("enter a valid number for 'rotation angle'; using angle = 0");
                                angle = 0;
                            }
                            mat4.rotate(this.nodes[nodeID].matrix, this.nodes[nodeID].matrix, angle * DEGREE_TO_RAD, this.axisCoords[axis]);
                            break;
                        case "scale":
                            var sx = this.reader.getFloat(transformations[j], 'sx');
                            var sy = this.reader.getFloat(transformations[j], 'sy');
                            var sz = this.reader.getFloat(transformations[j], 'sz');
                            if (sx == null) {
                                this.onXMLMinorError("enter a valid number for 'scale sx'; using sx = 1");
                                sx = 1;
                            }
                            if (sy == null) {
                                this.onXMLMinorError("enter a valid number for 'scale sy'; using sy = 1");
                                sy = 1;
                            }
                            if (sz == null) {
                                this.onXMLMinorError("enter a valid number for 'scale sz'; using sz = 1");
                                sz = 1;
                            }
                            mat4.scale(this.nodes[nodeID].matrix, this.nodes[nodeID].matrix, [sx, sy, sz]);
                            break;
                        default:
                            this.onXMLMinorError("unknown transformation: " + transformations[j].nodeName);
                            break;
                    }
                }
            }

            

            // -------------------- Material -------------------- 
            
            var materialIndex = nodeNames.indexOf("material");
            if (materialIndex == -1) return "Material must be defined for node: " + nodeID;

            var materialID = this.reader.getString(grandChildren[materialIndex], 'id');
            if (materialID == null) return "Can't parse materials for node: " + nodeID;
            if (materialID != "null" && this.materials[materialID] == null)
                return "Not a valid materialID for node: " + nodeID;

            this.nodes[nodeID].material = materialID;

            // -------------------- Texture -------------------- 
            

            var textureIndex = nodeNames.indexOf("texture");
            if (materialIndex == -1) return "Texture must be defined for node: " + nodeID;

            var textureID = this.reader.getString(grandChildren[textureIndex], 'id');

            var amplifications = grandChildren[textureIndex].children;
            var afs, aft;

            if (amplifications.length == 0) {
                this.onXMLMinorError("invalid values for afs and aft in node " + nodeID + ". Using afs = 1.0, aft = 1.0");
                afs = 1.0;
                aft = 1.0;
            }
            else {
                if (amplifications[0].nodeName != "amplification") {
                    this.onXMLMinorError("missing <amplification> node for node " + nodeID + ". Using afs = 1.0, aft = 1.0");
                    afs = 1.0;
                    aft = 1.0;
                }
                if (amplifications.length > 1) {
                    this.onXMLMinorError("More than 1 amplification for node " + nodeID + ". Using the first one");
                }
                
                afs = this.reader.getFloat(amplifications[0], 'afs');
                aft = this.reader.getFloat(amplifications[0], 'aft');
                if (isNaN(afs)) {
                    this.onXMLMinorError("invalid values for afs in node " + nodeID + ". Using afs = 1.0");
                    afs = 1.0;
                } 
                if (isNaN(aft)) {
                    this.onXMLMinorError("invalid values for aft in node " + nodeID + ". Using aft = 1.0");
                    aft = 1.0;
                } 
            }
            
            this.nodes[nodeID].texture = textureID;          

            // -------------------- Animations -------------------- 

            var animationsIndex = nodeNames.indexOf("animationref");
            var animationID = null;
            // Not necessary
            if (animationsIndex != -1) {
                animationID = this.reader.getString(grandChildren[animationsIndex], "id");
                if (animationID != null && !this.animations[animationID]) {
                    this.onXMLMinorError("animation not defined for animation ID " +  animationID + " in node " + nodeID);
                    animationID = null;
                }
            }

            this.nodes[nodeID].animationID = animationID;

            // -------------------- Descendants -------------------- 

            var descendantsIndex = nodeNames.indexOf("descendants");
            if (descendantsIndex == -1) {
                return "Error parsing descendants for node: " + nodeID;
            }

            // list where each element corresponds to a noderef or a leaf
            var descendants = grandChildren[descendantsIndex].children;

            // identify if it's a noderef or a leaf and treat them
            for (var j = 0; j < descendants.length; ++ j) {
                if (descendants[j].nodeName == "noderef") {
                    var currentNodeID = this.reader.getString(descendants[j], 'id');

                    if (currentNodeID == null) {
                        this.onXMLMinorError("Error: parse descendants - noderef");
                    }
                    else {
                        this.nodes[nodeID].addChild(currentNodeID);
                    }
                }
                else if (descendants[j].nodeName == "leaf") {
                    this.nodes[nodeID].addLeaf(new MyLeaf(this, descendants[j], afs, aft));
                }
                else {
                    this.onXMLMinorError("unknown tag <" + descendants[j].nodeName + ">");
                }
            }

        }
    }

    /**
     * Parse a boolean value from a node with ID = id
     * @param {block element} node - node block
     * @param {attribute} name - atribute for which we need a boolean value
     * @param {message to be displayed in case of error} messageError 
     */
    parseBoolean(node, name, messageError) {
        var boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false))) {
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");
            boolVal = true;
        }
        return boolVal;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node - node block
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node - node block
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node with ID = id
     * @param {block element} node - node block
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // Red (R)
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse red (R) component of the " + messageError;

        // Green (G)
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse green (G) component of the " + messageError;

        // Blue (B)
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse blue (B) component of the " + messageError;

        // Alpha (A)
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse alpha (A) component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Update Animations Presents in this Graph
     * @param {time} t
     */
    updateAnimations(t) {
        for (var i in this.animations) {
            this.animations[i].update(t);
        }
        for (var j = 0; j < this.animatedSprites.length; ++ j) {
            this.animatedSprites[j].update(t);
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.displaySceneRecursive(this.idRoot, this.nodes[this.idRoot].texture, this.nodes[this.idRoot].material);
    }

    /**
     * Displays the scene, processing each node recursively.
     * @param {node block element} nodeID 
     * @param {texture} textureFather
     * @param {material} materialFather
     */
    displaySceneRecursive(nodeID, textureFather, materialFather) {
        var currentNode = this.nodes[nodeID];
        var idTexture = textureFather;
        var idMaterial = materialFather;

        // Apply the Transformation
        this.scene.multMatrix(currentNode.matrix);

        // Animation Transformation
        if (currentNode.animationID != null) {
            this.animations[currentNode.animationID].apply();
        }        

        // Obtain material and texture
        if (currentNode.material != "null") {
            idMaterial = currentNode.material;
        }

        if (currentNode.texture != "null") {
            if (currentNode.textureID == 'clear') {
                idTexture = "null";
            }
            else {
                idTexture = currentNode.texture;
            }                
        }

        var currentMaterial = this.materials[idMaterial];
        var currentTexture  = this.textures[idTexture];        

        for (var i = 0; i < currentNode.leaves.length; i++) {
            if (currentNode.leaves[i].primitive != null) {
                // Apply material and texture
                if (currentMaterial != null) {
                    currentMaterial.setTextureWrap('REPEAT', 'REPEAT');
                    currentMaterial.apply();
                }
                if (currentTexture != null) {
                    currentNode.leaves[i].primitive.updateTexCoords(currentNode.leaves[i].afs, currentNode.leaves[i].aft);
                    currentMaterial.setTexture(currentTexture);
                    currentMaterial.setTextureWrap('REPEAT', 'REPEAT');
                    currentMaterial.apply();
                }

                // Display the leaf
                currentNode.leaves[i].primitive.display();
            }
        }

        for (var i = 0; i < currentNode.children.length; i++) {
            // Display the node recursively
            this.scene.pushMatrix();
            this.displaySceneRecursive(currentNode.children[i],idTexture, idMaterial);
            this.scene.popMatrix();
        }        
    }
}
