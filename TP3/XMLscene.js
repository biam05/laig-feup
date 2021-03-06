/**
 * XMLscene class: representing the scene that is to be rendered
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.movie = false;
        this.undo = false;
        this.timedGame = false;

        this.start = function(){
            this.gameOrchestrator.currentState = this.gameOrchestrator.state.start;
        }
        
        this.gameScenes = {
            'Living Room': "talpa_living_room.xml",
            'Boat': "talpa_boat.xml"
        }

        this.selectedTheme = "talpa_boat.xml";

        this.dimensions = {
            '8': 8,
            '6': 6,
            '10': 10
        }

        this.selectedDimension = 8;

        this.redPlayer = {
            'Human' : 0,
            'Bot (Random)': 1,
            'Bot (Greedy)': 2
        }

        this.selectedRed = 0;

        this.bluePlayer = {
            'Human' : 0,
            'Bot (Random)': 1,
            'Bot (Greedy)': 2
        }
        
        this.selectedBlue = 0;

        this.restart = false;    
        
        // camera rotation
        this.rotatingcamera = false;
        this.angle = 0;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.defaultAppearance=new CGFappearance(this);

        this.displayAxis = false;
        this.scaleFactor = 1;
        this.updatePeriod = 100;
        this.cameralock = true;

        // Enable Picking
        this.setPickEnabled(true);

        this.gameOrchestrator = new MyGameOrchestrator(this);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Updates the scene camera
     */
    updateCamera() {
        this.camera = this.graph.cameras[this.selectedCamera];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;          // Lights index
        this.lights = [];   // Reset Lights

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;      // Only eight lights allowed by WebCGF on default shaders.
            
            if (this.graph.lights.hasOwnProperty(key)) {
                this.lights[i] = new CGFlight(this, i);     // Created New Light
                var graphLight = this.graph.lights[key];
                
                this.lights[i].key = key;

                // Specifications for the light
                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                if (graphLight[0]) {
                    this.lights[i].enabled = true;
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].enabled = false;
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }

                this.lights[i].update();
                i++;
            }
        }
    }

    /**
     * Update scene lights
     */
    updateLights() {
        for (let i = 0; i < this.lights.length; i++) {
            if (this.lights[i].key != null) {
                this.lights[i].setVisible(this.lights[i].enabled);
                this.lights[i].update();
            }
        }
    }

    /** 
     * Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();

        this.setUpdatePeriod(100);

        this.sceneInited = true;
    }

    /**
     * Update the scene
     * Updates all the animations in the scene based on the current time
     * @param {time} t - current time
     */
    update(t) {
        this.gameOrchestrator.update(t);
        if (this.sceneInited)  {
            this.graph.updateAnimations(t);
        }   
        if (this.rotatingcamera) {
            this.camera.orbit([0, 1, 0], Math.PI / 35.0);
            this.angle += Math.PI / 35.0;
            if (this.angle >= Math.PI) {
                this.angle -= Math.PI;
                this.rotatingcamera = false;
            }
        }   
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        this.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
        }

        if (this.sceneInited) {
            // Picking
            this.gameOrchestrator.orchestrate();
            this.gameOrchestrator.managePick(this.pickMode, this.pickResults);
            this.clearPickRegistration();

            // Draw axis
            if(this.displayAxis)
                this.axis.display();

            if(this.cameralock)
                this.interface.setActiveCamera(null);
            else{
                this.interface.setActiveCamera(this.camera);
            }
 
            this.defaultAppearance.apply();

            // Update Lights
            this.updateLights();
            
            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
            
            // Display the Game Board
            //this.board.display();

            // Displays the scene (MySceneGraph function).
            this.gameOrchestrator.display();
        }
        else {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    /**
     * Changes the Dimensions of the Game Board
     */
    changeDimension() {
        this.gameOrchestrator.changeDimension();
    }

    /**
     * Changes between Scenes
     * @param {String} theme - path to the selected scene
     */
    changeTheme(theme) {
        this.sceneInited = false;
        this.gameOrchestrator.changeTheme(theme);
        this.selectedTheme = theme;
        this.interface.restart();
    }

    /**
     * Changes the Red Player Mode
     * @param {int} mode - mode chosen for red player (Human, Random Bot or Greedy Bot)
     */
    changeRedPlayer(mode) {
        this.gameOrchestrator.changeRedPlayer(mode);
        this.selectedRed = mode;
    }

    /**
     * Changes the Blue Player Mode
     * @param {int} mode - mode chosen for blue player (Human, Random Bot or Greedy Bot)
     */
    changeBluePlayer(mode) {
        this.gameOrchestrator.changeBluePlayer(mode);
        this.selectedBlue = mode;
    }

    /**
     * Changes the Type of Game
     * from  Timed  to Untimed
     * from Untimed to  Timed
     */
    changeTimed() {
        this.gameOrchestrator.timedGame = this.timedGame;
        this.gameOrchestrator.restart();
    }

    /**
     * Rotates the Camera from Player to Player
     */
    rotateCamera() {
        if (this.graph.cameras["player1Camera"] == this.camera ||
            this.graph.cameras["player2Camera"] == this.camera)
            this.rotatingcamera = true;
    }
}
