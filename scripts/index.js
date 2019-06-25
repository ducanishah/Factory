document.addEventListener("DOMContentLoaded", main);
document.addEventListener("keydown", keydownHandler);
// document.getElementById("addActorButton").addEventListener("click",addActorHandler);
import { Actor, ActorHolder, Goblin, Tree, Wall, Cave, TestObject } from "./actors.js"
//REMEMBER TO UPDATE THE ACTORLIST AND TRANSLATOR
var actorList=[
    Goblin,
    Tree,
    Wall,
    Cave,
    TestObject
];
var actorMapTranslator={
    Goblin,
    Tree,
    Wall,
    Cave,
    TestObject
}
import { updateWorldTable, initializeWorldMap, } from "./worldMap.js"
//TODOS IN COMMENTS


export var myActorHolder = new ActorHolder();
export var playerChar;
export var worldMap = [];
//assumed to be square
export var worldMapLength = 16;
var logKeyDowns = false;
export var selectedCell=[];

//the calls made when the page is loaded
function main() {
    console.log("Hit main")
    populateAddActorList();
    initializeWorldMap();
    spawnInitialActors();
    updateWorldTable();
}
//what it says on the tin
function spawnInitialActors() {
    new Tree(0,0)
}

export function keydownHandler(e) {
    if (logKeyDowns) { console.log(e.code); }

}


