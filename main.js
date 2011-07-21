ig.module( 
	'game.main' 
)
.requires(
	// Impact
	'impact.game',
	
	// Plugins
	'plugins.scene_manager',
)
.defines(function(){
	ParentGame = ig.Game.extend({
		sceneManager: new SceneManager(),

		init: function() {
			// Push the menu scene on to the stack
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
	
	MenuScene = Scene.extend({
		init: function( title ) {
			this.parent( 'Menu Scene' );
		
			this.clearColor = '#126';
		
			ig.input.bind( ig.KEY.MOUSE1, 'mouseClick' );
		},
	
		update: function() {
			// Update all entities and backgroundMaps
			this.parent();
		
			if ( ig.input.pressed( 'mouseClick' ) ) {
				this.sceneManager.pushScene( new GameScene() );
			}
		},
	
		draw: function() {		
			// Draw all entities and backgroundMaps
			this.parent();
			
			// Save the current context
			ig.system.context.save();
			
			// Set some properties on the context
			ig.system.context.fillStyle = 'white';
			ig.system.context.textAlign = 'center';

			// Menu Text
			ig.system.context.font = 'bold 36px sans-serif';
			ig.system.context.fillText( 'Main Menu', this.center.x, this.center.y - 40);
			ig.system.context.fillText( 'Click this screen to continue', this.center.x, this.center.y + 40);

			// Restore the previous context
			ig.system.context.restore();
		}
	});
	
	GameScene = Scene.extend({
		clickCount: 0,
		gameTimer: null,
		GAME_LENGTH: 10,
	
		init: function( title ) {
			this.parent( 'Game Scene' );
		
			this.clearColor = '#420';
		
			ig.input.bind( ig.KEY.MOUSE1, 'mouseClick' );
			
			this.gameTimer = new ig.Timer( this.GAME_LENGTH );
		},
	
		update: function() {
			// Update all entities and backgroundMaps
			this.parent();
			
			// If the game timer has fully elapsed
			if ( this.gameTimer.delta() >= 0 ) {
				// Return to the menu scene
				this.sceneManager.popToRootScene();
				
				// Don't allow any more clicks
				return;
			}
			
			// Increment the click count on mouse press
			if ( ig.input.pressed( 'mouseClick' ) ) {
				this.clickCount++;
			}
		},
	
		draw: function() {
			// Don't render any frames if the game is over
			if ( this.gameTimer.delta() >= 0 ) return;
			
			// Draw all entities and backgroundMaps
			this.parent();
			
			// Save the current context
			ig.system.context.save();
			
			// Set some properties on the context
			ig.system.context.fillStyle = 'black';
			ig.system.context.textAlign = 'center';

			// Game Text
			ig.system.context.font = 'bold 36px sans-serif';
			ig.system.context.fillText( 'Click as fast as you can!', this.center.x, this.center.y - 40 );
			ig.system.context.fillText( this.clickCount + ' clicks', this.center.x, this.center.y + 40 );
			ig.system.context.fillText( Math.abs( this.gameTimer.delta() ) + ' seconds left!', this.center.x, this.center.y + 80 );

			// Restore the previous context
			ig.system.context.restore();
		}
	});

	ig.main( '#canvas', ParentGame, 60, 1024, 768, 1 );
});