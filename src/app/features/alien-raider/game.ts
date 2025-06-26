import { Bullet, GameScreen, Spaceship, Dropship } from "../../classes";
import { Position, Animatable } from "../../models";
import { ElementRef } from "@angular/core";

export class Game extends GameScreen {
    
    player? :Spaceship;
    aliens : Spaceship[] = [];
    spaceships:Spaceship[] = [];
    dropships:Dropship[] = [];
    private spawnTiming = 2500;
    background = new Image(500, 500);
    winGameCallback: ()=>void;
    currentlySpawning = false;
    
    constructor (canvasRef:ElementRef<HTMLCanvasElement>,height:number, width:number, keyDown : (e:KeyboardEvent) => void, keyUp : (e:KeyboardEvent) => void, items:Animatable[], winGameCallback : () => void) {
        super(canvasRef, height, width, keyDown, keyUp, items);
        this.background.src = 'backgrounds/alien-raider-background.svg';
        this.winGameCallback = winGameCallback
    }

    override drawImage() {
        this.ctx.fillStyle = 'black';
        this.ctx.drawImage(this.background,0,0);
        this.checkForCollisions();
        
        if (this.dropships.length === 0) {
            this.winGame();
        }
    }
    
    
    winGame(){
        this.winGameCallback?.();
    }
    
    checkForCollisions(){
        
        let shipDied = false;
        
        this.items?.filter(item => item.name.startsWith('bullet')).forEach(item => {
            let position = item.getPosition();
            this.dropships.forEach(ship => {
                const shipPosition = ship.getPosition();
                if (position.x >= shipPosition.x && position.x <= shipPosition.x+ship.width) {
                    if (position.y >= this.height-shipPosition.y-ship.height && position.y <= this.height-shipPosition.y) {
                        if (!this.currentlySpawning) {
                            this.startSpawningAliens();
                        }
                        let remainingHealth = ship.wasHit();
                        if (!remainingHealth) {
                            shipDied = true;
                            this.removeItem(ship);
                        }
                        this.removeItem(item);
                    }
                }
            });
        });
        
        if (shipDied) {
            this.dropships = this.dropships.filter(ship => ship.health > 0);
        }
    }

    
    handleKeyDown(e:KeyboardEvent){
        
        if (!this.player) return;
        if (e.key === " " && !e.repeat) this.createBullet();
        if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") this.player.moveUp();
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") this.player.moveLeft();
        if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") this.player.moveDown();
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") this.player.moveRight();
        if (e.key === "Shift" && !e.repeat) this.player.isSprinting = true;
    }
    
    handleKeyUp(e:KeyboardEvent){

        if (!this.player) return;
        if (e.key === " ") this.player.stopShooting()
        if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") this.player.stopMovingUp();
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") this.player.stopMovingLeft();
        if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") this.player.stopMovingDown();
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") this.player.stopMovingRight();
        if (e.key === "Shift") this.player.isSprinting = false;
    }
    
    startGame(){
        this.createPlayer();
        this.createDropships();
        this.animate();
    }
    
    createBullet() {
        
        if (!this.player) return;
        const playerPosition = this.player.getPosition();
        playerPosition.x = playerPosition.x+39;
        
        let bullet = new Bullet(this.ctx, playerPosition, 90);
        this.addItem(bullet);
        setTimeout(() => this.removeItem(bullet), 1500)
    }
    
    createDropships(){
        const dropship1 = new Dropship(this.ctx, "first-dropship",{x:55, y: 50})
        const dropship2 = new Dropship(this.ctx, "second-dropship",{x:273, y: 125})
        
        this.dropships.push(dropship1, dropship2);
        
        this.addItem(dropship1);
        this.addItem(dropship2);
    }
        
    
    createPlayer(){
        this.player = new Spaceship(this.ctx, 'player', {x:300,y:110}, {maxWidth:this.width, maxHeight:this.height});
        this.addItem(this.player);
    }
    
    createShip(name:string, position:Position) :Spaceship {
        const ship = new Spaceship(this.ctx, name, position, {maxWidth:this.width, maxHeight:this.height});
        this.addItem(ship);
        return ship;
    }
    
    speedUpSpawn() {
        if (this.spawnTiming - 500 > 300) {
            this.spawnTiming -= 500;
        } else {
            this.spawnTiming = 300;
        }
    }    
    
    startSpawningAliens() {
    
        this.currentlySpawning = true;
        if (this.aliens.length < 100) {
            this.createAlien();
        }
            
        if (this.aliens.length <= 33) this.spawnTiming = 600;
        else if (this.aliens.length <= 50) this.spawnTiming = 1000;
        else if (this.aliens.length <= 80) this.spawnTiming = 2000;
        else this.spawnTiming = 2500;
        
        if (this.dropships.length) {
            setTimeout(() => this.startSpawningAliens(), this.spawnTiming);
        } else {
            this.currentlySpawning = false;
        }
    }

    createAlien(){
        
        
        const dropshipCount = this.dropships.length;
        
        if(!dropshipCount) return;
        
        const dropship = this.dropships[Math.floor(Math.random()*dropshipCount)];
        if (!dropship) return;
        
        const position = dropship.getPosition();
        position.x += 70;
        position.y = this.height-position.y-168;
        const alien = new Spaceship(this.ctx, `alien - ${this.aliens.length + 1}`, position, {maxWidth: this.width, maxHeight: this.height-100});
        this.aliens.push(alien);
        this.addItem(alien);
        alien.moveDown();
    }

    killRandomAlien(){
       
        if (!this.aliens) return;
        
        const alien = this.getRandomAlien();
        if (!alien) return;

        this.removeItem(alien);
        this.aliens = this.aliens.filter(a => a.name !== alien.name);
    }

    getRandomAlien() {
        if (!this.aliens.length) return;
        return this.aliens[Math.floor(Math.random()*(this.aliens.length-1))];
    }

    startFollowing(){
        if (!this.player) return;
        this.getRandomAlien()?.follow(this.player);
    }

    stopFollowing() {
        this.spaceships.forEach(ship => ship.stopFollowing());
    }

    startOrbitingPlayer(){
        if (!this.player) return;
        this.spaceships.find(ship => ship.name === 'orbiting-follower')?.startOrbitingShip(this.player, 1);
    }

    stopOrbiting() {
        this.spaceships.forEach(ship => ship.stopOrbiting());
    }
    
}
