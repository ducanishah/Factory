document.addEventListener("DOMContentLoaded", main);
document.addEventListener("keydown", keydownHandler);
import { Actor, ActorHolder, Player, Goblin, Tree, Wall } from "./actors.js"
import { updateWorldTable, initializeWorldMap, createWorldTable, worldLocation, displayCellContents } from "./worldMap.js"
import {generateRandomCoordinates, generateRandomPassableCoordinates, actorPlace} from "./worldMap.js"
//TODOS IN COMMENTS



export var myActorHolder = new ActorHolder();
var playerChar;
export var worldMap = [];
export var worldMapLength = 16;
var logKeyDowns = false;

function main() {
    // console.log(new Person().alive);
    initializeWorldMap();
    spawnInitialActors();
    updateWorldTable();
    // console.log(playerChar instanceof Player)
}

function spawnInitialActors() {
    //let place = generateRandomCoordinates();
    new Wall(...generateRandomCoordinates());
    playerChar = new Player(8, 8);
    new Goblin(...generateRandomPassableCoordinates());
    new Tree(...generateRandomPassableCoordinates());
}


//THERE ARE UPDATE CALLS IN HERE
export function keydownHandler(e) {
    if (logKeyDowns) { console.log(e.code); }
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
//for clicking on table cells
export function clickHandler(e) {
    // console.log(`location: (${e.target.cellIndex},${e.target.parentElement.rowIndex})`);
    if (e.target.cellIndex && e.target.parentElement.rowIndex) {
        displayCellContents(e.target.cellIndex, e.target.parentElement.rowIndex);
    }
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
//checks if a target coordinate location is passable
export function testIsPassable(targetX,targetY){
    if((!targetX&&targetX!=0) || (!targetY&&targetY!=0)){
        console.log(targetX+" "+targetY)
        console.log("isPassable takes target coordinates!")
        return;
    }
    let targetLocationActors=worldMap[targetX][targetY].presentActors;
    for (let i=0; i<targetLocationActors.length;i++){
        if (targetLocationActors[i].isPassable===false){
            return false;
        }
    }
    return true;
}
