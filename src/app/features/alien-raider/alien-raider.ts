import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Game } from "./game";

@Component({
  selector: 'app-alien-raider',
  imports: [],
  templateUrl: './alien-raider.html',
  styleUrl: './alien-raider.scss'
})
export class AlienRaider implements AfterViewInit  {
    
  
    @ViewChild('alienRaider') canvasRef!: ElementRef<HTMLCanvasElement>;
    
    gameMessage = "";
    game?:Game;
        
    ngAfterViewInit(): void {
        this.game = new Game(this.canvasRef, 500, 500, (e) => this.handleDown(e), (e) => this.handleUp(e), [], () => {this.winGame()});
        this.start();
    }
    
    winGame(){
        this.gameMessage = "THANK YOU! You have defeated the alien raiders!"    
    }
    
    start(){
        if (!this.game) return;
        this.game.startGame();
    }
    
    startSpawningAliens() {
        if (!this.game) return;
        this.game.startSpawningAliens();
    }
    
    killRandomAlien(){ 
        if (!this.game) return;
        this.game.killRandomAlien()
    }
    
    startFollowing(){
        if (!this.game) return;
        this.game.startFollowing();
    }
    
    stopFollowing() {
        if (!this.game) return;
        this.game.stopFollowing();
    }
        
    startOrbitingPlayer(){
        if (!this.game) return;
        this.game.startOrbitingPlayer();
    }
    
    stopOrbiting() {
        if (!this.game) return;
        this.game.stopOrbiting();
    }
    
    speedUpSpawn(){
        if (!this.game) return;
        this.game.speedUpSpawn();
    }
    
    handleDown(e:KeyboardEvent) {
        this.game?.handleKeyDown(e);
    }
    handleUp(e:KeyboardEvent) {
        this.game?.handleKeyUp(e);
    }
    
}
