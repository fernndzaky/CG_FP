var Running_2 = pc.createScript('Running_2');

// creating a global variable
var obstacle; //stores all obstacles in the map
var start; //variable to start the game
var hit; //variable to check whether the player has hit an obstacle 
var finish; // variable to check whether the player has reached the finish line
var dead; // variable to check whether the player has died
var scale; // variable to get the player healthbar
var shielded; // variable to check whether the player has an active shield or not
var shield; // stores all shields in the map
var shieldIcon; // store the shield icon for the player
var swim; // variable to check whether the player is swimming or not
var AudioEntity; // store all sound effects

var createdScenes; // store all scenes that are created by the code

var MainGround; //store the main ground for duplicate
var Environment; //store the main Environment for duplicate
var TembokKiri; //store the left wall for duplicate
var TembokKanan; //store the right wall for duplicate
var Obstacles; //store all obstacles for duplicate
var Shields; // store all shields for duplicate
var FinishLine; // store the finish line barrier for duplicate
var ObstaclePosition; //store the local position of each obstacle
var FinishCatur; // store the finish checkboard asset for duplicate
var penyambung; // store the location of the bridge. this variable will be used to clip the next loaded map
var mapCounter; // store the new map iteration
var penyambungEntity; // store the bridge entitity for duplicate
var newCenterPosition; // store the middle position of the new duplicated map

var newGround; //store the new duplicated ground
var newEnvironment; //store the new duplicated environment
var newFinishLine; // store the new finish line barrier
var newShields; // store the new shields
var newObstacles; // store the new obstacles
var newTembokKiri; // store the new left wall
var newTembokKanan; // store the new right wall

var currentFinishLine; //store the current finish line barrier that player will bump into
var currentEnv; // store the current environemnt that player are in
var currentMap; // store the current ground that the player are in
var currentObstacles; // store the obstacles that player will bump into
var currentPenyambung; // store the bridge entitiy that player will walk through
var currentTembokKiri; // store the current left wall that surrounding the player
var currentTembokKanan; // store the current right wall that surrounding the player

var nextEnv; // store the name of the new environemnt, which will be rendered next
var nextMap; // store the name of the new map, which will be rendered next
var nextObstacles; // store the name of the new obstacles, which will be rendered next
var nextShields; // store the name of the new shield, which will be rendered next
var nextFinishLine; // store the name of the new finish line barrier, which will be rendered next
var nextPenyambung; // store the name of the new bridge entity, which will be rendered next
var nextTembokKiri; // store the name of the new left wall, which will be rendered next
var nextTembokKanan; // store the name of the new right wall, which will be rendered next
// END OF INFINITE MAP LOOP VARIABLES








// create new variable that will be used to change the scene
Running_2.attributes.add("sceneName", {type: "string", default: "", title: "Scene Name to Load"});

// creating a default jump power variable
Running_2.attributes.add('jumpPower', {
    type: 'number',
    default: 200.0
});

// setting the animation into variables
Running_2.states = {
     idle: { 
         animation: 'Idle.glb' 
     },
     idle_swim: { 
         animation: 'swim_fall.glb' 
     },
     run: { 
         animation: 'run.glb' 
     },
     fall: { 
         animation: 'kena.glb' 
     },
     dance: { 
         animation: 'break_dance.glb' 
     },
     die: { 
         animation: 'stumble.glb' 
     },
     fun: { 
         animation: 'Joyful Jump.glb' 
     },
     jump: { 
         animation: 'jump.glb' 
     },
     swim: { 
         animation: 'Swimming.glb' 
     },
};


// initialize code called once per entity
Running_2.prototype.initialize = function() {
    console.log('created scenes',createdScenes);

    newCenterPosition = this.app.root.findByName('Laut Ground').getPosition().clone(); // get the center z position of the map, this variable will be used for calling the load next map function
    createdScenes = []; // stores all the entity that are create with code
    mapCounter = 0; // initialize the rendered map as 0, this variable will count how many map has been rendered
    
    
    this.start_position = this.entity.getPosition().clone(); // get the initian position of the character (start line)

    // searching a specific entity and put it into a variable
    this.healthEntity = this.entity.findByName('eHealth'); // healthbar
    this.startText =  this.entity.findByName('2D Screen'); // start UI

    this.endText =  this.entity.findByName('2D ScreenB'); // end UI

    shieldIcon = this.entity.findByName('shield-icon'); // shield icon
    obstacle = this.app.root.findByTag('ObstacleB'); // array of all obstacles
    shield = this.app.root.findByTag('ShieldB'); // array of all powerup or shield
    //finish = this.app.root.findByName('FinishLine'); // get the finish line rigidbody
    FinishLine = this.app.root.findByName('FinishLineB'); // get the finish line rigidbody
    FinishCatur = this.app.root.findByName('FinishB'); // get the finish line rigidbody
    
    FinishCatur.enabled = false; // disabled the checkboard finish line asset
    FinishLine.enabled = false; //disabled the finish line barrier asset    
    AudioEntity = this.app.root.findByName('SFX2'); // get all sound effects
    
    this.endText.enabled = false; //disable end UI

    // initialise the jumping state as false
    this.jumping = {
        state: false
    };
    
    // initialise the Running_2 state as false
    this.Running_2 = {
        state: false
    };
    
    dead = false; // initialise the dead state as false
    
    start = false; // initialise the start state as false
    
    swim = false; // initialise the swimming state to false
    
    shieldIcon.enabled = false; // hide the shield icon
    
    shielded = false; // initialise the shielded as false

    this.setState('idle'); // initialise the animation as idle
    
    this.blendTime = 0.2; // setting the duration of the change of the animation
    
    // adding input listener
    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.keyDown, this);
    this.app.keyboard.on(pc.EVENT_KEYUP, this.keyUp, this);
    
    // adding collisionstart and collisionend function to the entity
    this.entity.collision.on('collisionstart', this.onCollisionStart, this);
    this.entity.collision.on('collisionend', this.onCollisionEnd, this);
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    
    currentEnv = 'Environment'; // set the first rendered environment name
    currentMap = 'Laut Ground'; // set the first rendered map name
    currentPenyambung = 'PenyambungB'; // set the first rendered bridge name
    currentTembokKiri = 'Tembok Kiri'; // set the first rendered left wall name
    currentTembokKanan = 'Tembok Kanan'; // set the first rendered right wall name

    nextEnv = 'Environment1'; // set the next rendered environment name
    nextMap = 'Laut Ground1'; // set the next rendered map name
    nextPenyambung = 'PenyambungB1'; // set the next bridge name
    nextTembokKiri = 'Tembok Kiri'; // set the next left wall name
    nextTembokKanan = 'Tembok Kanan'; // set the next right wall name
    
    createdScenes.push(this.app.root.findByName(currentEnv)); // push the name of the first environment the the created scenes array
    createdScenes.push(this.app.root.findByName(currentMap)); // push the name of the first map the the created scenes array
    createdScenes.push(this.app.root.findByName(currentPenyambung)); // push the name of the first bridge the the created scenes array
    createdScenes.push(this.app.root.findByName(currentTembokKiri)); // push the name of the first left wall the the created scenes array
    createdScenes.push(this.app.root.findByName(currentTembokKanan)); // push the name of the first right wall the the created scenes array

};

Running_2.prototype.loadNextGround = function () {

    penyambung = this.app.root.findByName(currentPenyambung).getPosition().clone(); // get the position of the bridge, this variable will be used to clip the next loaded map


    penyambungEntity = this.app.root.findByName('PenyambungB');  // get the entity of the invisible bridge
    newPenyambung = penyambungEntity.clone(); // clone the first invisible bridge and put it in a new variable
    this.app.root.addChild(newPenyambung); // add the new invisible brdige to root
    newPenyambung.setLocalPosition(0,0.48,penyambung.z+80); // set the newly rendered invisible bridge to the end of the next map
    createdScenes.push(newPenyambung); // push the newly redered entity to createdScenes array

    MainGround = this.app.root.findByName('Laut Ground'); // get the entity of the firstly rendered main ground
    console.log('to be duplicated main ground',MainGround);
    newGround = MainGround.clone(); // clone the firstly rendered ground and put it in a new variable
    this.app.root.addChild(newGround); // add the new main ground to root
    newGround.setLocalPosition(0,-1.1,penyambung.z+40); // set the newly rendered main ground to the end of the next map
    newGround.rigidbody.syncEntityToBody(); // sync the rigid body of the newly rendered main ground after it moved
    createdScenes.push(newGround); // push the newly redered entity to createdScenes array
    

    Environment = this.app.root.findByName('Environment'); // get the entity of the firstly rendered enivornment
    newEnvironment = Environment.clone(); // clone the firstly rendered environment and put it in a new variable
    this.app.root.addChild(newEnvironment); // add the new main environement to root
    newEnvironment.setLocalPosition(-3.446,0,penyambung.z-7); // set the newly rendered environment to the end of the next map
    createdScenes.push(newEnvironment); // push the newly redered entity to createdScenes array


    TembokKiri = this.app.root.findByName('Tembok Kiri'); // get the entity of the firstly rendered left wall
    newTembokKiri = TembokKiri.clone(); // clone the firstly rendered left wall and put it in a new variable
    this.app.root.addChild(newTembokKiri); // add the new main left wall to root
    newTembokKiri.setLocalPosition(3.083,0.098,penyambung.z);  // set the newly rendered left wall to the end of the next map
    newTembokKiri.rigidbody.syncEntityToBody();// sync the rigid body of the newly rendered left wall after it moved
    createdScenes.push(newTembokKiri); // push the newly redered entity to createdScenes array

    TembokKanan = this.app.root.findByName('Tembok Kanan'); // get the entity of the firstly rendered right wall
    newTembokKanan = TembokKanan.clone(); // clone the firstly rendered right wall and put it in a new variable
    this.app.root.addChild(newTembokKanan); // add the new main right wall to root
    newTembokKanan.setLocalPosition(-3.45,0.049,penyambung.z); // set the newly rendered right wall to the end of the next map
    newTembokKanan.rigidbody.syncEntityToBody();// sync the rigid body of the newly rendered right wall after it moved
    createdScenes.push(newTembokKanan); // push the newly redered entity to createdScenes array



    Obstacles = this.app.root.findByTag('ObstacleB'); // get the entity of the firstly rendered obstacles
    //createing the new obstacles
    var i;
    for (i = 0; i < Obstacles.length; i++) // for loop in the array of models that have the "Obstacle" tag
    {     
        ObstaclePosition = Obstacles[i].getPosition().clone(); // get the initial position of the obstacle
        newObstacles = Obstacles[i].clone(); // clone the obstacle and store it in a new variable
        newObstacles.enabled = true; // set the enabled property of obstacles to true
        this.app.root.addChild(newObstacles);  // add the new rendered obstacle to root
        newObstacles.setLocalPosition(ObstaclePosition.x,ObstaclePosition.y,ObstaclePosition.z+75); // set the position of the newly cloned obstacles to the next map
        newObstacles.tags.add('ObstacleB'); // add Obstacle tag to the newly rendered obstacle, so it can be hit by the player
        newObstacles.rigidbody.syncEntityToBody();// sync the rigid body of the newly rendered obstacle after it moved
        newObstacles.name = newObstacles.name.concat(mapCounter+1); // set the name of the new obstacle
        createdScenes.push(newObstacles); // push the newly redered entity to createdScenes array   
    }  

    Shields = this.app.root.findByTag('ShieldB'); // get the entity of the firstly rendered shield
    //spawning the shields
    var i;
    for (i = 0; i < Shields.length; i++) // for loop in the array of models that have the "Shield" tag
    {
        ObstaclePosition = Shields[i].getPosition().clone(); // get the initial position of the shield
        newShield = Shields[i].clone();// clone the shield and store it in a new variable
        newShield.enabled = true;// set the enabled property of obstacles to true
        this.app.root.addChild(newShield); // add the new rendered obstacle to root
        newShield.setLocalPosition(ObstaclePosition.x,ObstaclePosition.y,ObstaclePosition.z+75);// set the position of the newly cloned shield to the next map
        newShield.tags.add('ShieldB');  // add Shield tag to the newly rendered shield, so it can be hit by the player
        newShield.rigidbody.syncEntityToBody();// sync the rigid body of the newly rendered shield after it moved
        newShield.name = newShield.name.concat(mapCounter+1);// set the name of the new shield
        createdScenes.push(newShield); // push the newly redered entity to createdScenes array 
    }  


    // set the name of the newly rendered environment
    newGround.name = 'Laut Ground'.concat(mapCounter+1);
    newEnvironment.name = 'Environment'.concat(mapCounter+1);
    newPenyambung.name = 'PenyambungB'.concat(mapCounter+1);
    newTembokKiri.name = 'Tembok Kiri'.concat(mapCounter+1);
    newTembokKanan.name = 'Tembok Kanan'.concat(mapCounter+1);

    // set the name of the nextly rendered environment
    nextEnv = 'Environment'.concat(mapCounter+2);
    nextMap = 'Laut Ground'.concat(mapCounter+2);
    nextPenyambung = 'PenyambungB'.concat(mapCounter+2);
    nextTembokKiri.name = 'Tembok Kiri'.concat(mapCounter+2);
    nextTembokKanan.name = 'Tembok Kanan'.concat(mapCounter+2);

    // set the name of the current environment
    currentEnv = 'Environment'.concat(mapCounter+1);
    currentMap = 'Laut Ground'.concat(mapCounter+1);
    currentPenyambung = 'PenyambungB'.concat(mapCounter+1);
    currentTembokKiri.name = 'Tembok Kiri'.concat(mapCounter+1);
    currentTembokKanan.name = 'Tembok Kanan'.concat(mapCounter+1);
    console.log('newly rendered main ground',newGround);
    // increase the map count by 1
    mapCounter+=1;
    // get the center position of the newly rendered map
    newCenterPosition = this.app.root.findByName(currentMap).getPosition().clone();


    // if the map has already rendered twice, create a finish line so the player can move to the next map
    if(mapCounter === 3){
        
        
        FinishLine = this.app.root.findByName('FinishLineB'); // get the finish line barrier entity
        newFinishLine = FinishLine.clone(); // clone the finish linne barrier entity and put it in a new variable
        newFinishLine.enabled = true; // set the finish line barrier enabled property to true
        this.app.root.addChild(newFinishLine); // add the new finish line barrier to root
        newFinishLine.setLocalPosition(3.447,0.404,penyambung.z+83); // set the newly rendered finish line barrier to the end of the next map
        newFinishLine.rigidbody.syncEntityToBody(); // sync the rigid body of the newly rendered right wall after it moved
        createdScenes.push(newFinishLine); // push the newly redered entity to createdScenes array
        
        // console.log('finish catur', FinishCatur);
        // console.log('finish linn barrier', newFinishLine);
        console.log('has reached the end of the map');
        // FinishCatur = this.app.root.findByName('FinishB'); // get the finish line rigidbody
        FinishCatur.enabled = true; // enable the checkboard finish line entity
        createdScenes.push(FinishCatur); // push the newly redered entity to createdScenes array 
        FinishCatur.setLocalPosition(3.446,0.488,penyambung.z+129); // set the newly rendered finish line entity to the end of the next map



    }

};

// function for when collision has started
Running_2.prototype.onCollisionStart =  function(result) {
    
    // if the player colide with an obstacle
    if(result.other.rigidbody && result.other.tags.has('ObstacleB')){
        obstacle = this.app.root.findByTag('ObstacleB'); // array of all obstacles        

        //deleting the obstacle
        var i;
        for (i = 0; i < obstacle.length; i++) // for loop in the array of models that have the "Obstacle" tag
        {
          if(obstacle[i].name == result.other.name) // if the name of the collided item is the same with the item in the array
          {
                obstacle[i].enabled = false; // disaabled the collided obstacle
          }
        }   
        // if the player has a shield
        if(shielded)
        {
            AudioEntity.sound.play("HitShield"); // play the hit shield sound effect
            shielded = false; //set the shielded state to false
            shieldIcon.enabled = false; //disable the shield icon
        }
        // if the player does not have any shield
        else
        {
            AudioEntity.sound.play("HitSound"); // play the hit obstacle sound effect
            console.log("currenc condition",start, swim, scale.x);
            this.setState('idle_swim'); // set the animation to falling
            hit = true; // set the hit variable to true, so that the health bar will be reduced
        }
        
      
    }
    
    // if the player colide with a shield
    if(result.other.rigidbody && result.other.tags.has('ShieldB')){
        shield = this.app.root.findByTag('ShieldB'); // array of all powerup or shield
        AudioEntity.sound.play("Shielded"); //play the shield sound effect
        this.setState('idle_swim'); // set the animation to fun
        
        //deleting the obstacle
        var i;
        for (i = 0; i < shield.length; i++) { // for loop in the array of models that have the "Shield" tag
          if(shield[i].name == result.other.name) // if the name of the collided item is the same with the item in the array
          {
            shield[i].enabled = false; // disabled the collided obsacle
          }
        }
        
        // setting the shileded variable to true, in order to active the shield
        shielded = true;
        shieldIcon.enabled = true; //emable the shield icon
    }


    // if the player colide with the finish line
    if(result.other.rigidbody && result.other.tags.has('FinishLineB')){
        
        AudioEntity.sound.play("Hooray"); // play hooray sound effect
        this.endText.enabled = true;
        
        // setting the start variable to false, so that the player wont move forward
        start = false;
        this.setState('idle_swim'); // set the animation to fun

        dead = false; // initialise the dead state as false
    
        shieldIcon.enabled = false; // hide the shield icon

        shielded = false; // initialise the shielded as false
        
        // changing to next level
        // var self = this;
        // setTimeout(function (){ 
        //     self.loadScene(self.sceneName); // load the next level
        // }, 2000);
    }
    
    // if the character hit the sea floor
    if(result.other.rigidbody && result.other.tags.has('LautGround'))
    {
        this.jumping.state = false; // set the jumping state to false so that the character can jump
    }
};


// function for when collision has ended
Running_2.prototype.onCollisionEnd = function(result) {
    
    // if the player has left the beach (sudah gak menyentuh pantai)
    if(result.name === "Pasir"){
        swim = true; // set the swimminng state to true
    }

    // if the player is still alive, and previously hit an obstacle or shield or sand
    if(start && swim && (result.tags._list[0] === "ObstacleB" || result.tags._list[0] === "ShieldB" || result.name === "Pasir" ) && scale.x > 0.01){
        
        // change the character animation back to swimming after 0.5 seconds
        var self = this;
        setTimeout(function (){ 
             self.setState('swim');
        }, 500);
        swim = true;
    }
    
    // if the character is still on the beach
    else if(start && !swim){
        // change the animation of the character to run, 1.5 seconds after hitting an obstacle on the beach
        var self = this;
        setTimeout(function (){ 
             self.setState('run'); //set the character animation to run
        }, 1500);
    }
};

// function to change the state of the character animation
Running_2.prototype.setState = function (state) {     
    var states = Running_2.states;
    this.state = state;
    // Set the current animation, taking 0.2 seconds to blend from the current animation state to the start of the target animation.
    this.entity.animation.play(states[state].animation, this.blendTime); //play the animation
};


// update function which are called for every frame
Running_2.prototype.update = function(dt) {
    console.log('mapc ounter',mapCounter);
    
    // storing the x,y and z position of the player if the player has reached the middle of the ma
    // 7.5 is the width of the map
    x_detect = (newCenterPosition.x - 7) <= this.entity.getPosition().x && this.entity.getPosition().x <= (newCenterPosition.x + 7);
    y_detect = (newCenterPosition.y - 7) <= this.entity.getPosition().y && this.entity.getPosition().y <= (newCenterPosition.y + 7);
    z_detect = (newCenterPosition.z - 7) <= this.entity.getPosition().z && this.entity.getPosition().z <= (newCenterPosition.z + 7);
    
    // if the position of the player is at the middle of the map, call ghe load next ground function
    if (x_detect && y_detect && z_detect && mapCounter < 3) {
        this.loadNextGround();
    }

    // if the game is still starting
    if(start){
        this.entity.rigidbody.applyImpulse(0, 0,10); //make the player move forward
    }
    
    // rotate the shield icon to the x axis
    shieldIcon.rotateLocal(0,5,0);
    
    // if enter key was pressed
    if(this.app.keyboard.wasPressed(pc.KEY_ENTER) && !start) {
        AudioEntity.sound.slot("Start").resume(); // play the start sound effect
        start=true; // start the game
        this.setState('run'); // change the character animation to Running_2
        this.startText.destroy(); // destroy the start text / user interface
    }
    

    // if space key was pressed, the game has already started and the player is not in the air
    if(this.app.keyboard.wasPressed(pc.KEY_SPACE) && swim && start && this.jumping.state === false) {
        AudioEntity.sound.play("Jump"); // play the jump sound effect
        this.jumping.state = true; // set the character jumping state to true
        this.entity.rigidbody.applyImpulse(0, this.jumpPower, 0); // move the player upward
    }
    
    // if left arrow key is pressed and the game has already started
    if(this.app.keyboard.isPressed(pc.KEY_LEFT) && (start)) {
        this.entity.rigidbody.applyImpulse(10,0,0); // move the player to the left
    }
    
    // if the right arrow key is pressed and the game has already started
    if(this.app.keyboard.isPressed(pc.KEY_RIGHT) && (start)) {
        this.entity.rigidbody.applyImpulse(-10,0,0); // move the player to the right
    }
    
    scale = new pc.Vec3().copy(this.healthEntity.getLocalScale()); // store the scale of the healthbar inside a new vec3 (scale is a vec3)
    
    // if the player hit an obstacle
    if(hit) {
        scale.x = pc.math.lerp(scale.x, 0, 0.7);  // scale down or reduce the healthbar by 70%
        hit = false; // set the hit to false to exit the if statement
        this.entity.rigidbody.applyImpulse(0, 0,0); //make the player move forward

     }
    
    // setting the scale of the healthbar
    this.healthEntity.setLocalScale(scale);
        if (scale.x < 0.01) { // if the scale of the healthbar is under 0.1 or if the player is dead
            AudioEntity.sound.play("Die");
            start =false; // set the start variable to false so that the player stop running
            swim = false; // set the swimming to false so that the player stop swimming
            this.setState('die'); // set the character animation to die
            this.entity.rigidbody.applyImpulse(0, 0,0); //make the player move forward

            // after 1.5 seconds, teleport the player back into the start line
            var self  = this;
            setTimeout(function (){ 
                self.entity.rigidbody.teleport(self.start_position.x ,self.start_position.y ,self.start_position.z); //teleport the character back to start line
                self.setState('idle'); // set the character animation to idle
                
                //re enable all obsacles
                var i;
                for (i = 0; i < obstacle.length; i++) // for loop in the array of models that have the "Obstacle" tag
                {
                    obstacle[i].enabled = true; // enable the obstacles
                }
                
                //re enable all shield
                var i;
                for (i = 0; i < shield.length; i++) { // for loop in the array of models that have the "Shield" tag
                    shield[i].enabled = true; // enable the shields
                }
            }, 1500);
            
            scale.x = 1; // set the health bar back to full or 1 to exit the if statement
            
        }
        // setting the initial health bar as 1 or full
        if (scale.x > 1) {
            scale.x = 1;
        }
        this.healthEntity.setLocalScale(scale);
    };

// function to change scene after finish
Running_2.prototype.loadScene = function (sceneName) {
    // Get a reference to the scene's root object
    var oldHierarchy = this.app.root.findByName ('Root');
    console.log("old hierarch", oldHierarchy);

    // Get the path to the scene
    var scene = this.app.scenes.find(sceneName);
    console.log("This scene", scene);

    // Load the scenes entity hierarchy
    this.app.scenes.loadSceneHierarchy(scene.url, function (err, parent) {
        if (!err) {
            oldHierarchy.destroy();
        } else {
            console.error(err);
        }
    });
};