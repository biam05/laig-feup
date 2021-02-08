/**
* MyInterface class: creating a GUI interface
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor - Initializes the Interface
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        this.gui = new dat.GUI();

        // Adding some GUI Controls
        this.gui.add(this.scene, 'displayAxis').name("Display Axis");
        this.gui.add(this.scene, 'scaleFactor', 0.1, 10.0).name('Scale');

        this.first_update = true;
        this.initKeys();
        
        return true;
    }

    /**
     * Updates the GUI Interface
     * Once the scene has been initialized, it introduces the GUI interface for all the scene components.
     */
    update() {
        if ((this.scene.sceneInited) && (this.first_update)) {
            this.first_update = false;
            this.addCameras();
            this.addLights();
        }
    }

    /**
     * Add a GUI interface for the cameras.
     */
    addCameras() {
        this.gui.add(this.scene, 'selectedCamera', this.scene.cameraIDs).name('Selected Camera').onChange(this.scene.updateCamera.bind(this.scene));
    }

    /**
     * Add a GUI interface for the lights.
     */
    addLights() {
        for (let i = 0; i < this.scene.lights.length; i++) {
            if (this.scene.lights[i].key != null) {
                this.gui.add(this.scene.lights[i], 'enabled').name(this.scene.lights[i].key).onChange(this.scene.updateLights.bind(this.scene));
            }
        }
    }

    /**
     * Starts the Key Functions in the Interface.
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}
