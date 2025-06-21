import { ElementRef, ViewChild } from "@angular/core";
import { Position } from "../models";

export abstract class GameScreen {
    
    canvasRef: ElementRef<HTMLCanvasElement>;
    protected ctx!:CanvasRenderingContext2D;
    width:number;
    height:number;
    protected items:Animatable[] = [];
    
    constructor (canvasRef:ElementRef<HTMLCanvasElement>,height:number, width:number, keyDown : (e:KeyboardEvent) => void, keyUp : (e:KeyboardEvent) => void, items:Animatable[]) {
        
        this.canvasRef = canvasRef;
        this.height = height;
        this.width = width;

        const canvas = this.canvasRef.nativeElement;
        canvas.height = this.height;
        canvas.width = this.width;
        
        this.ctx = canvas.getContext("2d")!;
        this.items = items;
        
        window.addEventListener("keydown", (e) => keyDown(e))
        window.addEventListener("keyup", (e) => keyUp(e))
    }
    
    addItem(item:Animatable){
        this.items.push(item);
    }
    
    removeItem(item:Animatable){
        this.items = this.items.filter(i => i.name != item.name);
    }
    
    abstract drawImage():void;
    
    animate(){
        this.drawImage();
        this.items.forEach(item => item.animate());
        requestAnimationFrame(() => this.animate());
    }
}

export type Animatable = {
    animate : () => void
    name: string
    getPosition:() => Position
}