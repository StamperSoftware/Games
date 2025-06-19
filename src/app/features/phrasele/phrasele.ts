import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: 'app-phrasele',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './phrasele.html',
  styleUrl: './phrasele.scss'
})
export class Phrasele {
    
    gameWon = false;

    fg = new FormGroup({
      letter0: new FormControl('', Validators.required),
      letter1: new FormControl('', Validators.required),
      letter2: new FormControl('', Validators.required),
      letter3: new FormControl('', Validators.required),
      letter4: new FormControl(" "),
      letter5: new FormControl('', Validators.required),
      letter6: new FormControl('', Validators.required),
    });
    
    gameMessage = "";
    secretPhrase = [ 
      { letter:'h', isMatched:false, hasBeenRevealed:false, isWrong:false, index:0 },
      { letter:'i', isMatched:false, hasBeenRevealed:false, isWrong:false, index:1 },
      { letter:'r', isMatched:false, hasBeenRevealed:false, isWrong:false, index:2 },
      { letter:'e', isMatched:false, hasBeenRevealed:false, isWrong:false, index:3 },
      { letter:' ', isMatched:false, hasBeenRevealed:false, isWrong:false, index:4 },
      { letter:'m', isMatched:false, hasBeenRevealed:false, isWrong:false, index:5 },
      { letter:'e', isMatched:false, hasBeenRevealed:false, isWrong:false, index:6 },
    ];
    secretPhraseString = this.secretPhrase.reduce((prev, cur) => prev + cur.letter, "");
    guesses : Set<string> = new Set();
    
    updateGameMessage(message:string){
      this.gameMessage = message;
    }
    
    checkPhrase(){
      
        if (!this.fg.controls.letter0.value) return;
        
        let guess = this.fg.controls.letter0.value + this.fg.controls.letter1.value + this.fg.controls.letter2.value + this.fg.controls.letter3.value + this.fg.controls.letter4.value + this.fg.controls.letter5.value + this.fg.controls.letter6.value;
        if (!guess) return;
        guess = guess.toLowerCase();
        if (guess === this.secretPhraseString.toLowerCase()) return this.winGame();
        
        if (this.guesses.has(guess)) return this.updateGameMessage("You already tried that?");
        if (guess.length > this.secretPhraseString.length) return this.updateGameMessage("Too Long");
        if (guess.length < this.secretPhraseString.length) return this.updateGameMessage("Too Short (blow the whistle)");
        this.secretPhrase = this.secretPhrase.map(sp => { return {...sp, isMatched : false, hasBeenRevealed : false, isWrong: false}});
        
        for (let i = 0; i < guess.length; i++) {
            const c = guess[i];
            const secretLetter = this.secretPhrase[i];
            
            if (c === secretLetter.letter.toLowerCase()) {
              secretLetter.hasBeenRevealed = true;
              secretLetter.isMatched = false;
              this.fg.get(`letter${i}`)?.disable();
            }
        }
        
        //check for reveals before doing guess check so that we dont waste a guess on a spot that gets revealed
        let unrevealedGuesses = this.secretPhrase.filter(sp => !sp.hasBeenRevealed);
        
        for (let i = 0; i < guess.length; i++) {
            const c = guess[i];
            const secretLetter = this.secretPhrase[i];
          
            if (secretLetter.hasBeenRevealed) continue;
          
            const match = unrevealedGuesses.find(sp => sp.letter.toLowerCase() === c);
            if (match) {
                this.secretPhrase[i].isMatched = true;
                unrevealedGuesses = unrevealedGuesses.filter(g => !g.isMatched);
            }
        }
        
        this.secretPhrase = this.secretPhrase.map(sp => { 
            sp.isWrong = !(sp.isMatched || sp.hasBeenRevealed);
            return sp;
        });
        
        this.guesses.add(guess);  
        this.updateGameMessage("That was not it, try again")
    }
    
    
    winGame() {
        let tryCountMessage = '';
        
        if (this.guesses.size === 0) {
            tryCountMessage = 'You got it first try, AMAZING!';
        } else {
            tryCountMessage = `It took ${this.guesses.size+1} tries. Good guess!`
        }
        
        this.gameMessage = `YOU WIN. ${tryCountMessage}`;
        this.secretPhrase.forEach(sp => {sp.hasBeenRevealed = true; sp.isMatched = false;})
        this.gameWon = true;
        this.fg.disable();
    }
}
