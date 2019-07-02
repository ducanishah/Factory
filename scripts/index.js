import { Actor, ActorHolder, Goblin, Tree, TestObject } from "./actors.js"
import { updateWorldTable, initializeWorldMap, WorldMap } from "./worldMap.js"
import { keydownHandler, addActorHandler, selectActorHandler, displaySelectedActor, fileInputHandler } from "./helperScripts/inputsHandlers.js"
import {checkFileReaderSupported} from "./fileReading.js"

export var addableActorsList = { Goblin, Tree, TestObject }



document.addEventListener("DOMContentLoaded", main);
document.addEventListener("keydown", keydownHandler);
//for adding actors from the selected cell menu
document.getElementById("addActorButton").addEventListener("click", addActorHandler);
//for selecting an actor from the selected cell menu
document.getElementById("cellContents").addEventListener("click", selectActorHandler);



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

    //if FileReader is supported, set up the handling. if not, tell me
    if (checkFileReaderSupported()) {
        document.getElementById("fileInput").addEventListener("change", fileInputHandler);
    } else {
        alert("The file APIs are not fully supported here. Inputting maps isn't going to work, sorry.")
    }


    myWorldMap = new WorldMap(worldMapLength);
    spawnInitialActors(myWorldMap);
    updateWorldTable(myWorldMap);
    populateAddActorList(addableActorsList);
}

function spawnInitialActors(worldMap) {
    displaySelectedActor(new TestObject(worldMap, 15, 15));
    new Tree(worldMap, 0, 0)
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
//THIS HAS TO GO ON THIS PAGE IN ORDER TO MODIFY THE EXPORTED VARIABLE
export function setmyWorldMapAndRedisplay(map){
    myWorldMap=map;
    updateWorldTable(myWorldMap);
    displaySelectedActor();
}