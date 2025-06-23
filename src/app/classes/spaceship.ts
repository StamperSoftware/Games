import { Position, Animatable } from "../models";

export class Spaceship implements Animatable {
    
    private ctx:CanvasRenderingContext2D;
    
    private width = 10;
    private height = 10;
    private position:Position;
    private verticalVelocity = 0;
    private horizontalVelocity = 0;
    private horizontalAcceleration = 0;
    private verticalAcceleration = 0;
    private maxWidth:number;
    private maxHeight:number;
    
    private MAX_VELOCITY = 4;
    private MIN_VELOCITY = -4;
    private MAX_ACCELERATION = 1;
    private MIN_ACCELERATION = -1;
    
    private followingShip?:Spaceship;
    name = "";
    type:Type = "NORMAL" ;
    lastPosition:Position;
    orbitingPoint?:Position;
    orbitingDistance = 1;
    currentAngle = 0;
    isSprinting = false;
    movingUp=false;
    movingDown=false;
    movingLeft=false;
    movingRight=false;
    image = new Image();
    isShooting = false;
    aim = 90;
    
    constructor (ctx:any, name:string, initialPosition:Position, boundary:{maxWidth:number,maxHeight:number}, type?:Type) {
        this.ctx = ctx;
        this.name = name;
        this.position = {x:initialPosition.x, y : initialPosition.y};
        this.lastPosition = {x : 0, y : 0};
        this.maxWidth = boundary.maxWidth;
        this.maxHeight = boundary.maxHeight;
        if (type) this.type = type;
        
        if (this.name === "player"){
            this.image.src = '/images/usership.svg';
            if (this.movingUp) this.image.src = '/images/flying-usership.svg';
        } else {
            this.image.src = '/images/small-ufo.svg';
        }
    }
    
    private setHorizontalAcceleration(value:number){
        this.horizontalAcceleration += value;
        if (this.horizontalAcceleration > this.MAX_ACCELERATION) this.horizontalAcceleration = this.MAX_ACCELERATION;
        if (this.horizontalAcceleration < this.MIN_ACCELERATION) this.horizontalAcceleration = this.MIN_ACCELERATION;
    }
    
    private setVerticalAcceleration(value:number){
        this.verticalAcceleration += value;
        if (this.verticalAcceleration > this.MAX_ACCELERATION) this.verticalAcceleration = this.MAX_ACCELERATION;
        if (this.verticalAcceleration < this.MIN_ACCELERATION) this.verticalAcceleration = this.MIN_ACCELERATION;
    }
    
    private setVelocity(){
        
        if (this.horizontalVelocity > -.1 && this.horizontalVelocity < .1) {
            this.horizontalVelocity = this.horizontalAcceleration;
        } else {
            
            if (this.horizontalAcceleration >= 0 && this.horizontalVelocity < 0) {
                this.horizontalVelocity = 0;
                this.horizontalAcceleration = 0;
            }
            else if (this.horizontalAcceleration <= 0 && this.horizontalVelocity > 0) {
                this.horizontalVelocity = 0;
                this.horizontalAcceleration = 0;
            }
            else this.horizontalVelocity = this.horizontalVelocity * (1 + Math.abs(this.horizontalAcceleration));
            
            if (this.horizontalVelocity > this.MAX_VELOCITY) this.horizontalVelocity = this.MAX_VELOCITY;
            if (this.horizontalVelocity < this.MIN_VELOCITY) this.horizontalVelocity = this.MIN_VELOCITY;
        }
        
        if (this.verticalVelocity > -.1 && this.verticalVelocity < .1) {
            this.verticalVelocity = this.verticalAcceleration;
        } else {
            
            if (this.verticalAcceleration >= 0 && this.verticalVelocity < 0) {
                this.verticalVelocity = 0;
                this.verticalAcceleration = 0;
            }
            else if (this.verticalAcceleration <= 0 && this.verticalVelocity > 0) {
                this.verticalVelocity = 0;
                this.verticalAcceleration = 0;
            }
            else this.verticalVelocity = this.verticalVelocity * (1 + Math.abs(this.verticalAcceleration));
            
            if (this.verticalVelocity > this.MAX_VELOCITY) this.verticalVelocity = this.MAX_VELOCITY;
            if (this.verticalVelocity < this.MIN_VELOCITY) this.verticalVelocity = this.MIN_VELOCITY;
        }
    }
    
    increaseHorizontalAcceleration() {
        this.setHorizontalAcceleration(.2);
    }
    
    decreaseHorizontalAcceleration() {
        this.setHorizontalAcceleration(-.2);
    }
    
    increaseVerticalAcceleration() {
        this.setVerticalAcceleration(.2);
    }
    
    decreaseVerticalAcceleration() {
        this.setVerticalAcceleration(-.2);
    }

    moveRight() {this.movingRight = true;}
    moveLeft() {this.movingLeft = true;}
    moveUp() {this.movingUp = true;}
    moveDown() {this.movingDown = true;}
    stopMovingUp(){this.movingUp = false;}
    stopMovingDown(){ this.movingDown = false;}
    stopMovingLeft(){this.movingLeft = false;}
    stopMovingRight(){this.movingRight = false;}
    
    getPosition():Position{
        return {
            x : this.position.x,
            y : this.position.y,
        }
    }
    
    boostUp(){
        this.position.y += 5;
    }
    
    stopShooting(){
        this.isShooting = false;
    }
    
    shootUp(){
        this.isShooting = true;
        this.aim = 90;
    }
    shootNorthEast(){
        this.isShooting = true;
        this.aim = 45;
    }
    shootNorthWet(){
        this.isShooting = true;
        this.aim = 135;
    }
    
    follow(ship:Spaceship) {
        this.followingShip = ship;
    }
    
    stopFollowing() {
        delete this.followingShip;
    }
    
    startOrbitingShip(ship:Spaceship, distance: number) {
        this.orbitingPoint = ship.position;
        this.orbitingDistance = distance ?? 1;
    }
    
    startOrbiting(point:Position, distance?:number) {
        this.orbitingPoint = point;
        this.orbitingDistance = distance ?? 1;
    }
    
    stopOrbiting(){
        delete this.orbitingPoint;
    }
    
    private calculateOrbit(center:Position) {
        this.position.x = center.x + (50 * this.orbitingDistance * Math.cos(this.currentAngle * Math.PI/180));
        this.position.y = center.y + (50 * this.orbitingDistance * Math.sin(this.currentAngle * Math.PI/180)); 
    }
    
    private drawImage(){
        
        if (this.followingShip) {
            this.ctx.fillStyle = 'red';
            this.position.x = this.followingShip.lastPosition.x;
            this.position.y = this.followingShip.lastPosition.y;
            
            if (this.orbitingPoint) {
                this.ctx.fillStyle = 'orangered'
                this.calculateOrbit({x:this.followingShip.lastPosition.x, y:this.followingShip.lastPosition.y});
                this.currentAngle = ((this.currentAngle + 1) % 360);
            }
            
        } else if (this.orbitingPoint) {
            this.ctx.fillStyle = 'orange';
            this.calculateOrbit({x:this.orbitingPoint.x, y:this.orbitingPoint.y});
            this.currentAngle = ((this.currentAngle + 1) % 360);
        }
        else {
            
            this.ctx.fillStyle = 'blue';
            if (this.movingUp) {
                this.position.y++
                if(this.isSprinting){
                this.position.y += 4;
                }
            }
            if (this.movingDown) {
                this.position.y--
                if(this.isSprinting){
                this.position.y -= 4;
                }
            }
            if (this.movingLeft) {
                this.position.x--
                if(this.isSprinting){
                this.position.x -= 4;
                }
            }
            if (this.movingRight) {
                this.position.x++
                if(this.isSprinting){
                this.position.x += 4;
                }
            }
            //this.setVelocity();
            //this.position.x += this.horizontalVelocity;
            //this.position.y += this.verticalVelocity;
        }
        
        if (this.position.x > this.maxWidth - this.width) {
            this.horizontalAcceleration = -1 * this.horizontalAcceleration;
            this.horizontalVelocity = -1 * this.horizontalVelocity;
            this.position.x = this.maxWidth-this.width;
        }
        if (this.position.x < 0) {
            this.horizontalAcceleration = -1 * this.horizontalAcceleration;
            this.horizontalVelocity = -1 * this.horizontalVelocity;
            this.position.x = 0;
        }
        
        if (this.position.y > this.maxHeight) {
            this.verticalVelocity = -1 * this.verticalVelocity;
            this.verticalAcceleration = -1 * this.verticalAcceleration;
            this.position.y = this.maxHeight
        }
        
        if (this.position.y < this.height) { 
            this.verticalVelocity = -1 * this.verticalVelocity;
            this.verticalAcceleration = -1 * this.verticalAcceleration;
            this.position.y = this.height;
        }
        
        if(Math.abs(this.lastPosition.x - this.position.x) > 15) this.lastPosition.x = this.position.x;
        if(Math.abs(this.lastPosition.y - this.position.y) > 15) this.lastPosition.y = this.position.y;
        
        if (this.name === 'player') {
            this.image.src = '/images/usership.svg';
            if (this.movingUp) this.image.src = '/images/flying-usership.svg';
        }
        
        this.ctx.drawImage(this.image, this.position.x,this.maxHeight - this.position.y);   
    }
    
    animate(){
        this.drawImage();
    }

    
}
type Type = "ORBITER" | "ORBITER_FOLLOWER" | "FOLLOWER" | "NORMAL"
