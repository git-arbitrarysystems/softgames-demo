/*
	Create a tool that will allow mixed text and images in an easy way (for example displaying text with emoticons or prices with money icon). It should come up every 2 seconds a random text with images in random configuration (image + text + image, image + image + image, image + image + text, text + image + text etc) and a random font size.	
*/
require('pixi.js');

import {popup_bg,bike,colors,game,info,wiki} from '../assets/assets.js';
import {DemoModule} from './DemoModule.js';
import {TweenLite} from "gsap/TweenMax";

export class Popup extends DemoModule{
	

	constructor(){
		super()
		
		this.backgroundSprite = this.container.addChild( new PIXI.Sprite( new PIXI.Texture.from(popup_bg) ) );
		this.backgroundSprite.anchor.set(0.5);
		
		this.imageSpace = 0.8;
		this.textSpace = 0.90;
		
		// CLASS DEMOMODULE TRIGGERS EVENTS
		this.on('resize', (data) => {

			var space = 0.8,
				scale = Math.min(
				 (data.width * space) / this.backgroundSprite.texture.width,
				 (data.height * space) / this.backgroundSprite.texture.height
			)

			this.backgroundSprite.scale.set(scale);
			this.setContent( this._content, false );
		});

		// CLASS DEMOMODULE TRIGGERS EVENTS
		this.on('active', (boolean)=>{

			// ALWAY CLEAR THE INTERVAL TO PREVENT DUPLICATION
			if( this.interval ) clearInterval(this.interval);
			
			if( boolean ){

				// INITIAL CONTENT
				this.setContent( this.rand() );

				// START THE UPDATE SEQUENCE, I ADDED ON SECON TO ALLOW FOR ANIMATIONS
				this.interval = setInterval( (function(){
					this.setContent( this.rand() );
				}).bind(this), 2000+1000 );
			}
		})
		
	}
	

	setContent(array, destroyOldContent = true){

		if( this._content && destroyOldContent ){

			// HANDLE PREVIOUSLY EXISING CONTENT
			if( this.container.scale.x > 0 ){
				// ANIMATE OUT AND RETURN
				TweenLite.to(this.container.scale, 0.2, {x:0, y:0, onComplete:function(){
					this.setContent(array, destroyOldContent)
				}, callbackScope:this} );
				return;
			}

			// DESTROY OLD CONTENT
			this._content.forEach( (elem) => { elem.destroy() } )

		}

		// STORE THE CONTENT
		this._content = array || [];

		// INSERT NEW ELEMENTS
		this._content.forEach( (elem, index) => {

			// PREPARE AND ADD ELEMENTS
			elem.anchor.set(0.5);

			// VERTICAL SPREADING
			elem.y = this.backgroundSprite.height * ( 0.33 * (index+1) - 0.66 );


			if( elem instanceof PIXI.Text ){
				// HANDLE TEXT
				elem.style.fontSize = 24 + Math.floor( Math.random() * 24 );
				elem.style.wordWrap = true,
				elem.style.align = 'center';
				elem.style.wordWrapWidth = this.backgroundSprite.width * this.textSpace;
				elem.style.fontWeight = 'bold';
				
				// SAFETY CATCH // IF THE CONTAINNG BOX IS HIGHER THEN ON THIRD OF THE
				// AVAILABLE SPACE WE SHOULD REDUCE FONT SIZE UNTILL IT FITS
				while( elem.height > this.backgroundSprite.height * 0.33 * this.textSpace ){
					elem.style.fontSize--;
				}

			}else{

				// GET IMAGE DIMENSIONS AND GET SCALE TO FIT AVAILABLE SPACE
				let maxWidth = this.backgroundSprite.width * this.imageSpace,
					maxHeight = this.backgroundSprite.height * 0.33 * this.imageSpace,
					scale = Math.min(1, maxWidth / elem.texture.width, maxHeight / elem.texture.height);
				elem.scale.set(scale);
			}

			// ADD
			this.container.addChild( elem );

		});

		// ANIMATE IN
		this.container.rotation = 0;
		this.container.visible = this._content.length;
		if( this.container.scale.x === 0 ){
			TweenLite.to(this.container.scale, 0.5, {x:1, y:1} );
			TweenLite.to(this.container, 0.5, {rotation:Math.PI * -2} )
		}
		

	}
	

	rand(){
		
		// GENERATING SOME RANDOM CONTENT
		let icons = ['bike','colors','game','info','wiki'].sort( ()=>{ return Math.random()-0.5; }),
			quotes = [
				'In the beginning there was nothing, which exploded.',
				'Five exclamation marks, the sure sign of an insane mind.',
				'Hurray!!!!!',
				'And what would humans be without love? \nRARE, said Death.',
				'Real stupidity beats artificial intelligence every time.',
				'A good bookshop is just a genteel Black Hole that knows how to read.',
				'When in doubt, choose to live.',
				'Of course I\'m sane, when trees start talking to me, I don\'t talk back.',
				'Speak softly and employ a huge man with a crowbar.',
				'So much universe, and so little time.'
			].sort( ()=>{ return Math.random()-0.5; }),
			result = [];

		for(var i=0;i<3;i++){
			if( Math.random() < 0.5 ){
				result.push( new PIXI.Sprite( PIXI.Texture.from( icons.pop() ) ) );
			}else{
				result.push( new PIXI.Text( quotes.pop() ) );
			}
		}
		return result;

	}


}