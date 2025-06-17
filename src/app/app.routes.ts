import { Routes } from '@angular/router';
import { Home } from "./features/home/home";
import { GameList } from "./features/game/list/list";
import { BombDisposal } from "./features/bomb-disposal/bomb-disposal";

export const routes: Routes = [
    {path:"", component:Home},
    {path:"games", component:GameList},
    {path:"games/bomb-disposal", component:BombDisposal},
];
