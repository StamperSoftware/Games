import { Routes } from '@angular/router';
import { Home } from "./features/home/home";
import { GameList } from "./features/game/list/list";
import { BombDisposal } from "./features/bomb-disposal/bomb-disposal";
import { AlienRaider } from "./features/alien-raider/alien-raider";

export const routes: Routes = [
    {path:"", component:Home},
    {path:"games", component:GameList},
    {path:"games/bomb-disposal", component:BombDisposal},
    {path:"games/alien-raider", component:AlienRaider},
];
