document.addEventListener("DOMContentLoaded", main);
document.addEventListener("keydown", keydownHandler);
import { Actor, ActorHolder, Player, Goblin, Tree } from "./actors.js"
import {updateWorldTable, initializeWorldMap, createWorldTable, generateRandomLocation, actorPlace} from "./worldMap.js"
//TODOS IN COMMENTS

export class worldLocation {
    constructor(setX, setY) {
        this.presentActors = []
        this.x = setX;
        this.y = setY;
    }
}

export var myActorHolder = new ActorHolder();
var playerChar;
export var worldMap=[];
export var worldMapLength = 16;
var logKeyDowns=false;

function main() {
    // console.log(new Person().alive);
    initializeWorldMap();
    spawnInitialActors();
    updateWorldTable();
    // console.log(playerChar instanceof Player)
}

function spawnInitialActors() {
    // let place = generateRandomLocation();
    playerChar = new Player(8, 8);
    new Goblin(...generateRandomLocation());
    new Tree(...generateRandomLocation());
}


//THERE ARE UPDATE CALLS IN HERE
export function keydownHandler(e) {
    if(logKeyDowns){console.log(e.code);}
    switch (e.code) {
        case "ArrowUp":
            playerChar.move("up")
            break;
        case "ArrowDown":
            playerChar.move("down")
            break;
        case "ArrowLeft":
            playerChar.move("left")
            break;
        case "ArrowRight":
            playerChar.move("right")
            break;
        case "MetaLeft":
        case "ControlLeft":
            return;
            break;
        default:
            break;
    }
    myActorHolder.update();
    updateWorldTable();
}

export function clickHandler(e) {
    console.log(`location: (${e.target.cellIndex},${e.target.parentElement.rowIndex})`);
}


//checks if given actor shares its location with any actor of a given class, excluding itself
export function sharesLocation(actor, typeToLookFor) {
    for (let i = 0; i < actor.location.presentActors.length; i++) {
        if (actor.location.presentActors[i] instanceof typeToLookFor && actor.location.presentActors[i] != actor) {
            return true;
        }
    }
    return false;
}


