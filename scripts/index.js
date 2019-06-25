document.addEventListener("DOMContentLoaded", main);
document.addEventListener("keydown", keydownHandler);
// document.getElementById("addActorButton").addEventListener("click",addActorHandler);
import { Actor, ActorHolder, Goblin, Tree } from "./actors.js"
import { updateWorldTable, initializeWorldMap } from "./worldMap.js"
//TODOS IN COMMENTS


export var myActorHolder = new ActorHolder();
export var myWorldMap = [];
//assumed to be square
var worldMapLength = 16;
var logKeyDowns = false;
export var selectedCell=[];

//the calls made when the page is loaded
function main() {
    console.log("Hit main")
    myWorldMap = initializeWorldMap(worldMapLength);
    spawnInitialActors();
    updateWorldTable(myWorldMap);
}

function spawnInitialActors() {
    new Tree(myWorldMap,0,0)
}

function keydownHandler(e) {
    if (logKeyDowns) { console.log(e.code); }

}


