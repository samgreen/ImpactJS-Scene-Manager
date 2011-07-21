#### Scene Management Plugin for ImpactJS ####

Scene Manager is a plugin for the [ImpactJS game engine](http://www.impactjs.com).
This plugin is design to help you more efficiently manage the various scenes within
your game. By only drawing and updating the scene on the top of the stack, we are able
to remain very performant while still keeping various scenes isolated and modular.


### The Basics ###

Copy the `scene_manager.js` file into your `lib/plugins/` directory and require
`plugins.scene_manager` in your game class. To add a tween to an entity and start it
immediately, you would do something like the following:

	ParentGame = ig.Game.extend({
		sceneManager: new SceneManager(),
		
		init: function() {
			// Push the menu scene on to the stack, where MenuScene is a subclass of Scene
			this.sceneManager.pushScene( new MenuScene() );
		},
		
		update: function() {
			// Update the current scene
			this.sceneManager.updateScene();
		},
		
		draw: function() {
			// Draw the current scene
			this.sceneManager.drawScene();
		}
	});


### Usage ###

These methods will allow you to manage the stack of scenes currently being maintained by the 
Scene Manager.

Move to a new scene, saving the current scene on the stack:

	this.sceneManager.pushScene( newScene );

Move to a new scene and discard the current scene (useful for cutscenes):

	this.sceneManager.replaceScene( newScene );

Move to the previous scene:

	this.sceneManager.popScene();	

Return to the first scene (useful for main menu):

	this.sceneManager.popToRootScene();

Set the stack of scenes to the scenes contained in the array parameters (useful for recreating a previous state):

	this.sceneManager.setScenes( [ menuScene, gameScene, optionScene ] );

### Scenes ###

The Scene Manager class also declares a Scene class. This is a subclass of game. You may optionally 
initialize the scene with a title, in which case the title will be drawn at the center top of the
scene using the default font. All scenes provide a method to determine if they are currently being updated 
and drawn:

	myScene.isTopScene() // true, means the current scene is being drawn and updated
