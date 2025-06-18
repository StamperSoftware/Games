import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { PhraseOfTheDay } from "../phrase-of-the-day/phrase-of-the-day";
import { GameList } from "../game/list/list";

@Component({
  selector: 'app-home',
    imports: [
        PhraseOfTheDay,
        GameList
    ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
