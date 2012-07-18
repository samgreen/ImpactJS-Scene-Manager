/*
Plugin Name: Scene Manager
Plugin URI: https://github.com/samgreen/ImpactJS-Scene-Manager
Description: This plugin allows you to manage the various scenes of your game 
			 more efficiently. No longer do you have to declare a mountain of 
			 states to effectively separate the various screens of your game.
Version: 0.2
Current Revision Date: July 18 2011
First Revision Date: July 13 2011
Requires: ImpactJS
Author: Sam Green
Author URI: http://samgreen.co

Changelog
---------
0.2: Added lazy loading to font in case it is not being used.
	 Added sceneManager.setScenes to set the entire scene stack

0.1: Initial release.
*/

// Prototypes for our stack
Array.prototype.first = function() {
	return this[ 0 ];
};

Array.prototype.last = function() {
	return this[ this.length - 1 ];
};

ig.module( 
	'plugins.scene_manager' 
)
.requires(
	'impact.game'
)
.defines(function(){
	
	Scene = ig.Game.extend({
		title: null,
		sceneManager: null,
		font: null,
		center: { x: 0, y: 0 },
		
		init: function( title ) {
			this.title = title || null;
			
			this.center.x = ig.system.width * 0.5;
			this.center.y = ig.system.height * 0.5;
		},
		
		update: function() {
			this.parent();
			
			ig.game.collisionMap = this.collisionMap;
		},
		
		draw: function() {
			this.parent();
			
			// If a title has been set
			if ( this.title != null ) {
				// Initialize the font if we don't have one already
				if ( this.font == null ) {
					this.font = new ig.Font( 'media/04b03.font.png' );
				}
				// Draw the title in the top center of the scene
				this.font.draw( this.title, this.center.x, 2, ig.Font.ALIGN.CENTER );
			}
		},
		
		isTopScene: function() {
			if ( this.sceneManager ) {
				// Grab the top scene from the stack
				var currentScene = this.sceneManager.sceneStack.last();
				
				// Check if this scene is the current scene
				return ( this == currentScene );
			}
		},
	});
	
	SceneManager = ig.Class.extend({
		sceneStack: [],
		
		// This class is a singleton
		staticInstantiate: function() {
		    if( SceneManager.instance == null ) {
		        return null;
		    }
		    else {
		        return SceneManager.instance;
		    }
		},

		init: function() {
			// Ensure the reference is set so no other classes will initialize another sceneManager
			SceneManager.instance = this;
		},

		updateScene: function() {
			// Grab the scene from the top of the stack
			var currentScene = this.sceneStack.last();

			if (currentScene instanceof Scene) {
				// Update all the entities in the current scene
				currentScene.update();
			}
		},
		
		// Draw the current scene
		drawScene: function() {
			// Grab the scene from the top of the stack
			var currentScene = this.sceneStack.last();
			
			if (currentScene instanceof Scene) {
				// Draw all the entities in the current scene
				currentScene.draw();
			}
		},
		
		// Push a new scene on the stack and begin using it immediately
		pushScene: function( newScene ) {
			// Save a reference to the scene manager in this scene
			newScene.sceneManager = this;
			
			// Push the new scene to the top of the stack
			this.sceneStack.push( newScene );
		},
		
		// Remove the current scene from the stack, returns the current scene or null if there is only one scene
		popScene: function() {
			if (this.sceneStack.length > 1) {
				// Pop the top scene from the stack to return later
				var oldScene = this.sceneStack.pop(),
				 	newScene = this.sceneStack.last();

				// Return the scene we popped
				return oldScene;
			}
			
			return null;
		},
		
		// Remove all scenes except the first from the stack
		popToRootScene: function() {
			// Replace the current stack with only the first element
			this.sceneStack = [ this.sceneStack.slice(0, 1) ];
		},
		
		// Replace the current scene with newScene
		replaceScene: function( newScene ) {
			// Remove the last scene (index -1) and replace it with newScene
			this.sceneStack.splice(-1, 1, newScene);
		},
		
		// Replace all the scenes in the stack with the array specified by newScenes
		setScenes: function( newScenes ) {
			// Cache the length of this array so it doesn't have to be recalculated
			var numNewScenes = newScenes.length;
			
			// Push each scene in this array on to the stack
			for ( var i = 0; i < numNewScenes; i++ ) {
				// Get a reference to the current scene in this array
				var newScene = newScenes[ i ];
				
				// Add this scene to the stack
				this.pushScene( newScene );
			}
		}
	});
	
	// Ensure the instance is null so the singleton will initialize on the first call
	SceneManager.instance = null;
});