import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Phrasele } from "../phrasele/phrasele";
import { GameList } from "../game/list/list";

@Component({
  selector: 'app-home',
    imports: [
        Phrasele,
        GameList
    ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
