import { Actor, ActorHolder, Goblin, Tree, TestObject } from "./actors.js"
import { updateWorldTable, initializeWorldMap } from "./worldMap.js"
import { keydownHandler, addActorHandler, selectActorHandler, displaySelectedActor } from "./helperScripts/inputsHandlers.js"

export var addableActorsList = { Goblin, Tree, TestObject }



document.addEventListener("DOMContentLoaded", main);
document.addEventListener("keydown", keydownHandler);
//for adding actors from the selected cell menu
document.getElementById("addActorButton").addEventListener("click", addActorHandler);
//for selecting an actor from the selected cell menu
document.getElementById("cellContents").addEventListener("click",selectActorHandler);


export var myActorHolder = new ActorHolder();
export var myWorldMap = [];
//assumed to be square
var worldMapLength = 16;
export var logKeyDowns = false;
export var selectedCell = [];
//use array for actor to get around constancy of exports
export var selectedActor = [];

//the calls made when the page is loaded
function main() {
    console.log("Hit main")
    myWorldMap = initializeWorldMap(worldMapLength);
    spawnInitialActors();
    updateWorldTable(myWorldMap);
    populateAddActorList(addableActorsList);
}

function spawnInitialActors() {
    displaySelectedActor( new TestObject(myWorldMap,15,15) );
    new Tree(myWorldMap, 0, 0)
}

//populates the addActorSelector with the given list of actors
function populateAddActorList(actorList) {
    let addActorOptions = []
    Object.keys(actorList).forEach((key) => {
        let newActorOption = document.createElement("option");
        newActorOption.innerHTML = key;
        addActorOptions.push(newActorOption);
    })
    document.getElementById("addActorSelector").append(...addActorOptions);
}
