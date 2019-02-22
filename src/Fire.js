/*

	Particles - make a demo that shows an awesome fire effect. Please keep number of images low (max 10 sprites on screen at once). Feel free to use existing libraries how you would use them in a real project. 

*/

require('pixi.js');
require('pixi-particles');


import {flame} from '../assets/assets.js';
import {DemoModule} from './DemoModule';


const PARTICLE_EMITTER_SETTINGS = {
	"alpha": {
		"start": 0.4,
		"end": 0
	},
	"scale": {
		"start": 0.1,
		"end": 1,
		"minimumScaleMultiplier": 0.5
	},
	"color": {
		"start": "#fc4433",
		"end": "#ffff00"
	},
	"speed": {
		"start": 20,
		"end": 1,
		"minimumSpeedMultiplier": 0.01
	},
	"acceleration": {
		"x": 0,
		"y": -20
	},
	"maxSpeed": 0,
	"startRotation": {
		"min": 270,
		"max": 270
	},
	"noRotation": false,
	"rotationSpeed": {
		"min": -20,
		"max": 20
	},
	"lifetime": {
		"min": 0.45,
		"max": 0.7
	},
	"blendMode": "normal",
	"frequency": 0.02,
	"emitterLifetime": -1,
	"maxParticles": 10,
	"pos": {
		"x": 0,
		"y": 0
	},
	"addAtBack": true,
	"spawnType": "rect",
	"spawnRect": {
		"x": -10,
		"y": 0,
		"w": 20,
		"h": 0
	},
	"autoUpdate":true
}



export class Fire extends DemoModule{
	constructor(){
		super();

		this.emitter = new PIXI.particles.Emitter(
			this.container,
			[ new PIXI.Texture.from(flame) ],
			PARTICLE_EMITTER_SETTINGS
		);

		// SUPERCLASS TRIGGERS EVENTS
		this.on('resize', (dimensions)=>{
			this.container.y = dimensions.height*0.25
		});

		this.on('active', (boolean)=>{
			if( boolean ){
				this.elapsed = Date.now();
				//this.ticker.add(this.update, this)
			}else{
				//this.ticker.remove(this.update, this)
				this.emitter.cleanup();
			}
			this.emitter.emit = boolean;
		});
		

	}
}