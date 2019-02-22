require('pixi.js');

export class DemoModule extends PIXI.utils.EventEmitter{
	constructor(){
		super();
		this.container = new PIXI.Container();
	}
	resize(width,height){
		this.emit('resize', {width:width, height:height});
	}
	update(){
		this.emit('update');
	}
	set active(boolean){
		this._active = boolean;
		this.container.visible = boolean;
		this.emit('active', boolean );
	}
	get active(){
		return this._active || false;
	}
}