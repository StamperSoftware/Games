import { Position } from "./position";

export type Animatable = {
    animate : () => void
    name: string
    getPosition:() => Position
}