import { Position, Animatable } from "../models";

export class Dropship implements Animatable {
    
    ctx:CanvasRenderingContext2D;
    name: string;
    image = new Image();
    private position:Position = {x:0,y:0};
    time = 0;
    height = 68;
    width = 140;
    health = 5;
    
    constructor (ctx:CanvasRenderingContext2D ,name:string, initialPosition?:Position) {
        this.ctx = ctx;
        this.name = name;
        this.image.src = 'images/dropship.svg'
        if (initialPosition) this.position = initialPosition;
        this.time = Math.floor(Math.random()*360);
    }
    
    wasHit(){
        return --this.health;
    }
    
    getPosition(){
        return {
            x: this.position.x,
            y : this.position.y
        }
    }
    
    drawImage(){
        
        this.time = (this.time + 1) % 360;
        this.position.x = this.position.x + Math.cos(this.time*Math.PI/180)
        this.ctx.drawImage(this.image, this.position.x, this.position.y)
    }
    
    animate() {
        this.drawImage();    
    }
}