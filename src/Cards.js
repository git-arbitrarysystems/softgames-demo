/*
	
	Create 144 sprites (NOT graphics object) that are stack on each other like cards (so object above covers bottom one, but not completely). Every second 1 object from top of stack goes to other stack - animation of moving should be 2 seconds long. So at the end of whole process you should have reversed stack. Display number of fps in left top corner and make sure, that this demo runs well on mobile devices.

*/

require('pixi.js');
import {card}  from '../assets/assets.js';
import {TweenLite} from "gsap/TweenMax";
import {DemoModule} from './DemoModule.js';



// SINGLE CARD
export class Card extends PIXI.Sprite{
	constructor(){
		super( PIXI.Texture.from(card) );
		this.anchor.set(0.5,0.5);

		// STORE CARD SIZE FOR ACCESS IN THE Stacks-CLASS
		Card.originalWidth = this.texture.width;
		Card.originalHeight = this.texture.height;
		
	}
}

// SINGLE STACK
export class Stack{
	constructor(offsetX = 0, offsetY = 0, max = 144){
		this.content = [];
		this.max = max;
		this.offset(offsetX, offsetY);
	}
	pop(){
		return this.content.pop();
	}
	push(card, tween){
		let result = this.content.push(card);
		this.updateCardTargetPosition(card, tween);
		return result;
	}
	get length(){
		return this.content.length;
	}
	updateCardTargetPosition(card, tween = false){
		let index = this.content.indexOf(card),
			tx = this.offsetX + (index - this.max*0.5) * 0.5,
			ty = this.offsetY + (index - this.max * 0.5) * 2;
		TweenLite.to(card, tween === true ? 2 : 0, {
			x:tx,
			y:ty,
			callbackScope:this,
			onStart:function(){
				// ANIMATED ITEMS ARE IN THE DYNAMIC CONTAINER (FOR PERFORMANCE)
				card.parent.parent._dynamic.addChild(card);
			},
			onComplete:function(){
				// STATIC ITEMS ARE IN THE STATIC CONTAINER (FOR PERFORMANCE)
				card.parent.parent._static.addChild(card);
			}
		});
	}
	offset(ox = 0, oy = 0){
		this.offsetX = ox;
		this.offsetY = oy;
		this.content.forEach( this.updateCardTargetPosition, this )
	}
	updateCardScale(scale){
		this.content.forEach( function(card){
			card.scale.set(scale);
		});
	}


}



// FINAL STACKS MODULE
export class Stacks extends DemoModule{
	constructor(){
		super();

		// STATIC ITEMS ARE IN THE STATIC CONTAINER (FOR PERFORMANCE)
		this.container._static = this.container.addChild( new PIXI.Container() );
		// ANIMATED ITEMS ARE IN THE DYNAMIC CONTAINER (FOR PERFORMANCE)
		this.container._dynamic = this.container.addChild( new PIXI.Container() );
		
		// CREATE TWO STACKS OF CARDS
		this.stacks = [
			new Stack(),
			new Stack()
		];

		// PUT CARDS ON THE 1ST STACK AND ADD TO STATIC CONTAINER
		for(var i=0;i<this.stacks[0].max;i++){
			this.stacks[0].push(
				this.container._static.addChild(
					new Card()
				)
			);
		}

		// CLASS DEMOMODULE TRIGGERS EVENTS
		this.on('active', (boolean) => {

			//ALLWAYS CLEAR THE INTERVAL TO PREVENT DUPLICATE INTERVALS
			if( this.interval ) clearInterval(this.interval);
			
			if( boolean ){
				// START THE ANIMATION
				this.interval = setInterval( (function(){
					this.pop();
				}).bind(this), 1000 );
			}
		});

		// CLASS DEMOMODULE TRIGGERS EVENTS
		this.on('resize', (dimensions) => {

			let maxWidth = dimensions.width * 0.25,
				maxHeight = dimensions.height * 0.4,
				scale = Math.min(
					maxWidth/Card.originalWidth,
					maxHeight/Card.originalHeight,
					1
				);

			// RESIZE ALL CARDS
			this.stacks[0].updateCardScale(scale);
			this.stacks[1].updateCardScale(scale);

			// UPDATE STACK ROOT POSITIONS
			this.stacks[0].offset(-dimensions.width * 0.25, 0);
			this.stacks[1].offset( dimensions.width * 0.25, 0)
		});


	}


	pop(){
		
		// SWITCH DIRECTION IF STACK IS EMPTY
		if( this.stacks[0].length === 0 ){
			this.stacks = [this.stacks[1], this.stacks[0]];
		}

		// MOVE FROM ON STACK TO THE NEXT
		var card = this.stacks[0].pop();
		this.stacks[1].push(card, true);
		
	}

}


