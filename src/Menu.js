require('pixi.js');
import {DemoModule} from './DemoModule';

export class Menu extends DemoModule{
	constructor(elements){
		super();

		//
		this.container = new PIXI.Container();

		// CREATE MENU CONTENT OBJECT
		this.buttons = {};

		// CREATE BUTTONS
		for( var s in elements ){
			
			this.buttons[s] = this.container.addChild(
				new PIXI.Text( elements[s].label, {fontSize:32, textAlign:'right', fill:0xffffff} )
			);

			this.buttons[s].id = s;
			this.buttons[s].anchor.set(1,0);
			this.buttons[s].interactive = true;
			this.buttons[s].cursor = 'pointer';
			this.buttons[s].on('pointerover', this.over, this)
			this.buttons[s].on('pointertap', this.tap, this)
			this.buttons[s].on('pointerout', this.out, this)

		}


		this.on('resize', (dimensions)=>{
			var s, dy = 0;
			
			// SPREAD BUTTONS
			for( s in this.buttons){
				this.buttons[s].y = dy;
				dy += this.buttons[s].height;
			}

			this.container.x = dimensions.width - 10;
			this.container.y = 10;
			
		});


	}
	over(e){
		let btn = this.buttons[e.currentTarget.id];
		btn.style.fill = 0xcccccc;
	}
	out(e){
		let btn = this.buttons[e.currentTarget.id];
		if( !btn.selected ){
			btn.style.fill = 0xffffff;
		}
	}
	tap(e){
		this.out(e);
		this.select(e.currentTarget.id);
	}
	select(id){
		for( var s in this.buttons ){
			this.buttons[s].selected = false;
			this.buttons[s].style.fill = 0xffffff;
		}
		
		let btn = this.buttons[id];
		btn.style.fill = 0x999999;
		btn.selected = true;
		this.emit('select', id )

	}

}