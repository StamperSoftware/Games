import { Component, OnInit } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faBiohazard, faBomb, faFlag, faShield, faWarning } from "@fortawesome/free-solid-svg-icons";
import { StringToken } from "@angular/compiler";

@Component({
  selector: 'app-bomb-disposal',
    imports: [
        FaIconComponent
    ],
  templateUrl: './bomb-disposal.html',
  styleUrl: './bomb-disposal.scss'
})
export class BombDisposal implements OnInit {
    
    ngOnInit(): void {
        this.newGame();
    }
  
    gameBoard:GameSpace[][] = [];
    gameRows = 10;
    powerups : Map<Powerup, number> = new Map<Powerup, number>();
    radiationLevel = 0;
    gameInProgress = false;
    gameResult = '';
    
    endGame() {
        this.gameInProgress = false;
    }

    defuseBomb() {
        let defuseCount = this.powerups.get(Powerup.defuse);
        if (!defuseCount) return;
        this.gameResult = "Bomb Defused!!!";
        this.powerups.set(Powerup.defuse, defuseCount-1); 
    }
    
    loseGame(){
        this.gameResult = "You LOSE!!";
        this.endGame();
    }

    winGame() {
        this.gameResult = "You Win!";
        this.endGame();
    }

    newGame() {
            
        this.gameBoard = [];
        this.gameResult = '';
        this.radiationLevel = 0;
        this.resetPowerups();
        
        for (let i = 0; i < this.gameRows; i++) {
            this.gameBoard[i] = [];
            
            for (let j= 0; j < this.gameRows; j++) {
                
                const gameSpace:GameSpace = {
                    state:this.getSpaceState(),
                    isUnlocked:false,
                    isDangerous:false,
                    dangerousAdjacentCount:0,
                    isCleared:false,
                    location: {
                        row:i,
                        column:j
                    }
                };
            
                this.gameBoard[i].push(gameSpace);
            }
        }
        
        this.gameBoard
            .flat()
            .forEach(space => {
                space.dangerousAdjacentCount = this.getDangerousAdjacentCount(space);
            });
        
        this.gameInProgress = true;
    }
    
    unlockSpace(space:GameSpace) {
        
        if (!this.gameInProgress) return;
        this.gameResult = "";
        
        if (space.isUnlocked) {
            if (space.state === State.radioactive && !space.isCleared) {
                return this.lowerRadiationLevel(space);
            }
            return;
        }
        
        if (space.isDangerous) return this.markSpaceAsDangerous(space, undefined);
        
        space.isUnlocked = true;
        
        switch (space.state) {
            case State.bomb:
                this.handleBombSpace(space);
                break;
            case State.powerup:
                this.handlePowerupSpace();
                break;
            case State.radioactive:
                this.handleRadiationSpace(space);
                break;
            case State.safe:
                this.handleSafeSpace(space);
                break;
        }
    }

    private handleSafeSpace(currentSpace:GameSpace) {
        
        if (this.checkRemainingSafeSpaces() == 0) return this.winGame();
        if (currentSpace.dangerousAdjacentCount === 0) {
            this.getAdjacentSpaces(currentSpace)
                .filter(adjacentSpace => !adjacentSpace.isUnlocked && adjacentSpace.state === State.safe)
                .forEach(adjacentSpace => this.unlockSpace(adjacentSpace));
        }
    }
    
    private handleBombSpace(space:GameSpace){
        if (this.powerups.get(Powerup.defuse)) {
            space.isCleared = true;
            return this.defuseBomb();
        }
        this.loseGame();
    }
    
    private handleRadiationSpace(space:GameSpace){

        const decontaminateCount = this.powerups.get(Powerup.decontaminate);

        if (decontaminateCount) {
            this.powerups.set(Powerup.decontaminate, decontaminateCount-1);
            this.gameResult = "Blocked Radiation";
            space.isCleared = true;
            return;
        }
        
        this.radiationLevel++;
        if (this.radiationLevel === 4) this.loseGame();
    }

    private handlePowerupSpace(){
        const powerup = Math.floor(Math.random()*3);
        const count = (this.powerups.get(powerup) ?? 0) + 1;
        this.powerups.set(powerup, count);
    }
    
    private getAdjacentSpaces(space:GameSpace): GameSpace[] {
        
        const {location} = space;
        const {row,column} = location;
        
        const adjacentSpaces = [];
        
        if (row > 0) {
            //add row above current selection
            adjacentSpaces.push(this.gameBoard[row-1][column]);
            if (column > 0) adjacentSpaces.push(this.gameBoard[row-1][column-1]);
            if (column < this.gameRows-1) adjacentSpaces.push(this.gameBoard[row-1][column+1]);
        }

        //Add spaces from same row as current selection
        if (column > 0) adjacentSpaces.push(this.gameBoard[row][column-1]);
        if (column < this.gameRows-1) adjacentSpaces.push(this.gameBoard[row][column+1]);

        if (row < this.gameRows-1) {
            //add row below current selection
            adjacentSpaces.push(this.gameBoard[row+1][column]);
            if (column > 0) adjacentSpaces.push(this.gameBoard[row+1][column-1]);
            if (column < this.gameRows-1) adjacentSpaces.push(this.gameBoard[row+1][column+1]);
        }
        
        return adjacentSpaces;
    }

    private getDangerousAdjacentCount(space:GameSpace):number {
        return this.getAdjacentSpaces(space).reduce((prev, curr) => {
            switch(curr.state){
                case State.bomb:
                case State.radioactive:
                    return prev+1;
                case State.safe:
                case State.powerup:
                    return prev;
            }
        },0);
    }
    
    checkRemainingSafeSpaces():number {
        return this.gameBoard.flat().reduce((prev, cur)=>{
            if (!cur.isUnlocked && cur.state == State.safe) return prev + 1;
            return prev;
        },0);
    }
    
    lowerRadiationLevel(space:GameSpace){
        
        const decontaminateCount = this.powerups.get(Powerup.decontaminate);
        if (!decontaminateCount) {
            this.gameResult = "No Powerups";
            return;
        }
        
        this.radiationLevel--;
        this.gameResult = "Radiation has been lowered";
        this.powerups.set(Powerup.decontaminate, decontaminateCount-1);
        space.isCleared = true;
    }
    
    markSpaceAsDangerous(space: GameSpace, e?:MouseEvent){
        
        e?.preventDefault();
        if (!this.gameInProgress) return;
        
        let xrayCount = this.powerups.get(Powerup.xray);
        
        if (xrayCount) {
            this.powerups.set(Powerup.xray, xrayCount-1);
            switch(space.state) {
                case State.safe:
                case State.powerup:
                    this.unlockSpace(space);
                    break;
                case State.bomb:
                case State.radioactive:
                    space.isUnlocked = true;
                    space.isDangerous = false;
                    space.isCleared = true;
            }
            return;
        }
        
        if (!e) return; //no event means came from left click and not right click so need to stop after checking xray count 
        if (space.isUnlocked) return;
        
        space.isDangerous = !space.isDangerous;
    }
    
    private getSpaceState() : State {
        
        const MAX_RANDOM = 20;
        const random = Math.floor(Math.random()*MAX_RANDOM);
        const ratio = random / MAX_RANDOM;
        
        if (random === Math.floor(MAX_RANDOM/3)) return State.powerup;
        if (ratio <= .5) return State.safe;
        if (ratio > .5 && ratio <= .875) return State.bomb;
        
        return State.radioactive;
    }
    
    private resetPowerups() {
        this.powerups.clear();
        this.powerups.set(Powerup.decontaminate, 0);
        this.powerups.set(Powerup.defuse, 0);
        this.powerups.set(Powerup.xray, 0);
    }

    protected readonly State = State;
    protected readonly faFlag = faFlag;
    protected readonly faBiohazard = faBiohazard;
    protected readonly faBomb = faBomb;
    protected readonly faShield = faShield;
    protected readonly faWarning = faWarning;
    protected readonly Powerup = Powerup;
}

type GameSpace = {
    state:State
    isUnlocked:boolean
    isDangerous:boolean
    isCleared:boolean
    location : {row:number, column:number}
    dangerousAdjacentCount : number
}

enum Powerup { xray, defuse, decontaminate }
enum State { safe, bomb, radioactive, powerup}