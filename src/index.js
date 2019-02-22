import css from './style.css';
require('pixi.js');

import * as images from '../assets/assets.js';
import {debounce} from "debounce";

import {Menu} from './Menu.js';
import {Stacks} from './Cards.js';
import {Popup} from './Popup.js';
import {Fire} from './Fire.js';


const DEMO_CONTENT = {
	stacks:{
		label:'Stacks',
		_constructor:Stacks
	},
	popup:{
		label:'Popup',
		_constructor:Popup
	},
	fire:{
		label:'Fire',
		_constructor:Fire
	}
}


export class App extends PIXI.Application{
    constructor(settings){
		super(settings);
		document.body.appendChild( this.view );

		// START LOADING IMAGES
		for(var s in images ){
			this.loader.add(s, images[s]);
		}
		this.loader.load( (function(){
			this.initialize();
		}).bind(this) );

    }

    initialize(){

    	// ADD FPS METER
		const FPS = this.stage.addChild( new PIXI.Text('fps:',{fontSize:16,fill:0xffffff}));
		setInterval( (function(){
			FPS.text = 'fps: ' + this.ticker.FPS.toFixed(2)
		}).bind(this), 1000 );

		// CREATE THE MENU
		this.menu = new Menu(DEMO_CONTENT);
		this.stage.addChild( this.menu.container );

		// MAKE A CONTAINER FOR THE MODULES
		this.moduleContainer = this.stage.addChildAt( new PIXI.Container() , 0);

		// STORE CREATED MODULES
		this.modules = {};

		// LISTEN FOR MENU INTERACTIONS
		this.menu.on('select', (id) => {

			if( !this.modules[id] ){
				// CREATE REQUESTED MODULE
				this.modules[id] = new DEMO_CONTENT[id]._constructor();
			}

			for( var s in this.modules ){
				var active = (s===id);
				this.moduleContainer[ active ? 'addChild' : 'removeChild' ]( this.modules[s].container );
				this.modules[s].active = active;
			}

			this.resize();
		});

		// ADD A RESIZE LISTENER
		window.addEventListener('resize', debounce( (function(){ this.resize() }).bind(this) , 100 )  );

		// START
		this.menu.select('stacks');

    }

    resize(){
    	var w = window.innerWidth,
			h = window.innerHeight;

	  	this.renderer.resize(w,h);

	  	this.moduleContainer.x = w * 0.5;
	  	this.moduleContainer.y = h * 0.5;

	  	this.menu.resize(w,h);
	  	for(var s in this.modules ){
	  		this.modules[s].resize(w,h);
	  	}
    }

}



// START THE APP
new App({
  backgroundColor:0x000000,
  legacy:true
});
