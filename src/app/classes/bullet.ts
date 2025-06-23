import { Position, Animatable } from "../models";

export class Bullet implements Animatable {
    static id :number = 0;
    
    private position:Position
    degrees:number = 90;
    private ctx :CanvasRenderingContext2D;
    name : string;
    time : number = 0;
    
    constructor(ctx:CanvasRenderingContext2D, origin:Position, degrees?:number){
        this.ctx = ctx;
        this.position = {x:origin.x, y:origin.y};
        if (degrees) this.degrees = degrees;
        this.name = `bullet - ${++Bullet.id}`;
    }
    
    getPosition(){
        return {
            x : this.position.x,
            y : this.position.y,
        }
    }
    private drawImage() {
        
        this.time++;
        
        this.ctx.fillStyle = 'white'
        this.position.x += this.time * Math.cos(this.degrees*Math.PI/180);
        if (this.degrees > 0 && this.degrees <= 180) this.position.y = this.position.y+1;
        if (this.degrees > 180 && this.degrees < 360) this.position.y = this.position.y-1;
        this.ctx.fillRect(this.position.x, this.ctx.canvas.height - this.position.y, 5, 5);
    }
    
    animate(){
        this.drawImage();
    }
}